import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/Task.model.js";

// @desc    Get all users (Admin only)
// @route   Get /api/v1/users/
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'employee' }).select('-password -refreshToken');
    const usersWithTaskCounts = Promise.all(users.map(async (user) => {
        const pendingTasks = Task.countDocuments({ assignedTo: user._id, status: 'pending' });
        const inProgressTasks = Task.countDocuments({ assignedTo: user._id, status: 'in-progress' });
        const completedTasks = Task.countDocuments({ assignedTo: user._id, status: 'completed' });
        return {
            ...user._doc, // spread operator to include all user properties
            pendingTasks,
            inProgressTasks,
            completedTasks,
        };
    }));


    return res.status(200).json(ApiResponse.success(200, usersWithTaskCounts, 'Users successfully fetched'))
})

// @desc     Get user by id
// @route    Get /api/v1/users/:id
// @access   Private
const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json(ApiResponse.error(400, 'User id is required'));
    }
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
        return res.status(404).json(ApiResponse.error(404, 'User not found'));
    }
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