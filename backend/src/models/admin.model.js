import mongoose, { Schema } from 'mongoose';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, "Password must be at least 8 characters long"],
        select: false
    },
    refreshToken: {
        type: String,
        trim: true,
        select: false
    },
    coverImage: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
        require: true
    }
}, { timestamps: true });


adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    try {
        this.password = await bcryptjs.hash(this.password, 10);
        next()
    } catch (error) {
        next()
    }
});

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
};

adminSchema.methods.generateRefreshToken = async function () {
    try {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    } catch (error) {
        console.error('Error while generating Refresh Token');
    }
};

adminSchema.methods.generateAccessToken = async function () {
    try {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    } catch (error) {
        console.error('Error while generating Refresh Token');
    }
};

export const Admin = mongoose.model('Admin', adminSchema);