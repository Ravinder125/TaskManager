import {
    type HydratedDocument,
} from "mongoose";

export type UserRole = "admin" | "employee";

export interface IUser {
    fullName: {
        firstName: string;
        lastName?: string;
    };
    email: string;
    password: string;
    refreshToken?: string;
    profileImageUrl?: string;
    role: UserRole;
}

export interface IUserMethods {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateRefreshToken(): string;
    generateAccessToken(): string;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
