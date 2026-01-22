import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/Task.model.js";
import redis from "../config/redis.js";
import { cache } from "../utils/cacheService.js";



// @desc    Get all users (Admin only)
// @route   Get /api/v1/users/
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res) => {
    const { search = "", sort = "asc" } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `users:${req.user._id}:${page}:${limit}:${search}:${sort}`;

    const cachedUsers = await cache.get(cacheKey);
    if (cachedUsers) {
        return res
            .status(200)
            .json(ApiResponse.success(200, cachedUsers, "Users successfully fetched"));
    }

    const query = { role: "employee" };
    if (search?.trim()) {
        query.email = { $regex: search.trim(), $options: "i" };
    }

    const sortOrder = sort === "asc" ? 1 : -1;

    const users = await User.find(query)
        .select("fullName email profileImageUrl")
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean();

    if (users.length === 0) {
        return res
            .status(404)
            .json(ApiResponse.error(404, [], "No users found"));
    }

    const usersWithTaskCounts = await Promise.all(
        users.map(async (user) => {
            const baseTaskFilter = { assignedTo: user._id };

            const [pendingTasks, inProgressTasks, completedTasks] =
                await Promise.all([
                    Task.countDocuments({ ...baseTaskFilter, status: "pending" }),
                    Task.countDocuments({ ...baseTaskFilter, status: "in-progress" }),
                    Task.countDocuments({ ...baseTaskFilter, status: "completed" }),
                ]);

            return {
                ...user,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            };
        })
    );

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit)
    const responseData = {
        users: usersWithTaskCounts,
        pagination: {
            totalItems: totalUsers,
            page,
            limit,
            totalPages
        }

    };

    await cache.set(cacheKey, responseData);

    return res
        .status(200)
        .json(ApiResponse.success(200, responseData, "Users successfully fetched"));
});

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