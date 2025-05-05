import mongoose from "mongoose";
import { DB_NAME } from '../constant.js';


export const connectToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log('Database is succesfully connected on host', connectionInstance.connection.host)

    } catch (error) {
        console.error('Error while connecting Database', error)
        process.exit(1)
    }
}