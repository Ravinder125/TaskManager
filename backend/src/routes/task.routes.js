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
            body('assignedTo').isArray().withMessage('AssignedTo must be a array of ID(s)'),
        ],
        createTask)

router.route('/:taskId')
    .get(isAuthenticated, getTaskById)
    .put(isAuthenticated, adminOnly, updateTask) // update task
    .delete(isAuthenticated, adminOnly, toggleDeleteTask) /// delete task

router
    .route('/:taskId/status')
    .patch(isAuthenticated,
        [
            body('status')
                .isIn(['completed', 'pending', 'in-progress'])
                .withMessage('Only completed, pending or in-progress values are allowed')
        ]
        , updateTaskStatus) // update tasks status
router
    .route('/:taskId/todos/')
    .post(isAuthenticated, adminOnly,
        [
            body('todos').isArray().withMessage('Todo must be an array of todos')
        ],
        addTodoToTask
    ) // add new todo to task
router.route('/:taskId/todos/:todoId/status').patch(isAuthenticated, updateTodoStatus) // update todo's status
router
    .route('/:taskId/todos/:todoId')
    .delete(isAuthenticated, adminOnly, removeTodoFromTask) // remove todo from the task
    .patch(isAuthenticated, adminOnly, updateTodoText) // update todo text



export default router
