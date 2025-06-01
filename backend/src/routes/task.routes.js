import { Router } from 'express'
import { body } from 'express-validator'
import {
    createTask,
    updateTask,
    updateTaskStatus,
    toggleDeleteTask,
    getTasks,
    updateTodoStatus,
    addTodoToTask,
    removeTodoFromTask,
    updateTodoText,
    getTaskById,
    updateTodoList,
} from '../controllers/task.controller.js'
import { adminOnly, isAuthenticated } from '../middlewares/auth.middleware.js';
import { validateParams } from '../middlewares/validateParams.middleware.js';


const router = Router();

router
    .route('/')
    .get(isAuthenticated, getTasks) // get all tasks
    .post(isAuthenticated, // creating a new task;
        adminOnly,
        [
            body('title').notEmpty().withMessage('Title is required'),
            body('description').notEmpty().withMessage('Description is required'),
            body('assignedTo').isArray().withMessage('AssignedTo must be a array of ID(s)'),
        ],
        createTask)

router.route('/:taskId')
    .get(isAuthenticated, validateParams, getTaskById)
    .put(isAuthenticated, adminOnly, validateParams, updateTask) // update task
    .delete(isAuthenticated, adminOnly, validateParams, toggleDeleteTask) /// delete task

router
    .route('/:taskId/status')
    .patch(
        isAuthenticated,
        [
            body('status')
                .isIn(['completed', 'pending', 'in-progress'])
                .withMessage('Only completed, pending or in-progress values are allowed')
        ],
        validateParams,
        updateTaskStatus
    ) // update tasks status
router
    .route('/:taskId/todos/')
    .post(isAuthenticated, adminOnly,
        [
            body('todos').isArray().withMessage('Todo must be an array of todos')
        ],
        validateParams,
        addTodoToTask, // add new todo to task
    )
    .put(isAuthenticated, adminOnly, validateParams, updateTodoList)
router.route('/:taskId/todos/:todoId/status').patch(isAuthenticated, updateTodoStatus) // update todo's status
router
    .route('/:taskId/todos/:todoId')
    .delete(isAuthenticated, adminOnly, validateParams, removeTodoFromTask) // remove todo from the task
    .patch(isAuthenticated, adminOnly, validateParams, updateTodoText) // update todo text



export default router
