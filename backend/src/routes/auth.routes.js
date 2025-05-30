import { Router } from 'express';
import { body } from 'express-validator';
import { upload } from '../middlewares/multer.middleware.js';
import {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage,
    generateInviteToken,
    changeUserPassword
} from '../controllers/auth.controller.js'
import { isAuthenticated, adminOnly } from '../middlewares/auth.middleware.js';


const router = Router();


// Public routes
router
    .route('/register')
    .post(
        upload.single('profileImage'),
        [
            body('email').isEmail().withMessage('Email is invalid'),
            // body('AdminEmail').isEmail().withMessage('Admin email is invalid'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
            body('comfirmPassword').isLength({ min: 8 }).withMessage('Comfirm password must be at least 8 characters long')
        ],
        registerUser
    )

router
    .route('/login')
    .post(
        [
            body('email').isEmail().withMessage('Email is invalid'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
            body('comfirmPassword').isLength({ min: 8 }).withMessage('Comfirm password must be at least 8 characters long'),
        ],
        loginUser
    )

// Private routes
router.route('/logout').get(isAuthenticated, logoutUser)
router
    .route('/profile')
    .get(isAuthenticated, getUserProfile)
    .put(isAuthenticated, updateUserProfile)

router.route('/change-password').post(
    isAuthenticated,
    [
        body('currentPassword').isLength({ min: 8 }).withMessage('Current password must be at least 8 characters long'),
        body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
        body('confirmPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
    ],
    changeUserPassword
)

router
    .route('/upload-image')
    .patch(isAuthenticated, upload.single('profileImage'), updateUserProfileImage)

router
    .route('/invite/:token')
    .get(isAuthenticated, adminOnly, generateInviteToken)

export default router