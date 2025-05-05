import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import { Task } from "../models/Task.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";


const createTask = asyncHandler(async (req, res) => {
    const adminId = req.admin._id;

    const errors = validationResult(req)
    if (!errors) return res.status(400).json(ApiResponse.error(400, errors.array(), 'Validation error'));
    const { title, description, date, assignedTo, priority } = req.body
    console.log(title, description)

    const user = await User.findOne({ username: assignedTo });
    if (!user) return res.status(200).json(ApiResponse.error(404, 'User not found'))

    const isTaskExists = await Task.findOne({ title, createdBy: adminId, assignedTo: user._id, isDeleted: false })
    if (isTaskExists) return res.status(400).json(ApiResponse.error(404, 'Task already exist'))

    const newTask = await Task.create({
        title,
        description,
        createdBy: adminId,
        assignedTo: user._id,
        priority,
        dueTo: date
    })

    if (!newTask) return res.status(400).json(ApiResponse.error(400, 'Error while creating Task'))

    return res.status(201).json(ApiResponse.success(201, newTask, 'Task successfully created'))
})

const updateTask = asyncHandler(async (req, res) => {
    const { TaskId } = req.params
    const { title, description, status, priority, completedAt, dueTo } = req.body
    if (!TaskId) return res.status(400).json(ApiResponse.error(400, 'Task id is required'))

    const TaskMongooseId = new mongoose.Types.ObjectId(TaskId)

    const isTaskExists = await Task.findOne({ _id: TaskMongooseId, isDeleted: false, })
    if (!isTaskExists) return res.status(400).json(ApiResponse.error(400, "Task doesn't exist"))

    const updatedTask = await Task.findByIdAndUpdate(
        TaskMongooseId,
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

const toggleDeleteTask = asyncHandler(async (req, res) => {
    const { TaskId } = req.params;
    const TaskMongooseId = new mongoose.Types.ObjectId(TaskId)

    const Task = await Task.findById(TaskMongooseId);
    if (!Task) return res.status(404).json(ApiResponse.error(404, "no Task found "));

    const deletedTask = await Task.findByIdAndUpdate(
        TaskMongooseId,
        { isDeleted: !Task.isDeleted },
        { new: true }
    );

    if (!deletedTask) return res.status(404).json(ApiResponse.error(404, "no Task found "));

    return res.status(200).json(ApiResponse.success(200, deletedTask, 'Task successfully deleted'))

})

const getAllTasks = asyncHandler(async (req, res) => {
    const adminId = req.admin._id
    const { page = 1, limit = 10 } = req.query;

    const options = {
        page: Number(page),
        limit: Number(limit)
    }

    const AdminTaskAggregate = [
        {
            $match: { createdBy: adminId, isDeleted: false, }
        },
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'assignedTo',
                as: 'Employees',
                pipeline: [{
                    $project: {
                        avatar: 1,
                        coverImage: 1,
                        fullName: 1
                    }
                }]
            }
        },
    ]

    const TaskPaginate = await Task.aggregatePaginate(Task.aggregate(AdminTaskAggregate), options)
    if (!TaskPaginate) return res.status(400).json(ApiResponse.error(400, 'No Task found'))

    return res.status(200).json(ApiResponse.success(200, TaskPaginate, 'Successfully all Taskes are fetched'))
})

export {
    createTask,
    updateTask,
    updateTaskStatus,
    toggleDeleteTask,
    getAllTasks
}