import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app = express();


const whitelist = ['http://localhost:5173', 'http://localhost:4000', 'http://localhost:5000', 'https://01d2swjl-5173.inc1.devtunnels.ms/', 'https://01d2swjl-5173.inc1.devtunnels.ms', 'https://01d2swjl-5173.devtunnels.ms/'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
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


import userRoutes from './routes/user.routes.js'
import adminRoutes from './routes/admin.routes.js'
import todoRoutes from './routes/todo.routes.js'

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/admins', adminRoutes)
app.use('/api/v1/todos', todoRoutes)


export default app