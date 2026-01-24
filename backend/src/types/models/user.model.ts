import mongoose, { CallbackError, CallbackWithoutResultAndOptionalError, Schema } from "mongoose";
import { IUser, IUserMethods, UserDocument } from "./task.model.js";
import jwt, { SignOptions } from 'jsonwebtoken';
import argon2 from 'argon2'
import { ENV } from "../../config/env.config.js";

const {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET
} = ENV

const ACCESS_TOKEN_EXPIRES_IN = Number(ACCESS_TOKEN_EXPIRY);
const REFRESH_TOKEN_EXPIRES_IN = Number(REFRESH_TOKEN_EXPIRY);

if (!ACCESS_TOKEN_EXPIRES_IN || !REFRESH_TOKEN_EXPIRES_IN) {
    throw new Error("Invalid token expiry env variables");
}


const accessTokenOptions: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
};

const refreshTokenOptions: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
};




const userSchema = new Schema<IUser, {}, IUserMethods>(
    {
        fullName: {
            firstName: { type: String, required: true, trim: true },
            lastName: { type: String, trim: true },
        },
        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: [8, "Password must be at least 8 characters long"],
            select: false,
        },
        refreshToken: { type: String, trim: true, select: false },
        profileImageUrl: { type: String, trim: true },
        role: {
            type: String,
            enum: ["admin", "employee"],
            default: "employee",
        },
    },
    { timestamps: true }
);

/* =======================
   Hooks
======================= */

// Hash password before save
userSchema.pre<UserDocument>("save", async function (next: CallbackWithoutResultAndOptionalError) {
    try {
        if (!this.isModified("password")) return next();
        this.password = await argon2.hash(this.password);
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

userSchema.index({ fullName: 1 });


userSchema.methods.isPasswordCorrect = async function (
    password: string
): Promise<boolean> {
    return argon2.verify(this.password, password);
};

userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        { _id: this._id, email: this.email, role: this.role },
        REFRESH_TOKEN_SECRET,
        refreshTokenOptions
    );
};

userSchema.methods.generateAccessToken = function (): string {

    return jwt.sign(
        { _id: this._id, email: this.email, role: this.role },
        ACCESS_TOKEN_SECRET,
        accessTokenOptions
    );
};


export const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
    "User",
    userSchema
);
