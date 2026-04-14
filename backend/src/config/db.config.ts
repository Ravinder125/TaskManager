import mongoose from "mongoose";
import { DB_NAME } from '../constant.js';
import { ENV } from './env.config.js'
import { logger } from "./logger.js";

export const connectToDB = async (): Promise<void> => {
    try {
        await mongoose.connect(`${ENV.MONGO_URI}/${DB_NAME}`)
        logger.info("Mongo DB successfully connected")
    } catch (error) {
        logger.error('Error while connecting Database', error)
        process.exit(1)
    }
}
