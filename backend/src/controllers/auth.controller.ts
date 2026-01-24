import { Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import sharp from "sharp";
import fs from "fs";
import { cache } from "../utils/cacheService.js";
import { UserDocument } from "../types/models/user.model.type.js";
import { CookieOptions } from "../types/controllers/auth.controller.type.js";

/* =======================
   Token helper
======================= */


const generateToken = async (
    user: UserDocument
): Promise<
    | {
        accessToken: string;
        refreshToken: string;
        options: CookieOptions;
    }
    | undefined
> => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        if (!accessToken || !refreshToken) {
            throw new Error("Error while generating tokens");
        }

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const options: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        return { accessToken, refreshToken, options };
    } catch (error) {
        console.error("Error:", error);
    }
};

/* =======================
   Controllers
======================= */

// Register
const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(ApiResponse.error(400, "Validation error"));
        }

        const { fullName, email, password, role } = req.body as {
            fullName: string;
            email: string;
            password: string;
            role: string;
        };

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res
                .status(400)
                .json(ApiResponse.error(400, "User already exists"));
        }

        const user = await User.create({
            fullName: {
                firstName: fullName.split(" ")[0],
                lastName: fullName.split(" ")[1],
            },
            email,
            password,
            role,
        });

        return res
            .status(201)
            .json(
                ApiResponse.success(201, {}, `${user.role} successfully created`)
            );
    }
);

// Login
const loginUser = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(ApiResponse.error(400, errors.array()[0].msg));
        }

        const { email, password } = req.body as {
            email: string;
            password: string;
        };

        const userExist = await User.findOne({ email }).select(
            "+password email fullName profileImageUrl role"
        );

        if (
            !userExist ||
            !(await userExist.isPasswordCorrect(password))
        ) {
            return res
                .status(401)
                .json(ApiResponse.error(401, "Email or password is invalid"));
        }

        const responseData = {
            fullName: userExist.fullName,
            role: userExist.role,
            email: userExist.email,
            _id: userExist._id,
            profileImageUrl: userExist.profileImageUrl,
        };

        await cache.set(`profile:${userExist._id}`, responseData);

        const tokens = await generateToken(userExist);
        if (!tokens) {
            throw new Error("Token generation failed");
        }

        const { options, accessToken, refreshToken } = tokens;

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                ApiResponse.success(
                    200,
                    responseData,
                    `${userExist.role} successfully logged in`
                )
            );
    }
);

// Logout
const logoutUser = asyncHandler(
    async (_: Request, res: Response) => {
        const options: CookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };

        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);

        return res
            .status(200)
            .json(
                ApiResponse.success(200, {}, "User successfully logged out")
            );
    }
);

// Profile
const getUserProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user._id;

        const cached = await cache.get(`profile:${userId}`);
        if (cached) {
            return res
                .status(200)
                .json(
                    ApiResponse.success(
                        200,
                        cached,
                        "User profile fetched from cache"
                    )
                );
        }

        const user = await User.findById(userId).select(
            "email fullName role profileImageUrl"
        );

        if (!user) {
            return res
                .status(404)
                .json(ApiResponse.error(404, "User not found"));
        }

        await cache.set(`profile:${user._id}`, user);

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    user,
                    "User profile successfully fetched"
                )
            );
    }
);

// Update profile
const updateUserProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user._id;

        const { email, fullName } = req.body as {
            email?: string;
            fullName?: { firstName?: string; lastName?: string };
        };

        const user = await User.findById(userId).select(
            "email fullName role profileImageUrl"
        );

        if (!user) {
            return res
                .status(404)
                .json(ApiResponse.error(404, "User not found"));
        }

        if (email) user.email = email;
        if (fullName?.firstName || fullName?.lastName) {
            user.fullName = {
                firstName: fullName.firstName ?? user.fullName.firstName,
                lastName: fullName.lastName,
            };
        }

        await user.save();
        await cache.set(`profile:${user._id}`, user);

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    user,
                    "User profile successfully updated"
                )
            );
    }
);

// Update profile image
const updateUserProfileImage = asyncHandler(
    async (req: Request, res: Response) => {
        const profileImageLocalPath = req.file?.path;

        if (!profileImageLocalPath) {
            return res
                .status(400)
                .json(ApiResponse.error(400, "Profile Image is required"));
        }


        const profileImage = await uploadOnCloudinary(profileImageLocalPath);

        if (!profileImage?.url) {
            return res
                .status(500)
                .json(
                    ApiResponse.error(
                        500,
                        "Error while uploading image"
                    )
                );
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profileImageUrl: profileImage.url },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            return res
                .status(400)
                .json(ApiResponse.error(400, "User not found"));
        }

        await cache.set(`profile:${user._id}`, user);

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    user.profileImageUrl,
                    "Profile image updated"
                )
            );
    }
);

// Change password
const changeUserPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json(
                    ApiResponse.error(400, errors.array()[0].msg)
                );
        }

        const { currentPassword, newPassword, confirmPassword } =
            req.body as {
                currentPassword: string;
                newPassword: string;
                confirmPassword: string;
            };

        if (newPassword !== confirmPassword) {
            return res
                .status(400)
                .json(
                    ApiResponse.error(
                        400,
                        "Passwords do not match"
                    )
                );
        }

        const user = await User.findById(req.user._id).select(
            "+password"
        );

        if (
            !user ||
            !(await user.isPasswordCorrect(currentPassword))
        ) {
            return res
                .status(401)
                .json(ApiResponse.error(401, "Password is incorrect"));
        }

        user.password = confirmPassword;
        await user.save();

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    {},
                    "Password successfully changed"
                )
            );
    }
);

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage,
    changeUserPassword,
};
