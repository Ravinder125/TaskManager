import { asyncHandler } from '../utils/asynchandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { validationResult } from 'express-validator';
import { generateTokenForAdmin } from '../utils/generateToken.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Admin } from '../models/admin.model.js';
import { title } from 'process';

const registerAdmin = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json(ApiResponse.error(400, errors.array(), 'Validation error'));
    }

    const { email, password, username } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json(ApiResponse.error(400, 'Admin already exists'))
    }

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    const avatarLocalPath = req.files?.avatar?.[0]?.path

    if (!avatarLocalPath) {
        return res.status(400).json(ApiResponse.error(401, 'Avatar is required'))
    }

    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath)
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath)
    console.log(coverImageUrl)


    const newAdmin = await Admin.create({
        email,
        password,
        username,
        avatar: avatarUrl?.url,
        coverImage: coverImageUrl?.url || ''
    })

    return res.status(201).json(ApiResponse.success(201, newAdmin, 'Admin successfully created'))
})

const loginAdmin = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors) {
        return res.status(400).json(ApiResponse.error(400, errors.array(), 'Validation error'));
    }
    const { email, password } = req.body;
    const isAdminExist = await Admin.findOne({ email }).select('+password');

    if (!isAdminExist || !isAdminExist.isPasswordCorrect(password)) {
        return res.status(401).json(ApiResponse.error(401, 'Email or password is invalid'));
    }

    const { accessToken, refreshToken, options } = await generateTokenForAdmin(isAdminExist._id)

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(ApiResponse.success(200, isAdminExist, 'Admin successfully logged in'))
})

const getProfile = asyncHandler(async (req, res) => {
    const adminId = req.admin._id;
    const admin = await Admin.aggregate([
        {
            $match: { _id: adminId }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: 'admin',
                as: 'employees',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            email: 1,
                            avatar: 1
                        }
                    },
                    {
                        $lookup: {
                            from: 'todos',
                            localField: '_id',
                            foreignField: 'assignedTo',
                            as: 'todos',
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        title: 1,
                                        description: 1,
                                        status: 1,
                                        priority: 1,
                                        dueTo: 1,
                                        createdAt: 1,
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'todos',
                localField: '_id',
                foreignField: 'createdBy',
                as: 'todos',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            status: 1,
                            priority: 1,
                            date: 1,
                            createdAt: 1,
                            assignedTo: 1,
                        }
                    }
                ]
            }
        }
    ])

    if (!admin) {
        return res.status(400).json(ApiResponse.error(400, 'Admin not found'))
    }
    return res.status(200).json(ApiResponse.success(200, admin, 'Admin profile successfully fetched'))
})

const logoutAdmin = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(ApiResponse.success(200, null, 'Admin successfully logged out'))
})

export {
    registerAdmin,
    loginAdmin,
    getProfile,
    logoutAdmin
}