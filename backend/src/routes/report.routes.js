import { Router } from "express";
import { adminOnly, isAuthenticated } from "../middlewares/auth.middleware.js";
import { exportTasksReport, exportUsersReport } from '../controllers/report.controller.js'


const router = Router();

router.route('/export/tasks').get(isAuthenticated, adminOnly, exportTasksReport) // Export all tasks as Excel/PDF
router.route('/export/users').get(isAuthenticated, adminOnly, exportUsersReport) // Export user-task report


export default router;
