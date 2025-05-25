import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import { Task } from "../models/Task.model.js";
import { User } from "../models/user.model.js";
import { validateObjectId } from "../utils/validateObjectId.js";
import redis from "../config/redis.js";
import { generateCatchKey } from "../utils/generateCatcheKey.js";

// @desc    Create a new task (Admin only)
// @route   POST /api/tasks
// @access  Admin
const createTask = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(ApiResponse.error(400, errors.array().map(e => e.msg).join()));
    }

    const { title, description, date, assignedTo, attachments, todoList, priority } = req.body;

    if (!Array.isArray(assignedTo) || !validateObjectId(assignedTo)) {
        return res.status(400).json(ApiResponse.error(400, 'assignedTo must be an array of valid user IDs'));
    }

    const taskExists = await Task.findOne({ title, createdBy: req.user._id, assignedTo, isDeleted: false });
    if (taskExists) return res.status(400).json(ApiResponse.error(404, 'Task already exists'));


    const task = await Task.create({
        title,
        description,
        todoList,
        attachments,
        createdBy: req.user._id,
        assignedTo,
        priority: priority || 'medium',
        dueTo: date
    });

    if (!task) return res.status(400).json(ApiResponse.error(400, 'Error while creating Task'));

    return res.status(201).json(ApiResponse.success(201, task, 'Task successfully created'));
});

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Admin/User
const getTasks = asyncHandler(async (req, res) => {
    const path = req.path;
    const { status } = req.query;
    const data = await redis.get(generateCatchKey(path, { status }))
    if (data) {
        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    JSON.parse(data),
                    'Task fetched successfully'
                )
            );
    }

    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const filter = {
        isDeleted: false,
        ...(status && { status }),
        ...(isAdmin ? { createdBy: userId } : { assignedTo: userId })
    };

    let tasks = await Task.find(filter).populate(isAdmin ? 'assignedTo' : 'createdBy', 'fullName email profileImageUrl');

    tasks = await Promise.all(
        tasks.map(task => {
            const completedTodoCount = task.todoList.filter(todo => todo?.completed)?.length;
            return { ...task._doc, completedTodoCount };
        })
    );

    const summaryFilter = {
        isDeleted: false,
        ...(isAdmin ? { createdBy: userId } : { assignedTo: userId })
    };

    const [allTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
        Task.countDocuments(summaryFilter),
        Task.countDocuments({ ...summaryFilter, status: 'pending' }),
        Task.countDocuments({ ...summaryFilter, status: 'in-progress' }),
        Task.countDocuments({ ...summaryFilter, status: 'completed' })
    ]);

    const responseData = {
        allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks
    };

    await redis.set(path, JSON.stringify(responseData), 'EX', 300)
    return res.status(200).json(ApiResponse.success(200, {
        tasks,
        statusSummary: responseData
    }, 'Tasks fetched successfully'));
});

// @desc    Update a task
// @route   PUT /api/tasks/:taskId
// @access  Admin/User
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, attachments, priority, completedAt, dueTo, assignedTo, todoList } = req.body;

    if (!validateObjectId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Invalid Task ID'));

    if (!title && !description && !status && !priority && !completedAt && !dueTo) {
        return res.status(400).json(ApiResponse.error(400, 'At least one field is required'));
    }

    const task = await Task.findOne({ _id: taskId, isDeleted: false });
    if (!task) return res.status(400).json(ApiResponse.error(400, "Task not found"));



    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.completedAt = completedAt || task.completedAt;
    task.todoList = todoList || task.todoList;
    task.attachments = attachments || task.attachments;
    task.dueTo = dueTo || task.dueTo;

    if (assignedTo) {
        if (!Array.isArray(assignedTo) && !assignedTo?.length > 0) {
            return res.status(400).json(ApiResponse.error(400, 'AssignedTo must an array of user ID(s)'));
        }
        task.assignedTo = assignedTo
    }
    const updatedTask = await task.save();
    if (!updatedTask) return res.status(500).json(ApiResponse.error(500, 'Error while updating Task'));

    return res.status(200).json(ApiResponse.success(200, updatedTask, 'Task successfully updated'));
});

// @desc    Update task status
// @route   PATCH /api/tasks/:taskId/status
// @access  Admin/User
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!validateObjectId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Invalid Task ID'));

    const task = await Task.findOne({ _id: taskId, isDeleted: false, status: 'pending' });
    if (!task) return res.status(404).json(ApiResponse.error(404, 'Task not found'));

    const isAssigned = task.assignedTo.includes(req.user._id)
    if (!isAssigned && req.user.role !== 'admin') {
        return res.status(401).json(ApiResponse.error(401, 'Unauthorized request'))
    }

    if (status === 'completed') {
        const allTodosComplete = task.todoList.forEach(todo => todo.completed === true);
        if (!allTodosComplete) return res.status(400).json(ApiResponse.error(400, 'Every todo must be completed'));

        task.progress = 100;
    }

    task.status = status || task.status;
    await task.save();

    return res.status(200).json(ApiResponse.success(200, task, 'Task status updated successfully'));
});

// @desc    Update todo list
// @route   PUT /api/v1/:taskId/todos
// @access  Admin
const updateTodoList = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { todos } = req.body;

    if (!Array.isArray(todos)) {
        return res.status(400).json(ApiResponse.error(400, 'Todos must be an array of todos'));
    }
    if (!validateObjectId([taskId])) {
        return res.status(400).json(ApiResponse.error(400, 'Invalid id'));
    }
    const task = await Task.findOne({ _id: taskId, isDeleted: false })

    if (!task) {
        return res.status(404).json(ApiResponse.error(404, 'Task not found'));
    }

    task.todoList = todos

    // Auto-update progress based o todo list completion
    const completedCount = task.todoList?.filter(
        todo => todo.completed
    )?.length
    const totalTodos = task.todoList?.length;
    task.progress = totalTodos > 0 ? Math.round((completedCount / totalTodos) * 100) : 0;

    // Auto-mark task as completed if all times are checked
    if (task.progress === 100) {
        task.status = 'completed'
    } else if (task.progress > 0) {
        task.status = 'in-progress';
    } else {
        task.status = 'pending'
    }

    await task.save();
    const updatedTask = await Task.findById(taskId).populate('assignedTo', 'fullName email profileImageUrl')

    return res.status(200).json(ApiResponse.success(200, updatedTask, 'Task todo list successfully updated'));

})

// @desc    Toggle task deletion
// @route   PATCH /api/tasks/:taskId/toggle-delete
// @access  Admin
const toggleDeleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!validateObjectId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Invalid Task ID'));

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json(ApiResponse.error(404, "Task not found"));

    const deletedTask = await Task.findByIdAndUpdate(taskId, { isDeleted: !task.isDeleted }, { new: true });
    return res.status(200).json(ApiResponse.success(200, deletedTask, 'Task deletion toggled successfully'));
});


// @desc    Get task by ID
// @route   GET /api/tasks/:taskId
// @access  Admin/User
const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!validateObjectId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Invalid Task ID'));

    const task = await Task.findById(taskId).populate('assignedTo', 'fullName avatar coverImage');
    if (!task) return res.status(404).json(ApiResponse.error(404, 'Task not found'));

    return res.status(200).json(ApiResponse.success(200, task, 'Task fetched successfully'));
});

// @desc    Add todo to task
// @route   POST /api/tasks/:taskId/todos
// @access  Admin/User
const addTodoToTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { todos } = req.body;

    if (!validateObjectId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Invalid Task ID'));
    if (!Array.isArray(todos) || todos.length === 0) return res.status(400).json(ApiResponse.error(400, 'Todos must be a non-empty array'));

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json(ApiResponse.error(404, 'Task not found'));

    for (const todo of task.todoList) {
        for (const newTodo of todos) {
            if (newTodo.text === todo.text) {
                return res.status(400).json(ApiResponse.error(400, 'Todo already exists'));
            }
        }
    }

    task.todoList.push(...todos);
    await task.save();

    return res.status(200).json(ApiResponse.success(200, task, 'Todo successfully added to the task'));
});

// @desc    Remove todo
// @route   DELETE /api/tasks/:taskId/todos/:todoId
// @access  Admin/User
const removeTodoFromTask = asyncHandler(async (req, res) => {
    const { taskId, todoId } = req.params;

    if (!validateObjectId([taskId, todoId])) return res.status(400).json(ApiResponse.error(400, 'Invalid Task or Todo ID'));

    const task = await Task.findByIdAndUpdate(taskId, {
        $pull: { todoList: { _id: todoId } }
    }, { new: true });

    if (!task) return res.status(404).json(ApiResponse.error(404, 'Task not found'));
    return res.status(200).json(ApiResponse.success(200, task, 'Todo removed'));
});

// @desc    Update todo status
// @route   PATCH /api/tasks/:taskId/todos/:todoId/status
// @access  Admin/User
const updateTodoStatus = asyncHandler(async (req, res) => {
    const { taskId, todoId } = req.params;
    const { completed } = req.body;

    if (!validateObjectId([taskId, todoId])) return res.status(400).json(ApiResponse.error(400, 'Invalid Task or Todo ID'));

    const task = await Task.findOneAndUpdate(
        { _id: taskId, 'todoList._id': todoId },
        { $set: { 'todoList.$.completed': completed } },
        { new: true }
    );

    if (!task) return res.status(404).json(ApiResponse.error(404, 'Task not found'));
    return res.status(200).json(ApiResponse.success(200, task, 'Todo status updated'));
});

// @desc    Update todo text
// @route   PATCH /api/tasks/:taskId/todos/:todoId/text
// @access  Admin/User
const updateTodoText = asyncHandler(async (req, res) => {
    const { taskId, todoId } = req.params;
    const { text } = req.body;

    if (!validateObjectId([taskId, todoId])) return res.status(400).json(ApiResponse.error(400, 'Invalid Task or Todo ID'));

    const task = await Task.findOneAndUpdate(
        { _id: taskId, 'todoList._id': todoId },
        { $set: { 'todoList.$.text': text } },
        { new: true }
    );

    if (!task) return res.status(404).json(ApiResponse.error(404, 'Task not found'));
    return res.status(200).json(ApiResponse.success(200, task, 'Todo text updated'));
});

export {
    createTask,
    updateTask,
    updateTaskStatus,
    updateTodoList,
    toggleDeleteTask,
    getTasks,
    getTaskById,
    updateTodoStatus,
    addTodoToTask,
    removeTodoFromTask,
    updateTodoText,
};
