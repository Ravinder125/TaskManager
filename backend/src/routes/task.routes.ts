import { Router } from 'express'
import {
    createTask,
    updateTask,
    toggleDeleteTask,
    getTasks,
    getTaskById,
} from '../controllers/task.controller.js'
import { adminOnly, isAuthenticated } from '../middlewares/auth.middleware.js';
import { validateParams } from '../middlewares/validateParams.middleware.js';
import { createTaskSchema } from '../validations/task.validation.js';
import { validationRequest } from '../middlewares/validateRequest.middleware.js';


const router = Router();

router
    .route('/')
    .get(isAuthenticated, getTasks) // get all tasks
    .post(
        isAuthenticated, // creating a new task;
        adminOnly,
        createTaskSchema,
        validationRequest,
        createTask
    )

router
    .route('/:taskId')
    .get(isAuthenticated, validateParams, getTaskById)
    .put(isAuthenticated, adminOnly, validateParams, updateTask) // update task
    .delete(isAuthenticated, adminOnly, validateParams, toggleDeleteTask) /// delete task




export default router
