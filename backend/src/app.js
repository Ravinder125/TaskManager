import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression'

const app = express();


const allowedOrigins = [
    "http://localhost:5173",          // local frontend
    "https://task-manager-mnym.vercel.app/",
    "https://task-manager-mnym-git-main-ravinder125s-projects.vercel.app/", // deployed frontend
    "https://task-manager-mnym-kj7xbx53t-ravinder125s-projects.vercel.app/"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
// Enable Gzip compression
app.use(compression())
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