import mongoose from "mongoose";
import { DB_NAME } from '../constant.js';


export const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    } catch (error) {
        console.error('Error while connecting Database', error)
        process.exit(1)
    }
}