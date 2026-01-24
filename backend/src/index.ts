
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import app from './app.js'
import { connectToDB } from './config/db.config.js'


connectToDB()
    .then(() => {
        console.log('DB connected successfully')
        const port = process.env.PORT
        app.listen(port, () => console.log(`Server is running on port ${port}`))
    })
    .catch((error) => {
        console.error('Error while connecting to DB', error)
    })