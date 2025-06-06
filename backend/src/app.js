import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// const whitelist = ['http://localhost:5173', 'https://task-manager-three-swart.vercel.app' || process.env.CORS_ORIGIN]
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }

app.use(cors({ origin: true, credentials: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import taskRoutes from './routes/task.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import reportRoutes from './routes/report.routes.js'

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/tasks', taskRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/reports', reportRoutes)

export default app