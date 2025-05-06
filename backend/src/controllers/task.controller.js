import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import { Task } from "../models/Task.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

// @desc    Create a new task (Admin only)
// @route   POST /api/v1/task
// @access  Private (admin)
const createTask = asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty) {
        return res.status(400).json(ApiResponse.error(400, errors.array().map((e => e.msg)).join()))
    }
    const { title, description, date, assignedTo, attachments, todoList, priority } = req.body

    if (!Array.isArray(assignedTo)) {
        return res.status(400).json(ApiResponse.error(400, 'assignedTo to should be a array of user IDs'));
    }
    const isValidId = assignedTo.every(id => mongoose.isValidObjectId(id));
    if (!isValidId) {
        return res.status(400).json(ApiResponse.error(400, 'Invalid user ID(s) in assignedTo array'));
    }

    const TaskExists = await Task.findOne({ title, createdBy: req.user._id, assignedTo: assignedTo, isDeleted: false })
    if (TaskExists) return res.status(400).json(ApiResponse.error(404, 'Task already exist'))

    const newTask = await Task.create({
        title,
        description,
        todoList,
        attachments,
        createdBy: req.user._id,
        assignedTo: assignedTo,
        priority,
        dueTo: date
    })

    if (!newTask) return res.status(400).json(ApiResponse.error(400, 'Error while creating Task'))

    return res.status(201).json(ApiResponse.success(201, newTask, 'Task successfully created'))
})

// @desc    Update a task (Admin only)
// @route   POST /api/v1/task/:taskId
// @access  Private (admin)
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { title, description, status, priority, completedAt, dueTo } = req.body
    if (!taskId) return res.status(400).json(ApiResponse.error(400, 'Task id is required'))
    if (
        !title &&
        !description &&
        !status &&
        !priority &&
        !completedAt &&
        !dueTo) {
        return res.status(400).json(ApiResponse.error(400, 'At least one field is required'))
    }
    const TaskExists = await Task.findOne({ _id: taskId, isDeleted: false, })
    if (!TaskExists) return res.status(400).json(ApiResponse.error(400, "Task doesn't exist"))

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            description,
            title,
            isDeleted: false,
            status,
            priority,
            completedAt,
            dueTo
        },
        { new: true }
    )
    if (!updatedTask) return res.status(400).json(400, 'Error while updating Task')

    return res.status(200).json(ApiResponse.success(200, updatedTask, 'Task successfully updated'))
})

// @desc    Update task's status
// @route   POST /api/v1/task/:taskId/status
// @access  Private 
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(ApiResponse.error(400, errors.array().map((e => e.msg)).join()))
    }
    const task = await Task.findOne(
        { _id: taskId, isDeleted: false, status: 'pending' },
    )
    console.log(task)
    if (!task) return res.status(404).json(ApiResponse.error(404, 'No Task found'));
    if (status === 'completed') {
        const todoCompleted = task?.todoList.map((todo) => todo.completed)
        if (!todoCompleted?.some(t => t === 'false')) return res.status(400).json(ApiResponse.error(400, 'Every todo must be completed'))
    }
    task.status = status;
    await task.save()

    return res.status(200).json(ApiResponse.success(200, task, 'Task status updated successfully'));
})

// @desc    Delete a task (Admin only)
// @route   POST /api/v1/task/:taskId
// @access  Private (admin)
const toggleDeleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json(ApiResponse.error(404, "no Task found "));

    const deletedTask = await Task.findByIdAndUpdate(
        taskId,
        { isDeleted: !task.isDeleted },
        { new: true }
    );

    if (!deletedTask) return res.status(404).json(ApiResponse.error(404, "no Task found "));

    return res.status(200).json(ApiResponse.success(200, deletedTask, 'Task successfully deleted'))

})

// @desc    get all tasks (Admin only)
// @route   POST /api/v1/task
// @access  Private (admin)
const getTasks = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { status } = req.query;

    const isAdmin = req.user.role === 'admin';

    const taskFilter = {
        isDeleted: false,
        ...(status && { status }),
        ...(isAdmin ? { createdBy: userId } : { assignedTo: userId })
    };

    let tasks = await Task.find(taskFilter)
        .populate(isAdmin ? 'assignedTo' : 'createdBy', 'fullName email profileImageUrl');

    // Add completed todoList count
    tasks = await Promise.all(
        tasks.map(task => {
            const completedCount = task.todoList.filter(todo => todo.completed).length;
            return { ...task._doc, completedTodoCount: completedCount };
        })
    );

    // Status Summary Count Filters
    const summaryBaseFilter = {
        isDeleted: false,
        ...(isAdmin ? {} : { assignedTo: userId }) // Admin sees all, users only their tasks
    };

    const [allTasks, pendingTasks, inProgress, completedTasks] = await Promise.all([
        Task.countDocuments(summaryBaseFilter),
        Task.countDocuments({ ...summaryBaseFilter, status: 'pending' }),
        Task.countDocuments({ ...summaryBaseFilter, status: 'in-progress' }),
        Task.countDocuments({ ...summaryBaseFilter, status: 'completed' }),
    ]);

    return res.status(200).json(
        ApiResponse.success(200, {
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgress,
                completedTasks
            }
        }, 'Successfully fetched all tasks')
    );
});


// @desc    Get a task by id
// @route   GET /api/v1/tasks/:taskId
// @access  Private 
const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).populate('assignedTo', 'fullName avatar coverImage');
    if (!task) {
        return res.status(404).json(ApiResponse.error(404, 'Task not found'));
    }
    return res.status(200).json(ApiResponse.success(200, task, 'Task fetched successfully'));
})

// @desc    Add new todo to task (Admin only)
// @route   POST /api/v1/tasks/:taskId/todos/:todoId
// @access  Private (admin)
const addTodoToTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { todos } = req.body;
    if (!taskId || !mongoose.isValidObjectId(taskId)) return res.status(400).json(ApiResponse.error(400, 'Task id is required'));
    if (!Array.isArray(todos) && todos?.length === 0) {
        return res.status(400).json(ApiResponse.error(400, 'Todos must an array of todos'));
    };

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json(ApiResponse.error(404, 'No task found'));

    // Loop to check if todo already exit or not
    for (const todo of task.todoList) {
        for (const key in todos) {
            const text = todos[key];
            if (text.text === todo.text) {
                return res.status(400).json(ApiResponse.error(400, 'Todo already exist in the todo list'))
            }
        }
    }

    task.todoList.push(...todos)
    await task.save();

    return res.status(200).json(ApiResponse.success(200, task, 'Todo successfully added to the task'))

})


// @desc    Remove todo from task (Admin only)
// @route   DELETE /api/v1/tasks/:taskId/todos/:todoId
// @access  Private (admin)
const removeTodoFromTask = asyncHandler(async (req, res) => {
    const { todoId, taskId } = req.params;
    if (!todoId, !taskId) return res.status(400).json(ApiResponse.error(400, 'Both ID(s) are required'))

    if (!mongoose.isValidObjectId(todoId) && !mongoose.isValidObjectId()) {
        return res.status(400).json(ApiResponse.error(400, 'Todo and task ID(s) must be mongoose object id'));
    }
    const task = await Task.findByIdAndUpdate(
        taskId,
        {
            $pull: {
                todoList: { _id: todoId }
            }
        },
        { new: true }
    )
    if (!task) return res.status(404).json(ApiResponse.error(404, 'To task found'))
    return res.status(200).json(ApiResponse.success(200, task, 'Todo successfully removed from the task'))
})


// @desc    Add new todo to task (Admin only)
// @route   PATCH /api/v1/tasks/:taskId/todos/:todoId/status
// @access  Private (admin)
const updateTodoStatus = asyncHandler(async (req, res) => {
    const { todoId, taskId } = req.params;
    const { completed } = req.body;
    if (!todoId, !taskId) return res.status(400).json(ApiResponse.error(400, 'Both ID(s) are required'))

    if (!mongoose.isValidObjectId(todoId) && !mongoose.isValidObjectId()) {
        return res.status(400).json(ApiResponse.error(400, 'Todo and task ID(s) must be mongoose object id'));
    }

    const task = await Task.findOneAndUpdate(
        { _id: taskId, 'todoList._id': todoId },
        { $set: { 'todoList.$.completed': completed } },
        { new: true }
    )
    if (!task) return res.status(404).json(ApiResponse.error(404, 'To task found'))
    return res.status(200).json(ApiResponse.success(200, task, 'Todo status successfully updated'))

})


// @desc    Add new todo to task (Admin only)
// @route   PATCH /api/v1/tasks/:taskId/todos/:todoId
// @access  Private (admin)
const updateTodoText = asyncHandler(async (req, res) => {
    const { todoId, taskId } = req.params;
    const { text } = req.body;
    if (!todoId, !taskId) return res.status(400).json(ApiResponse.error(400, 'Both ID(s) are required'))

    if (!mongoose.isValidObjectId(todoId) && !mongoose.isValidObjectId()) {
        return res.status(400).json(ApiResponse.error(400, 'Todo and task ID(s) must be mongoose object id'));
    }

    const task = await Task.findOneAndUpdate(
        { _id: taskId, 'todoList._id': todoId },
        { $set: { 'todoList.$.text': text } },
        { new: true }
    )
    if (!task) return res.status(404).json(ApiResponse.error(404, 'No task found'))
    return res.status(200).json(ApiResponse.success(200, task, 'Todo text successfully updated'))


})

export {
    createTask,
    updateTask,
    updateTaskStatus,
    toggleDeleteTask,
    getTasks,
    getTaskById,
    updateTodoStatus,
    addTodoToTask,
    removeTodoFromTask,
    updateTodoText,
}