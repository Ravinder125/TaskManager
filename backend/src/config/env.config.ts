import dotenv from 'dotenv'
dotenv.config()
import { REQUIRED_ENV } from '../constant.js'

REQUIRED_ENV.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`❌ Missing environment variable: ${key}`);
    }
});


export const ENV = {
    PORT: Number(process.env.PORT),
    ORIGIN: process.env.ORIGIN as string,
    MONGO_URI: process.env.MONGO_URI as string,
    REDIS_URL: process.env.REDIS_URL as string,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as string,
    NODE_ENV: process.env.NODE_ENV || "development",

    CLOUD_NAME: process.env.CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL as string,
};
