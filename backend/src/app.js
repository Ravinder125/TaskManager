import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();


const whitelist = ['http://localhost:5173', 'http://localhost:4000', 'http://localhost:5000', 'https://01d2swjl-5173.inc1.devtunnels.ms/', 'https://01d2swjl-5173.inc1.devtunnels.ms', 'https://01d2swjl-5173.devtunnels.ms/', undefined];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import taskRoutes from './routes/task.routes.js'

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/tasks', taskRoutes)


export default app