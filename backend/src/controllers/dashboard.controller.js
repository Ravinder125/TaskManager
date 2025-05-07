import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/Task.model.js";


const getAdminDashboard = asyncHandler(async (req, res) => {
    // Stats
    const totalTasks = await Task.countDocuments({});
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    const completedTasks = await Task.countDocuments({ status: 'completed' });

    const overDueTasks = await Task.countDocuments({
        dueTo: { $lt: new Date() },
        status: { $ne: 'completed' },
    });

    // Task status distribution
    const taskStatuses = ['pending', 'in-progress', 'completed'];
    const taskDistributionRaw = await Task.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
        const formattedKey = status.replace(/\s+/g, '');
        acc[formattedKey] =
            taskDistributionRaw.find(item => item._id === status)?.count || 0;
        return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    // Task priority distribution
    const taskPriorities = ['low', 'medium', 'high'];
    const taskPriorityLevelRaw = await Task.aggregate([
        {
            $group: {
                _id: "$priority",
                count: { $sum: 1 },
            },
        },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
        acc[priority] =
            taskPriorityLevelRaw.find(item => item._id === priority)?.count || 0;
        return acc;
    }, {});

    // Recent 10 tasks
    const recentTasks = await Task.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title status priority dueTo createdAt');

    return res.status(200).json(ApiResponse.success(
        200,
        {
            statistics: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overDueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        },
        "Admin dashboard fetched successfully"
    ));
});

const getUserDashboard = asyncHandler(async (req, res) => {

})


export {
    getAdminDashboard,
    getUserDashboard,
}