import { Router } from 'express';
import { body } from 'express-validator';
import { upload } from '../middlewares/multer.middleware.js';
import { loginAdmin, registerAdmin, getProfile, logoutAdmin } from '../controllers/admin.controller.js'
import { authAdmin } from '../middlewares/auth.middleware.js';


const router = Router();

router
    .route('/register')
    .post(
        upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage' }]),
        [
            body('email').isEmail().withMessage('Email is not valid'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        ],
        registerAdmin
    )

router
    .route('/login')
    .post(
        [
            body('email').isEmail().withMessage('Email is invalid'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        ],
        loginAdmin
    )

router.route('/logout').get(authAdmin, logoutAdmin)
router.route('/profile').get(authAdmin, getProfile)


export default router