dotenv.config({ path: './.env' })

import dotenv from 'dotenv'
import app from './app.js'
import { connectToDB } from './db/db.js'


connectToDB()
    .then(() => {
        console.log('DB connected successfully')
        const port = process.env.PORT
        app.listen(port, () => console.log(`Server is running on port ${port}`))
    })
    .catch(() => {
        console.error('Error while connecting to DB', error)
    })