import { Router } from "express";
import { body } from "express-validator";
import { adminOnly, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
    getUsers,
    getUserById,
    deletedUser
} from "../controllers/user.controller.js";
import { validateParams } from "../middlewares/validateParams.middleware.js";

const router = Router();

// User Management Routes
router.route('/').get(isAuthenticated, adminOnly, getUsers); // Get all users
router
    .route('/:userId')
    .get(isAuthenticated, adminOnly, validateParams, getUserById) // Get user by ID
    .delete(isAuthenticated, adminOnly, validateParams, deletedUser) // Delete user


export default router;