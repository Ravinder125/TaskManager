import { Router } from "express";
import { body } from "express-validator";
import { adminOnly, authorization } from "../middlewares/auth.middleware.js";
import { getUsers, getUserById, deletedUser } from "../controllers/user.controller.js";

const router = Router();

// User Management Routes
router.route('/').get(authorization, adminOnly, getUsers); // Get all users
router
    .route('/:userId')
    .get(authorization, adminOnly, getUserById) // Get user by ID
    .delete(authorization, adminOnly, deletedUser) // Delete user


export default router;