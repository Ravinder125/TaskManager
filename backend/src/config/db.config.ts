import mongoose from "mongoose";
import { DB_NAME } from '../constant.js';
import { ENV } from './env.config.js'


export const connectToDB = async (): Promise<void> => {
    try {
        await mongoose.connect(`${ENV.MONGO_URI}/${DB_NAME}`)
    } catch (error) {
        console.error('Error while connecting Database', error)
        process.exit(1)
    }
}