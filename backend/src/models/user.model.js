import mongoose, { Schema, trusted } from 'mongoose'; import bcryptjs from 'bcryptjs'; import jwt from 'jsonwebtoken';

const fullNameSchema = new Schema({

})

const userSchema = new Schema(
    {
        fullName: { firstName: { type: String, required: true, trim: true }, lastName: { type: String, trim: true }, },
        email: { type: String, required: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], unique: true, trim: true, lowercase: true, index: true },
        password: { type: String, required: true, trim: true, minlength: [8, "Password must be at least 8 characters long"], select: false },
        refreshToken: { type: String, trim: true, select: false },
        profileImageUrl: { type: String, trim: true, },
        // admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
        role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    }, { timestamps: true });

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        this.password = await bcryptjs.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check if the provided password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    const isCorrect = await bcryptjs.compare(password, this.password);
    return isCorrect
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = async function () {
    try {
        return jwt.sign(
            { _id: this._id, email: this.email, role: this.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );
    } catch (error) {
        console.error('Error while generating Refresh Token');
    }
};

// Method to generate an access token
userSchema.methods.generateAccessToken = async function () {
    try {
        return jwt.sign(
            { _id: this._id, email: this.email, role: this.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );
    } catch (error) {
        console.error('Error while generating Access Token');
    }
};

export const User = mongoose.model('User', userSchema);
