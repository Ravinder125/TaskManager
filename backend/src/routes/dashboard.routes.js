import { Router } from 'express'
import { adminOnly, isAuthenticated } from '../middlewares/auth.middleware.js'
import {
    getAdminDashboard,
    getUserDashboard,
} from '../controllers/dashboard.controller.js'


const router = Router();

router.route('/user-data').get(isAuthenticated, getUserDashboard);
router.route('/admin-data').get(isAuthenticated, adminOnly, getAdminDashboard);


export default router