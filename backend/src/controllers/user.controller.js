import { asyncHandler } from '../utils/asynchandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import { User } from '../models/user.model.js';
import { generateTokenForUser } from '../utils/generateToken.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Admin } from '../models/admin.model.js';

const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json(ApiResponse.error(400, errors.array(), 'Validation error'));
    }

    const { email, password, username, AdminEmail } = req.body;

    if (!AdminEmail) {
        return res.status(400).json(ApiResponse.error(400, 'Admin email is required'));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json(ApiResponse.error(400, 'User already exists'))
    }

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    console.log(req.files)
    if (!avatarLocalPath) {
        return res.status(400).json(ApiResponse.error(400, 'Avatar is required'))
    }

    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath)
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath)

    const admin = await Admin.findOne({ email: AdminEmail })
    if (!admin) {
        return res.status(400).json(ApiResponse.error(400, 'Admin not found'))
    }

    const newUser = await User.create({
        email,
        password,
        admin: admin._id,
        username,
        avatar: avatarUrl?.url,
        coverImage: coverImageUrl?.url || ''
    })

    return res.status(201).json(ApiResponse.success(201, newUser, 'User successfully created'))
})

const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json(ApiResponse.error(400, errors.array(), 'Validation error'));
    }
    const { email, password } = req.body;
    const isUserExist = await User.findOne({ email }).select('+password');
    // console.log(email, password)
    if (!isUserExist || !isUserExist.isPasswordCorrect(password)) {
        return res.status(401).json(ApiResponse.error(401, 'Email or password is invalid'));
    }

    const { accessToken, refreshToken, options } = await generateTokenForUser(isUserExist._id)

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(ApiResponse.success(200, isUserExist, 'User successfully logined in'))
})

const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.aggregate([
        {
            $match: { _id: userId }
        },
        {
            $lookup: {
                from: 'todos',
                localField: '_id',
                foreignField: 'assignedTo',
                as: 'todos',
                pipeline: [
                    {
                        $match: { isDeleted: false, status: 'pending' }
                    }
                ]
            }
        }
    ])

    if (!user) {
        return res.status(400).json(ApiResponse.error(400, 'Admin not found'))
    }
    return res.status(200).json(ApiResponse.success(200, user, 'User profile successfully fetched'))
})

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

export {
    registerUser,
    loginUser,
    getProfile,
    logoutUser
}