import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/Task.model.js";
import excelJS from "exceljs"


// @desc    Export user report (Admin only)
// @route   GET /api/v1/reports
// @access  Admin 
const exportUsersReport = asyncHandler(async (req, res) => {
    const users = await User.find().select("name email _id").lean();
    const usersTasks = await Task.find().populate(
        "assignedTo",
        "name email _id"
    );

    const userTaskMap = {};
    users.forEach((user) => {
        userTaskMap[user._id] = {
            name: user.fullName,
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
                const userTaskMapWithId = userTaskMap[assignedTo._id]
                const status = task.status

                if (userTaskMapWithId) {
                    userTaskMapWithId.taskCount += 1;
                    if (status === 'pending') {
                        userTaskMapWithId.pendingTasks += 1;
                    } else if (status === 'in-progress') {
                        userTaskMapWithId.inProgressTasks += 1;
                    } else if (status === 'completed') {
                        userTaskMapWithId.completedTasks += 1
                    }
                }
            });
        };
    });

    const workbook = new excelJS.Workbook();
    const worksheet = new workbook.addWorksheet('Employee Reports');

    workbook.columns = [
        { header: "User ID", key: '_id', width: 25 },
        { header: "Name", key: 'fullName', width: 30 },
        { header: "Email", key: 'email', width: 35 },
        { header: "Role", key: 'email', width: 20 },
        { header: "Total Assigned Tasks", key: 'taskCount', width: 20 },
        { header: "Pending Tasks", key: 'pendingTasks', width: 20 },
        { header: "In Progress Tasks", key: 'inProgressTasks', width: 20 },
        { header: "Completed Tasks", key: 'completedTasks', width: 15 },
    ];

    Object.values(userTaskMap).forEach((user) => {
        worksheet.addRow(user);
    });

    res.setHeaders(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
    )
    res.setHeaders(
        "Content-Disposition",
        'attachment; filname="tasks_report.xlsx"'
    )

    return workbook.xlsx.write(res).then(() => {
        res.end()
    })

})

// @desc    Export all tasks report as Excel file
// @route   GET /api/v1/reports
// @access  Admin 
const exportTasksReport = asyncHandler(async (req, res) => {
    const tasks = await Task.findById(req.user._id).populate('assignedTo', 'fullName email')

    const workbook = new excelJS.Workbook();
    const worksheet = new workbook.addWorksheet('Tasks Report');

    workbook.columns = [
        { header: "Task ID", key: "_id", width: 25 },
        { header: "Title", key: "title", width: 30 },
        { header: "Description", key: "description", width: 50 },
        { header: "Priority", key: "priority", width: 15 },
        { header: "Status", key: "status", width: 25 },
        { header: "Due Date", key: "dueTo", width: 20 },
        { header: "Task ID", key: "_id", width: 25 },
        { header: "AssignedTo", key: "assignedTo", width: 30 },
    ];

    tasks.forEach(task => {
        const assignedTo = task.assignedTo
            .map(user => `${user.fullName} (${user.email})`)
            .join(", ");
        worksheet.addRow({
            _id: task._id,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueTo: task.dueTo,
            assignedTo: task.assignedTo,
        });
    });

    res.setHeaders(
        "Content-Type",
        "application/vnd.openxmlformats-officedoument.spreadsheet.sheet"
    )
    res.setHeaders(
        "Content-Disposition",
        'attchament; filename="tasks_report.xlsx"'
    )

    return workbook.xlsx.write(res).then(() => {
        res.end()
    })
})



export {
    exportTasksReport,
    exportUsersReport
}