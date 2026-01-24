import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage,
    changeUserPassword
} from '../controllers/auth.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { changePasswordSchema, loginSchema, registerUserSchema } from '../validations/auth.validation.js';
import { validationRequest } from '../middlewares/validateRequest.middleware.js';


const router = Router();


// Public routes
router
    .route('/register')
    .post(
        upload.single('profileImage'),
        registerUserSchema,
        validationRequest,
        registerUser
    )

router
    .route('/login')
    .post(
        loginSchema,
        validationRequest,
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
    changePasswordSchema,
    validationRequest,
    changeUserPassword
)

router
    .route('/upload-image')
    .patch(isAuthenticated, upload.single('profileImage'), updateUserProfileImage)

export default router