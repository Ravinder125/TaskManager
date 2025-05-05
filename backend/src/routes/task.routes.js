import { Router } from 'express'
import { body } from 'express-validator'
import {
    createTask,
    updateTask,
    updateTaskStatus,
    toggleDeleteTask,
    getTasks
} from '../controllers/task.controller.js'
import { adminOnly, isAuthenticated } from '../middlewares/auth.middleware.js';



const router = Router();

router
    .route('/')
    .get(isAuthenticated, adminOnly, getTasks) // get all tasks
    .post(isAuthenticated, // creating a new task;
        [
            body('title').notEmpty().withMessage('Title is required'),
            body('description').notEmpty().withMessage('Description is required'),
            body('assignedTo').notEmpty().withMessage('Assigned to is required'),
        ],
        createTask)

router.route('/:taskId')
    .put(isAuthenticated, adminOnly, updateTask) // update task
    .delete(isAuthenticated, adminOnly, toggleDeleteTask) /// delete task

router.route('/:taskId/status').patch(isAuthenticated, updateTaskStatus) // update tasks status

export default router
