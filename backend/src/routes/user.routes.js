import { Router } from 'express';
import { body } from 'express-validator';
import { upload } from '../middlewares/multer.middleware.js';
import { loginUser, registerUser, getProfile, logoutUser } from '../controllers/user.controller.js'
import { authUser } from '../middlewares/auth.middleware.js';


const router = Router();

router
    .route('/register')
    .post(
        upload.fields([
            { name: 'avatar', maxCount: 1 },
            { name: 'coverImage', maxCount: 1 }
        ]),
        [
            body('username').isEmpty().withMessage('Username is required'),
            body('email').isEmail().withMessage('Email is invalid'),
            body('AdminEmail').isEmail().withMessage('Admin email is invalid'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        ],
        registerUser
    )

router
    .route('/login')
    .post(
        [
            body('email').isEmail().withMessage('Email is invalid'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        ],
        loginUser
    )

router.route('/logout').get(authUser, logoutUser)
router.route('/profile').get(authUser, getProfile)


export default router