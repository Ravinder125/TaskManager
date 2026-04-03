import dotenv from 'dotenv'
dotenv.config()
import z from 'zod'
// import { REQUIRED_ENV } from '../constant.js'

const envSchema = z.object({
    PORT: z.string().default("5000"),
    ORIGIN: z.string(),
    MONGO_URI: z.string(),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRY: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRY: z.string(),
    NODE_ENV: z.string(),
    CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    CLOUDINARY_URL: z.string(),
    REDIS_USERNAME:z.string(),
    REDIS_PASSWORD:z.string(),
    REDIS_SOCKET_HOST:z.string(),
    REDIS_SOCKET_PORT:z.string(),
})

const safeParse = z.safeParse(envSchema, process.env )

if(!safeParse.success) {
    const errorMessage = safeParse.error.message
    throw new Error(errorMessage) 
}

export const  ENV = safeParse.data

// REQUIRED_ENV.forEach((key) => {
//     if (!process.env[key]) {
//         throw new Error(`❌ Missing environment variable: ${key}`);
//     }
// });


// export const ENV = {
//     PORT: Number(process.env.PORT),
//     ORIGIN: process.env.ORIGIN as string,
//     MONGO_URI: process.env.MONGO_URI as string,
//     REDIS_URL: process.env.REDIS_URL as string,

//     ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
//     ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as string,
//     REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
//     REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as string,
//     NODE_ENV: process.env.NODE_ENV || "development",

//     CLOUD_NAME: process.env.CLOUD_NAME as string,
//     CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
//     CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
//     CLOUDINARY_URL: process.env.CLOUDINARY_URL as string,
// };
