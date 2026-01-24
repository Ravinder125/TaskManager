import { validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import redis from "../config/redis.config.js";
import { Task } from "../models/Task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { cache, clearCache } from "../utils/cacheService.js";
import { validateObjectId } from "../utils/validateObjectId.js";

const isValidId = (id) => isValidObjectId(id);

// @desc    Create a new task (Admin only)
// @route   POST /api/tasks
// @access  Admin
const createTask = asyncHandler(async (req, res) => {
    const userId = req.user._id
    if (isValidId(!userId)) {
        return res.status(400).json(ApiResponse.error('Invalid user ID'))
    }

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

    await clearCache(false, false, { userId, taskId: task._id })

    return res.status(201).json(ApiResponse.success(201, task, 'Task successfully created'));
});

// @desc    Get task by ID
// @route   GET /api/tasks/:taskId
// @access  Admin/User
const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    if (!isValidId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Invalid task ID'));

    const pathKey = `task:${taskId}`
    let task = await cache.get(pathKey)

    if (task) {
        return res.status(200).json(ApiResponse.success(200, task, "Task fetched successfully"))
    }

    task = await Task.findById(taskId).populate('assignedTo', 'fullName profileImageUrl email');
    if (!task) return res.status(404).json(ApiResponse.error(404, 'Task not found'));

    await cache.set(pathKey, task);
    return res.status(200).json(ApiResponse.success(200, task, 'Task fetched successfully'));
});

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Admin/User
const getTasks = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { status, search, sort = "asc", priority } = req.query;

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const pathKey = `${userId}:${status || "all"}:${search || ""}:${page}:${limit}:${sort}`


    const data = await cache.get(pathKey)
    if (data) {
        return res
            .status(200)
            .json(ApiResponse.success(200, data, 'Task fetched successfully'));
    }

    const baseQuery = { isDeleted: false };
    const isAdmin = req.user.role === "admin"
    const userRole = isAdmin ? { createdBy: userId } : { assignedTo: userId }

    baseQuery[isAdmin ? "createdBy" : "assignedTo"] = userId
    if (search?.trim()) baseQuery.title = { $regex: search, $options: "i" }
    if (status?.trim()) baseQuery.status = status
    if (priority?.trim()) baseQuery.priority = priority

    const fetchTasks = Task
        .find(baseQuery)
        .sort(sort && { sort: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip)
        .populate(isAdmin ? 'assignedTo' : 'createdBy assignedTo', 'fullName email profileImageUrl');

    let [tasks, totalTasks] = await Promise.all([
        fetchTasks,
        Task.countDocuments(baseQuery)
    ]
    )
    const totalPages = Math.ceil(totalTasks / limit)

    tasks = await Promise.all(
        tasks.map(task => {
            const completedTodoCount = task.todoList.filter(todo => todo?.completed)?.length;
            return { ...task._doc, completedTodoCount };
        },

        )
    );
    const StatusArray = ["", "pending", "in-progress", "completed"]

    const [allTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all(
        StatusArray.map((s) => {
            const filter = {
                ...userRole,
                ...(s?.trim() ? { status: s.trim() } : {}),
                isDeleted: false
            };
            return Task.countDocuments(filter);
        })
    );


    const statusSummary = {
        allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks
    };

    const responseData = {
        tasks,
        statusSummary,
        pagination: {
            limit,
            totalPages,
            page,
            totalTasks
        }
    }

    await cache.set(pathKey, responseData)

    return res
        .status(200)
        .json(ApiResponse.success(200, responseData, 'Tasks fetched successfully'));
});

// @desc    Update a task
// @route   PUT /api/tasks/:taskId
// @access  Admin/User
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, attachments, priority, completedAt, dueTo, assignedTo, todoList } = req.body;
    if (!isValidId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Invalid task ID'));

    if (!title && !description && !status && !priority && !completedAt && !dueTo) {
        return res.status(400).json(ApiResponse.error(400, 'At least one field is required'));
    }

    const task = await Task.findOne({ _id: taskId, isDeleted: false });
    if (!task) return res.status(400).json(ApiResponse.error(400, "Task not found"));

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.completedAt = completedAt || task.completedAt;
    task.todoList = todoList || task.todoList;
    task.attachments = attachments || task.attachments;
    task.dueTo = dueTo || task.dueTo;

    const completedTodoCount = task.todoList?.filter(todo => todo.completed)?.length || 0;
    const totalTodos = task.todoList?.length || 0;
    task.progress = totalTodos > 0 ? Math.round((completedTodoCount / totalTodos) * 100) : 0;

    // Auto-update status based on progress
    if (task.progress === 100) {
        task.status = 'completed';
    } else if (task.progress > 0) {
        task.status = 'in-progress';
    } else {
        task.status = 'pending';
    }
    task.status = status || task.status;

    if (assignedTo) {
        if (!Array.isArray(assignedTo) && !assignedTo?.length > 0) {
            return res.status(400).json(ApiResponse.error(400, 'AssignedTo must an array of user ID(s)'));
        }
        task.assignedTo = assignedTo
    }
    const updatedTask = await task.save();
    if (!updatedTask) return res.status(500).json(ApiResponse.error(500, 'Error while updating Task'));

    const pathKey = `task:${taskId}`

    await cache.set(pathKey, updateTask)
    await clearCache(false, false, { userId: req.user._id, taskId })

    const responseData = {
        title: updateTask.title,
        description: updateTask.description,
        todoList: updateTask.todoList,
        assignedTo: updateTask.assignedTo,
        attachments: updateTask.attachments,
        dueTo: updateTask.dueTo,
        status: updateTask.status,
        priority: updateTask.priority,
    }

    return res
        .status(200)
        .json(ApiResponse.success(200, responseData, 'Task successfully updated'));
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
// @access  Admin/User
const updateTodoList = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { todoChecklist } = req.body;

    if (!Array.isArray(todoChecklist)) {
        return res.status(400).json(ApiResponse.error(400, 'Todos must be an array of todos'));
    }

    const task = await Task.findOne({ _id: taskId, isDeleted: false });
    if (!task) {
        return res.status(404).json(ApiResponse.error(404, 'Task not found'));
    }

    task.todoList = todoChecklist;

    // Auto-update progress based on todo list completion
    const completedTodoCount = task.todoList?.filter(todo => todo.completed)?.length || 0;
    const totalTodos = task.todoList?.length || 0;
    task.progress = totalTodos > 0 ? Math.round((completedTodoCount / totalTodos) * 100) : 0;

    // Auto-mark task status
    if (task.progress === 100) {
        task.status = 'completed';
    } else if (task.progress > 0) {
        task.status = 'in-progress';
    } else {
        task.status = 'pending';
    }

    await task.save();

    const pathKey = `task:${taskId}`;

    const updatedTask = await task.populate('assignedTo', 'fullName email profileImageUrl');

    await cache.set(pathKey, updatedTask);
    await clearCache(false, false, { userId: req.user._id, taskId })

    return res.status(200).json(ApiResponse.success(200, updatedTask, 'Task todo list successfully updated'));
});

// @desc    Toggle task deletion
// @route   PATCH /api/tasks/:taskId/toggle-delete
// @access  Admin
const toggleDeleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    if (!isValidId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Invalid Task ID'));

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json(ApiResponse.error(404, 'Task not found'))

    await Task.findByIdAndUpdate(
        taskId,
        { isDeleted: !task.isDeleted },
        { new: true });

    const pathKey = `task:${taskId}`

    await cache.set(pathKey, updateTask)
    await clearCache(
        false,
        false,
        {
            userId: req.user._id, taskId,
            search: { title: task.title, status: task.status }
        })

    return res.status(200).json(ApiResponse.success(200, null, 'Task deletion toggled successfully'));
});


// Currently not in used controllers 

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

    if (!isValidId([taskId, todoId])) return res.status(400).json(ApiResponse.error(400, 'Invalid Task or Todo ID'));

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
    addTodoToTask, createTask, getTaskById, getTasks, removeTodoFromTask, toggleDeleteTask, updateTask,
    updateTaskStatus,
    updateTodoList, updateTodoStatus, updateTodoText
};

