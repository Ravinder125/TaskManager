import { Router } from 'express';
import { body } from 'express-validator';
import { upload } from '../middlewares/multer.middleware.js';
import {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage
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

router
    .route('/profile-image')
    .patch(isAuthenticated, upload.single('profileImage'), updateUserProfileImage)



export default router