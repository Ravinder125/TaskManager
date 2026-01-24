import { Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import excelJS, { Workbook } from "exceljs";
import redis from "../config/redis.config.js";

/* =======================
   Helpers
======================= */

type PopulatedUser = {
    _id: string;
    email: string;
    fullName: {
        firstName: string;
        lastName?: string;
    };
};


const setHeaders = async (
    filename: string,
    res: Response,
    workbook: Workbook
): Promise<void> => {
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
};

const generateCacheKey = (path: string): string => {
    return `report:${path}`;
};

/* =======================
   Export Users Report
======================= */

const exportUsersReport = asyncHandler(
    async (req: Request, res: Response) => {
        const pathKey = generateCacheKey(req.path);
        const cached = await redis.get(pathKey);

        if (cached) {
            const workbook = new excelJS.Workbook();
            return setHeaders("users_report", res, workbook);
        }

        const users = await User.find()
            .select("fullName email _id")
            .lean();

        const usersTasks = await Task.find().populate(
            "assignedTo",
            "fullName email _id"
        );

        type UserStats = {
            _id: string;
            fullName: { firstName: string; lastName?: string };
            email: string;
            taskCount: number;
            pendingTasks: number;
            inProgressTasks: number;
            completedTasks: number;
        };

        const userTaskMap: Record<string, UserStats> = {};

        users.forEach((user) => {
            userTaskMap[String(user._id)] = {
                _id: String(user._id),
                fullName: user.fullName,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        usersTasks.forEach((task) => {
            if (!task.assignedTo) return;

            task.assignedTo.forEach((assignedUser) => {
                const stats = userTaskMap[String(assignedUser._id)];
                if (!stats) return;

                stats.taskCount += 1;

                if (task.status === "pending") stats.pendingTasks += 1;
                else if (task.status === "in-progress")
                    stats.inProgressTasks += 1;
                else if (task.status === "completed")
                    stats.completedTasks += 1;
            });
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Employee Reports");

        worksheet.columns = [
            { header: "User ID", key: "_id", width: 25 },
            { header: "Name", key: "fullName", width: 30 },
            { header: "Email", key: "email", width: 35 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow({
                ...user,
                fullName: `${user.fullName.firstName} ${user.fullName.lastName ?? ""}`,
            });
        });

        await redis.set(pathKey, "generated", "EX", 300);

        return setHeaders("users_report", res, workbook);
    }
);

/* =======================
   Export Tasks Report
======================= */

const exportTasksReport = asyncHandler(
    async (_req: Request, res: Response) => {
        const tasks = await Task.find().populate(
            "assignedTo",
            "fullName email"
        );

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 25 },
            { header: "Due Date", key: "dueTo", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 50 },
        ];

        const isPopulatedUser = (user: unknown): user is PopulatedUser => {
            return (
                typeof user === "object" &&
                user !== null &&
                "email" in user &&
                "fullName" in user
            );
        };


        tasks.forEach((task) => {
            const assignedTo = Array.isArray(task.assignedTo)
                ? (task.assignedTo
                    .map((user) => {
                        if (isPopulatedUser(user)
                        ) {
                            return `${user.fullName.firstName} ${user.fullName.lastName ?? ""} (${user.email})`;
                        }
                        return null;
                    })
                    .filter(Boolean) as string[])
                    .join(", ")
                : "";


            worksheet.addRow({
                _id: String(task._id),
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueTo: task.dueTo,
                assignedTo,
            });
        });

        return setHeaders("tasks_report", res, workbook);
    }
);

export { exportTasksReport, exportUsersReport };
