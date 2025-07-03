import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression'
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const app = express();


const allowedOrigins = [
    "http://localhost:5173",          // local frontend
    "https://task-manager-njjo.vercel.app",
    "https://task-manager-njjo-git-main-ravinder125s-projects.vercel.app", // deployed frontend
    "https://task-manager-njjo-e33170w1l-ravinder125s-projects.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
// Enable Gzip compression
app.use(compression())
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

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