import { asyncHandler } from '../utils/asynchandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { isValidObjectId } from 'mongoose';
import sharp from 'sharp';
import fs from 'fs'
import { cache } from '../utils/cacheService.js';


const generateToken = async (user) => {
    try {
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        if (!accessToken || !refreshToken) throw new Error('Error while generating access or refreshToken token')
        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }

        return { accessToken, refreshToken, options }

    } catch (error) {
        console.error('Error:', error)
    }
}

const isValidId = (id) => isValidObjectId(id)

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public 
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json(ApiResponse.error(400, 'Validation error'));
    }

    const { fullName, email, password, role } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).json(ApiResponse.error(400, 'User already exists'))
    }

    // TODO: Make it simple by removing the fullName split logic
    const user = await User.create({
        fullName: {
            firstName: fullName.split(' ')[0],
            lastName: fullName.split(' ')[1]
        },
        email,
        password,
        role: role,
        // inviteToken: adminInviteToken || hashedToken
    })
    // const { accessToken, refreshToken, options } = await generateToken(user)

    return res
        .status(201)
        .json(ApiResponse.success(201, {}, `${user.role} successfully created`))
})

// @desc    Login a user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json(ApiResponse.error(400, errors.array().join(',')));
    }
    const { email, password } = req.body;
    const userExist = await User.findOne({ email }).select('+password email fullName profileImageUrl role');

    if (!userExist || !(await userExist.isPasswordCorrect(password))) {
        return res.status(401).json(ApiResponse.error(401, 'Email or password is invalid'))
    }

    const responseData = {
        fullName: userExist.fullName,
        role: userExist.role,
        email: userExist.email,
        _id: userExist._id,
        profileImageUrl: userExist.profileImageUrl
    }

    await cache.set(`profile:${userExist._id}`, responseData)

    const { accessToken, refreshToken, options } = await generateToken(userExist)


    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(ApiResponse.success(
            200,
            responseData,
            `${userExist.role} successfully logged in`
        )
        )
})

// @desc    Logout a user
// @route   GET /api/v1/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (_, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None" // VERY IMPORTANT for cross-origin logout
    };

    // Clear access & refresh tokens
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res
        .status(200)
        .json(ApiResponse.success(200, {}, "User successfully logged out"));
});


// const generateInviteToken = asyncHandler(async (req, res) => {
//     if (!isValidId(req.user.id)) {
//         return res.status(200).json(ApiResponse.error(400, 'Invalid user ID'))
//     }

//     const hashedToken = crypto.randomBytes(32).toString('hex');

//     const user = await User.findByIdAndUpdate(
//         req.user.id,
//         { inviteToken: hashedToken },
//     );

//     await cache.set(`profile:${user._id}`, user)
//     return res.status(200).json(ApiResponse.success(200, { inviteToken: hashedToken || '' }, 'Admin invite token successfully generated'))
// })

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const profile = await cache.get(`profile:${userId}`)
    if (profile) {
        return res.status(200).json(ApiResponse.success(200, profile, 'User profile successfully fetched redis'))
    }

    const user = await User.findById(userId).select("email fullName role profileImageUrl")
    if (!user) {
        return res.status(404).json(ApiResponse.error(400, 'Admin not found'))
    }

    await cache.set(`profile:${user._id}`, user)
    return res.status(200).json(ApiResponse.success(200, user, 'User profile successfully fetched'));
})

// @desc     Update user profile
// @route    GET /api/v1/auth/profile
// @access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { email, fullName } = req.body;
    const user = await User.findById(userId).select("email fullName role profileImageUrl");
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
    await cache.set(`profile:${user._id}`, user)

    return res.status(200).json(ApiResponse.success(200, user, 'User profile successfully updated'))
})

// @desc     Update user profile image
// @route    GET /api/v1/auth/profile-image
// @access   Private
const updateUserProfileImage = asyncHandler(async (req, res) => {
    if (!isValidId(req.user._id)) {
        return res.status(200).json(ApiResponse.error(400, 'Invalid user ID'))
    }

    const profileImageLocalPath = req?.file?.path;
    if (!profileImageLocalPath) {
        return res.status(400).json(ApiResponse.error(400, 'Profile Image is required'));
    }

    // Formatting Image through Sharp
    await sharp(profileImageLocalPath)
        .resize({ width: 800 }) // Resize to a maximum width of 800px
        .toFormat('webp')
        .webp({ quality: 80 }) // Convert to WebP format with quality 80
        .toFile('./public/temp/profileImage.webp')

    fs.unlink(profileImageLocalPath, (err) => {
        if (err) {
            console.error('Error while deleting temporary profile image:', err);
        }
    });

    const profileImage = await uploadOnCloudinary('./public/temp/profileImage.webp');
    if (!profileImage?.url) {
        return res.status(400).json(ApiResponse.error(500, 'Error while uploading image. Please try again'))
    }

    const user = await User
        .findByIdAndUpdate(
            req.user._id,
            { profileImageUrl: profileImage.url },
            { new: true }
        )
        .select('-password -refreshToken');

    if (!user) {
        return res.status(400).json(ApiResponse.error(400, 'User not found'))
    }

    await cache.set(`profile:${user._id}`, user)
    return res.status(200).json(ApiResponse.success(200, user?.profileImageUrl, 'User profile image successfully updated'));
})

// @desc     Change user Password
// @route    POST /api/v1/auth/change-password
// @access   Private
const changeUserPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errMsg = errors.array().map(err => err.msg)
        return res.status(400).json(ApiResponse.error(400, errMsg[0]));
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        return res.status(400).json(ApiResponse.error(400, 'New password and confirm password do not match'));
    }

    const user = await User
        .findById(req.user._id)
        .select('+password');

    if (!user || !(await user.isPasswordCorrect(currentPassword))) {
        return res.status(401).json(ApiResponse.error(401, 'Password is incorrect'));
    }

    user.password = confirmPassword;
    await user.save();

    return res.status(200).json(ApiResponse.success(200, {}, 'Password successfully changed'));
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage,
    // generateInviteToken,
    changeUserPassword,
}