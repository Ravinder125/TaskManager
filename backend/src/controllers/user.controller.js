import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/Task.model.js";
import { isValidObjectId } from "mongoose";
import redis from "../config/redis.js";


const isValidId = (id) => isValidObjectId(id)

const usersRoute = `/api/v1/users/`

// @desc    Get all users (Admin only)
// @route   Get /api/v1/users/
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const pathKey = `${usersRoute}:${userId}`
    let usersWithTaskCounts = await redis.get(pathKey)
    if (usersWithTaskCounts) {
        return res
            .status(200)
            .json(ApiResponse.success(200, JSON.parse(usersWithTaskCounts), 'Users successfully fetched'))
    }
    const users = await User.find({ role: 'employee' }).select('-password -refreshToken');

    usersWithTaskCounts = await Promise.all(users.map(async (user) => {
        const tasksFilter = { assignedTo: user._id, createdBy: userId, }
        const pendingTasks = await Task.countDocuments({ ...tasksFilter, status: 'pending' });
        const inProgressTasks = await Task.countDocuments({ ...tasksFilter, status: 'in-progress' });
        const completedTasks = await Task.countDocuments({ ...tasksFilter, status: 'completed' });
        return {
            ...user._doc, // spread operator to include all user properties
            pendingTasks,
            inProgressTasks,
            completedTasks,
        };
    }));

    await redis.set(pathKey, JSON.stringify(usersWithTaskCounts), 'EX', 300)
    return res.status(200).json(ApiResponse.success(200, usersWithTaskCounts, 'Users successfully fetched'))
})

// @desc     Get user by id
// @route    Get /api/v1/users/:id
// @access   Private
const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!isValidId(userId)) {
        return res.status(400).json(ApiResponse.error(400, 'Invalid user id'));
    }
    const pathKey = `${usersRoute}:${req.user._id}:${userId}`
    let user = await redis.get(pathKey)
    if (user) {
        return res.status(200).json(ApiResponse.success(200, user, 'User successfully fetched'))
    }
    user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
        return res.status(404).json(ApiResponse.error(404, 'User not found'));
    }

    await redis.set(pathKey, JSON.stringify(user), 'EX', 300)
    return res.status(200).json(ApiResponse.success(200, user, 'User successfully fetched'))
})

// @desc     Delete user by id (Admin only)
// @route    Delete /api/v1/users/:id
// @access   Private (Admin) 
const deletedUser = asyncHandler(async (req, res) => {

})


export {
    getUsers,
    getUserById,
    deletedUser,
}