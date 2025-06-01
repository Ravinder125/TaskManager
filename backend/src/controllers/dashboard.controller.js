import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/Task.model.js";
import { generateCatchKey } from "../utils/generateCatcheKey.js";
import redis from "../config/redis.js";


// @desc    Get Admin Dashboard Data (Admin only)
// @route   GET /api/v1/dashboard-data
// @access  Admin 
const getAdminDashboard = asyncHandler(async (req, res) => {
    // Stats
    const path = generateCatchKey(req.path)
    // const data = await redis.get(path)
    // if (data) {
    //     return res.status(200).json(ApiResponse.success(
    //         200,
    //         JSON.parse(data),
    //         "Admin dashboard fetched successfully (redis)"
    //     ));
    // }
    const filter = {
        isDeleted: false,
        createdBy: req.user._id
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
        { $match: filter },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);


    const taskDistribution = taskStatuses.reduce((acc, status) => {
        let formattedKey = status;
        if (status === 'in-progress') {
            formattedKey = 'inProgress';
        }
        const found = taskDistributionRaw.find(item => item._id === status);
        acc[formattedKey] = found ? found.count : 0;
        return acc;
    }, {});

    taskDistribution["all"] = totalTasks;

    // Task priority distribution
    const taskPriorities = ['low', 'medium', 'high'];
    const taskPriorityLevelRaw = await Task.aggregate([
        { $match: filter },
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

    const responseData = {
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
    }

    await redis.set(path, JSON.stringify(responseData), 'EX', 60); // cache for 5 minutes


    return res.status(200).json(ApiResponse.success(
        200,
        responseData,
        "Admin dashboard fetched successfully"
    ));
});

// @desc    Get Employee Dashboard Data 
// @route   GET /api/v1/user-dashboard-data
// @access  Admin 
const getUserDashboard = asyncHandler(async (req, res) => {
    // const path = generateCatchKey(req.path);
    // const data = await redis.get(path);
    // if (data) {
    //     return res
    //         .status(200)
    //         .json(
    //             200,
    //             JSON.parse(data),
    //             'Employee dashboard  successfully fetched'
    //         )
    // }

    const userId = req.user._id; // Only fetch employee data

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
    // console.log(await Task.countDocuments({ assignedTo: userId }))
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
        .select('title status priority description createdAt dueTo ')

    const responseData = {
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
    }
    // await redis.set(path, JSON.stringify(responseData), 'EX', 300)

    return res.status(200).json(
        ApiResponse.success(
            200,
            responseData,
            'Employee dashboard successfully fetched'
        )

    )
})


export {
    getAdminDashboard,
    getUserDashboard,
}