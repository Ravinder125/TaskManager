import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/Task.model.js";
import excelJS, { Workbook } from "exceljs";
import redis from "../config/redis.config.js";

// Set headers and write workbook
const setHeaders = (filename:string, res:Response, workbook:Workbook) => {
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.xlsx"`
    );

    return workbook.xlsx.write(res).then(() => {
        res.end();
    });
};

// @desc    Export user report (Admin only)
// @route   GET /api/v1/reports/users
// @access  Admin 
const exportUsersReport = asyncHandler(async (req, res) => {
    const path = generateCatchKey(req.path);
    const report = await redis.get(path);
    if (report) {
        const workbook = new excelJS.Workbook();
        return setHeaders("users_report", res, workbook);
    }

    const users = await User.find().select("fullName email _id").lean();
    const usersTasks = await Task.find().populate("assignedTo", "fullName email _id");

    const userTaskMap = {};
    users.forEach((user) => {
        userTaskMap[user._id] = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            taskCount: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
        };
    });

    usersTasks.forEach((task) => {
        if (task.assignedTo) {
            task.assignedTo.forEach((assignedTo) => {
                const userStats = userTaskMap[assignedTo._id];
                if (userStats) {
                    userStats.taskCount += 1;
                    if (task.status === 'pending') userStats.pendingTasks += 1;
                    else if (task.status === 'in-progress') userStats.inProgressTasks += 1;
                    else if (task.status === 'completed') userStats.completedTasks += 1;
                }
            });
        }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee Reports');

    worksheet.columns = [
        { header: "User ID", key: '_id', width: 25 },
        { header: "Name", key: 'fullName', width: 30 },
        { header: "Email", key: 'email', width: 35 },
        { header: "Total Assigned Tasks", key: 'taskCount', width: 20 },
        { header: "Pending Tasks", key: 'pendingTasks', width: 20 },
        { header: "In Progress Tasks", key: 'inProgressTasks', width: 20 },
        { header: "Completed Tasks", key: 'completedTasks', width: 20 },
    ];

    Object.values(userTaskMap).forEach(user => {
        worksheet.addRow(user);
    });

    return setHeaders("users_report", res, workbook);
});

// @desc    Export all tasks report as Excel file
// @route   GET /api/v1/reports/tasks
// @access  Admin 
const exportTasksReport = asyncHandler(async (req, res) => {
    const tasks = await Task.find().populate('assignedTo', 'fullName email');

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tasks Report');

    worksheet.columns = [
        { header: "Task ID", key: "_id", width: 25 },
        { header: "Title", key: "title", width: 30 },
        { header: "Description", key: "description", width: 50 },
        { header: "Priority", key: "priority", width: 15 },
        { header: "Status", key: "status", width: 25 },
        { header: "Due Date", key: "dueTo", width: 20 },
        { header: "Assigned To", key: "assignedTo", width: 50 },
    ];

    tasks.forEach(task => {
        const assignedTo = task.assignedTo
            .map(user => `${user.fullName} (${user.email})`)
            .join(", ");
        worksheet.addRow({
            _id: task._id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueTo: task.dueTo,
            assignedTo: assignedTo,
        });
    });

    return setHeaders("tasks_report", res, workbook);
});

export {
    exportTasksReport,
    exportUsersReport
};
