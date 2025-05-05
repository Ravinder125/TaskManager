import { asyncHandler } from '../utils/asynchandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


const generateToken = async (id) => {
    try {
        const user = await User.findById(id)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        console.log(refreshToken, accessToken)

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
        return res.status(400).json(ApiResponse.error(400, errors.array(), 'Validation error'));
    }

    const { email, password, adminInviteToken } = req.body;

    const profileImageLocalPath = req.file?.path
    console.log(req.file)
    if (!profileImageLocalPath) {
        return res.status(400).json(ApiResponse.error(400, 'Profile Image is required'))
    }

    let role = 'employee'
    if (
        adminInviteToken &&
        adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
        role = 'admin'
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json(ApiResponse.error(400, 'User already exists'))
    }

    const profileImage = await uploadOnCloudinary(profileImageLocalPath)
    const user = await User.create({
        email,
        password,
        profileImageUrl: profileImage?.url,
        role: role,
    })

    return res.status(201).json(ApiResponse.success(201, user, 'User successfully created'))
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
    if (!userExist || !userExist.isPasswordCorrect(password)) {
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
                },
                'User successfully logined in'))
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

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password -refreshToken')
    // const user = await User.aggregate([
    //     {
    //         $match: { _id: userId }
    //     },
    //     {
    //         $lookup: {
    //             from: 'tasks',
    //             localField: '_id',
    //             foreignField: 'assignedTo',
    //             as: 'tasks',
    //             pipeline: [
    //                 {
    //                     $match: { isDeleted: false, status: 'pending' }
    //                 }
    //             ]
    //         }
    //     }
    // ])

    if (!user) {
        return res.status(404).json(ApiResponse.error(400, 'Admin not found'))
    }
    // return res.status(200).json(
    //     ApiResponse.success(
    //         200,
    //         {
    //             _id: user[0]._id,
    //             email: user[0].email,
    //             profileImages: user[0].profileImageUrl,
    //             role: user[0].role,
    //             tasks: user[0].tasks,
    //             fullname: user[0].fullName,
    //             tasks: user[0].tasks
    //         },
    //         'User profile successfully fetched'

    //     ))
    return res.status(200).json(ApiResponse.success(200, user, 'User profile successfully fetched'));
})

// @desc     Update user profile
// @route    GET /api/v1/auth/profile
// @access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { email, fullname, password } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json(ApiResponse.error(404, 'User not found'))
    }
    if (email) user.email = email;
    if (fullname?.firstname || fullname?.lastname) {
        user.fullName = {
            firstName: fullname?.firstname,
            lastname: fullname?.lastname
        }
    }
    // if (req.file) {
    //     const profileImageLocalPath = req.file?.path
    //     const profileImage = await uploadOnCloudinary(profileImageLocalPath)
    //     if (profileImage?.url) {
    //         user.profileImageUrl = profileImage?.url
    //     }
    // }
    if (password) user.password = password;
    await user.save();
    return res.status(200).json(ApiResponse.success(200, user, 'User profile successfully updated'))
})

// @desc     Update user profile image
// @route    GET /api/v1/auth/profile-image
// @access   Private
const updateUserProfileImage = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const profileImageLocalPath = req.file?.path;
    if (!profileImageLocalPath) {
        return res.status(400).json(ApiResponse.error(400, 'Profile Image is requird'));
    }
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);
    if (!profileImage?.url) {
        return res.status(400).json(ApiResponse.error(500, 'Error while uploading image. Please try again'))
    }
    const user = await User.findByIdAndUpdate(
        userId,
        { profileImageUrl: profileImage.url },
        { new: true }
    ).select('-password -refreshToken');
    return res.status(200).json(ApiResponse.success(200, user, 'User profile image successfully updated'));
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage,
}