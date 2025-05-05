import { Router } from 'express'
import { body } from 'express-validator'
import { createTask, updateTask, updateTaskStatus, toggleDeleteTask, getAllTasks } from '../controllers/task.controller.js'
import { authorization } from '../middlewares/auth.middleware.js';



const router = Router();

router.route('/').get(authorization, getAllTasks)

router
    .route('/create')
    .post(authorization,
        [
            body('title').notEmpty().withMessage('Title is required'),
            body('description').notEmpty().withMessage('Description is required')
        ],
        createTask)

router.route('/:taskId')
    .put(authorization, updateTask)
    .patch(authorization, updateTaskStatus)
    .delete(authorization, toggleDeleteTask)


export default router
