import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/Task.model.js";
import { validateObjectId } from "../utils/validateObjectId.js";


// @desc    Get Admin Dashboard Data (Admin only)
// @route   GET /api/v1/dashboard-data
// @access  Admin 
const getAdminDashboard = asyncHandler(async (req, res) => {
    // Stats

    const filter = {
        createdBy: req.user._id,
        isDeleted: false
    }
    const totalTasks = await Task.countDocuments(filter);
    const pendingTasks = await Task.countDocuments({ status: 'pending', ...filter });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress', ...filter });
    const completedTasks = await Task.countDocuments({ status: 'completed', ...filter });

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
        const formattedKey = status.replace(/\s+/g, "");
        acc[formattedKey] =
            taskDistributionRaw.find(item => item._id === status)?.count || 0;
        return acc;
    }, {});

    taskDistribution["all"] = totalTasks;

    // Task priority distribution
    const taskPriorities = ['low', 'medium', 'high'];
    const taskPriorityLevelRaw = await Task.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 }, }, },
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

// @desc    Get Employee Dashboard Data 
// @route   GET /api/v1/user-dashboard-data
// @access  Admin 
const getUserDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Only fetch employee data
    if (!validateObjectId(userId)) {
        return res.status(400).json(ApiResponse.error(400, 'Invaid id'));
    };
    // Fetch statistics for user-spacific tasks
    const filter = { assignedTo: userId, isDeleted: false }
    const totalTasks = await Task.countDocuments(filter);
    const pendingTasks = await Task.countDocuments({ ...filter, status: 'pending' });
    const completedTasks = await Task.countDocuments({ ...filter, status: 'completed' });
    const overDueTasks = await Task.countDocuments({
        ...filter,
        dueTo: { $lt: new Date() },
        status: { $ne: 'completed' }
    })

    // Task distribution by status
    const tasksStatuses = ['pending', 'in-progress', 'completed'];
    const taskDistributionRaw = await Task.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const taskDistribution = tasksStatuses.reduce((acc, status) => {
        acc[status] =
            taskDistributionRaw.find((task) => task._id === status)?.count || 0
        return acc
    }, {})

    taskDistribution['all'] = totalTasks;

    // Task distribution by level
    const taskPriorities = ['low', 'medium', 'high']
    const taskPriorityLevelRaw = await Task.aggregate([
        { $match: filter },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
    ])
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
        acc[priority] = taskPriorityLevelRaw.find(task => task._id === priority)?.count || 0
        return acc
    }, {})

    // fetch recent 10 tasks
    const recentTasks = await Task.find({ ...filter })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title description createdAt dueTo ')

    return res.status(200).json(
        ApiResponse.success(200,
            {
                statistics: {
                    totalTasks,
                    completedTasks,
                    pendingTasks,
                    overDueTasks,
                },
                charts: {
                    taskDistribution,
                    taskPriorityLevels,
                },
                recentTasks
            },
            'Employee dashboard successfully fetched'
        )

    )
})


export {
    getAdminDashboard,
    getUserDashboard,
}