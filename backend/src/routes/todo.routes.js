import { Router } from 'express'
import { body } from 'express-validator'
import { createTodo, updateTodo, updateTodoStatus, toggleDeleteTodo, getAllTodos } from '../controllers/todo.controller.js'
import { authUser, authAdmin } from '../middlewares/auth.middleware.js';



const router = Router();

router.route('/').get(authAdmin, getAllTodos)

router
    .route('/create')
    .post(authAdmin,
        [
            body('title').notEmpty().withMessage('Title is required'),
            body('description').notEmpty().withMessage('Description is required')
        ],
        createTodo)

router.route('/:todoId')
    .put(authAdmin, updateTodo)
    .patch(authUser, updateTodoStatus)
    .delete(authAdmin, toggleDeleteTodo)


export default router
