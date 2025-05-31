import { asyncHandler } from '../utils/asynchandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import redis from '../config/redis.js';
import { generateCatchKey } from '../utils/generateCatcheKey.js';
import { InviteToken } from '../models/inviteToken.model.js';
import crypto from 'crypto'
import { compareSync } from 'bcryptjs';


const generateToken = async (id) => {
    try {
        const user = await User.findById(id)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        if (!accessToken || !refreshToken) throw new Error('Error while generating access or refreshToken token')
        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        const options = {
            httpOnly: true,
            secure: true
        }

        return { accessToken, refreshToken, options }

    } catch (error) {
        console.error('Error:', error)
    }
}


// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public 
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json(ApiResponse.error(400, 'Validation error'));
    }

    const { fullName, email, password, adminInviteToken } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).json(ApiResponse.error(400, 'User already exists'))
    }

    const isTokenValid = await InviteToken.findOne({ token: adminInviteToken })

    if ((adminInviteToken && !isTokenValid)) {
        return res.status(400).json(ApiResponse.error(400, 'Invite token is expired or invalid'))
    }

    const hashedToken = crypto.randomBytes(32).toString('hex')
    await InviteToken.create({
        email,
        token: adminInviteToken ? adminInviteToken : hashedToken,
        role: adminInviteToken ? 'employee' : 'admin'
    })

    // TODO: Make it simple by removing the fullName split logic
    const user = await User.create({
        fullName: {
            firstName: fullName.split(' ')[0],
            lastName: fullName.split(' ')[1]
        },
        email,
        password,
        role: adminInviteToken ? 'employee' : 'admin',
    })
    const { accessToken, refreshToken, options } = await generateToken(user._id)

    return res
        .status(201)
        .json(ApiResponse.success(201, user, `${user.role} successfully created`))
})

// @desc    Login a user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json(ApiResponse.error(400, errors.array(), 'Validation error'));
    }
    const { email, password } = req.body;
    const userExist = await User.findOne({ email }).select('+password');

    if (!userExist || !(await userExist.isPasswordCorrect(password))) {
        return res.status(401).json(ApiResponse.error(401, 'Email or password is invalid'));
    }
    const { accessToken, refreshToken, options } = await generateToken(userExist._id)

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            ApiResponse.success(
                200,
                {
                    _id: userExist._id,
                    email: userExist.email,
                    profileImageUrl: userExist.profileImageUrl,
                    role: userExist.role,
                    fullName: userExist.fullName
                },
                `${userExist.role} successfully logged in`))
})

// @desc    Logout a user
// @route   GET /api/v1/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(ApiResponse.success(200, null, 'User successfully logged out'))
})

const generateInviteToken = asyncHandler(async (req, res) => {
    const { token } = req.params
    const user = await User.findById(req.user._id);
    const hashedToken = crypto.randomBytes(32).toString('hex');

    let inviteToken = await InviteToken.updateMany(
        { token, email: user.email, isExpired: false },
        { token: hashedToken },
        { new: true, }

    );

    if (!inviteToken) {
        inviteToken = await InviteToken.create({
            token: token || hashedToken,
            email: user?.email,
            role: 'admin'
        })
    }

    const tokenData = await InviteToken.findOne({ email: user.email, isExpired: false })

    return res.status(200).json(ApiResponse.success(200, { inviteToken: tokenData.token }, 'Admin invite token successfully generated'))
})

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // const path = generateCatchKey(req.path)
    // const profile = await redis.get(path)

    // if (profile) {
    //     return res.status(200).json(ApiResponse.success(200, JSON.parse(profile), 'User profile successfully fetched redis'))
    // }

    const user = await User.findById(userId).select('-password -refreshToken')

    if (!user) {
        return res.status(404).json(ApiResponse.error(400, 'Admin not found'))
    }

    let inviteToken = await InviteToken.findOne({ email: user.email })
    inviteToken = inviteToken?.token || process.env.ADMIN_INVITE_TOKEN
    // await redis.set(path, JSON.stringify(user))

    return res.status(200).json(ApiResponse.success(200, { user, inviteToken }, 'User profile successfully fetched'));
})

// @desc     Update user profile
// @route    GET /api/v1/auth/profile
// @access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
    // const path = generateCatchKey(req.path)
    // const profile = await redis.get(path)
    // if (profile) {
    //     return res.status(200).json(ApiResponse.success(200, JSON.parse(profile), 'User profile successfully updated'));
    // }

    const userId = req.user._id;
    const { email, fullName } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(ApiResponse.error(404, 'User not found'))
    }
    if (email) user.email = email;
    if (fullName?.firstName || fullName?.lastName) {
        user.fullName = {
            firstName: fullName?.firstName,
            lastName: fullName?.lastName
        }
    }

    await user.save();
    // await redis.set(path, JSON.stringify(updatedUser), 'EX', 300) // 5 min expiry
    return res.status(200).json(ApiResponse.success(200, user, 'User profile successfully updated'))
})

// @desc     Update user profile image
// @route    GET /api/v1/auth/profile-image
// @access   Private
const updateUserProfileImage = asyncHandler(async (req, res) => {
    // const path = generateCatchKey(req.path);
    // const imageUrl = await redis.get(path)
    // if (imageUrl) {
    //     return res.status(200).json(ApiResponse.success(200, JSON.parse(imageUrl), 'User profile image successfully updated'))
    // }

    const profileImageLocalPath = req?.file?.path;

    if (!profileImageLocalPath) {
        return res.status(400).json(ApiResponse.error(400, 'Profile Image is requird'));
    }
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);
    if (!profileImage?.url) {
        return res.status(400).json(ApiResponse.error(500, 'Error while uploading image. Please try again'))
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { profileImageUrl: profileImage.url },
        { new: true }
    ).select('-password -refreshToken');

    // await redis.set(path, JSON.stringify(user.profileImageUrl), 'EX', 300)
    return res.status(200).json(ApiResponse.success(200, user?.profileImageUrl, 'User profile image successfully updated'));
})

// @desc     Change user Password
// @route    POST /api/v1/auth/change-password
// @access   Private
const changeUserPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(ApiResponse.error(400, errors.array().join(',')));
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json(ApiResponse.error(400, 'New password and confirm password do not match'));
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !compareSync(currentPassword, user.password)) {
        return res.status(401).json(ApiResponse.error(401, 'Password is incorrect'));
    }

    user.password = confirmPassword;
    await user.save();
    return res.status(200).json(ApiResponse.success(200, null, 'Password successfully changed'));
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage,
    generateInviteToken,
    changeUserPassword,
}