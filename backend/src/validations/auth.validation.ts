import { body } from "express-validator";

export const registerUserSchema = [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password')
        .notEmpty().withMessage("Confirm password is required")
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmPassword')
        .notEmpty().withMessage("Confirm password is required")
        .isLength({ min: 8 }).withMessage('Confirm password must be at least 8 characters long'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['employee', 'admin']).withMessage('Role must be either user or admin')
]

export const loginSchema = [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    // body('confirmPassword').isLength({ min: 8 }).withMessage('Confirm password must be at least 8 characters long'),
]

export const changePasswordSchema = [
    body('currentPassword').isLength({ min: 8 }).withMessage('Current password must be at least 8 characters long'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
    body('confirmPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
]