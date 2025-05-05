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
    if (!errors) return res.status(400).json(ApiResponse.error(400, errors.array(), 'Validation error'));
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
// @route   POST /api/v1/task
// @access  Private (admin)
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { title, description, status, priority, completedAt, dueTo } = req.body
    if (!taskId) return res.status(400).json(ApiResponse.error(400, 'Task id is required'))

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
// @route   POST /api/v1/task
// @access  Private 
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { TaskId } = req.params;
    const { status } = req.body;
    console.log(TaskId)
    const TaskMongooseId = mongoose.Types.ObjectId.createFromHexString(TaskId);
    console.log(TaskMongooseId)
    const Task = await Task.findByIdAndUpdate(
        { _id: TaskMongooseId, isDeleted: false, status: 'pending' },
        { status },
        { new: true }
    )
    if (!Task) return res.status(404).json(ApiResponse.error(404, 'No Task found'));
    return res.status(200).json(ApiResponse.success(200, Task, 'Task status updated successfully'));
})

// @desc    Delete a task (Admin only)
// @route   POST /api/v1/task/:taskId
// @access  Private (admin)
const toggleDeleteTask = asyncHandler(async (req, res) => {
    const { TaskId } = req.params;

    const Task = await Task.findById(TaskMongooseId);
    if (!Task) return res.status(404).json(ApiResponse.error(404, "no Task found "));

    const deletedTask = await Task.findByIdAndUpdate(
        TaskId,
        { isDeleted: !Task.isDeleted },
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
// @route   POST /api/v1/task/:taskId
// @access  Private 
const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).populate('assignedTo', 'fullName avatar coverImage');
    if (!task) {
        return res.status(404).json(ApiResponse.error(404, 'Task not found'));
    }
    return res.status(200).json(ApiResponse.success(200, task, 'Task fetched successfully'));
})

export {
    createTask,
    updateTask,
    updateTaskStatus,
    toggleDeleteTask,
    getTasks,
    getTaskById,
}