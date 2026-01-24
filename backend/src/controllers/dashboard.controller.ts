import { Request, Response } from "express";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { cache } from "../utils/cacheService.js";

/* =======================
   Types
======================= */

type TaskDistribution = {
    pending: number;
    inProgress: number;
    completed: number;
    all: number;
};

type TaskPriorityLevels = {
    low: number;
    medium: number;
    high: number;
};

/* =======================
   Admin Dashboard
======================= */

const getAdminDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user._id;
        const pathKey = `dashboard:${userId}`;


        const cached = await cache.get(pathKey);
        if (cached) {
            return res
                .status(200)
                .json(
                    ApiResponse.success(
                        200,
                        cached,
                        "Admin dashboard fetched successfully (redis)"
                    )
                );
        }

        const filter = {
            isDeleted: false,
            createdBy: userId,
        };

        const taskStatuses = ["pending", "in-progress", "completed"] as const;
        const [pendingTasks, inProgressTasks, completedTasks, totalTasks, overDueTasks] = await Promise.all([

            ...taskStatuses.map((p: string) => {
                return Task.countDocuments({
                    ...filter,
                    status: p
                })
            }),
            Task.countDocuments(filter),
            Task.countDocuments({
                dueTo: { $lt: new Date() },
                status: { $ne: "completed" },
                ...filter,
            })
        ])

        /* -------- Task Status Distribution -------- */


        const taskDistributionRaw: Array<{
            _id: string;
            count: number;
        }> = await Task.aggregate([
            { $match: filter },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const taskDistribution = taskStatuses.reduce<TaskDistribution>(
            (acc, status) => {
                const key =
                    status === "in-progress" ? "inProgress" : status;
                const found = taskDistributionRaw.find(
                    (item) => item._id === status
                );
                acc[key] = found ? found.count : 0;
                return acc;
            },
            {
                pending: 0,
                inProgress: 0,
                completed: 0,
                all: totalTasks,
            }
        );

        /* -------- Task Priority Distribution -------- */

        const taskPriorities = ["low", "medium", "high"] as const;

        const taskPriorityLevelRaw: Array<{
            _id: string;
            count: number;
        }> = await Task.aggregate([
            { $match: filter },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        const taskPriorityLevels = taskPriorities.reduce<TaskPriorityLevels>(
            (acc, priority) => {
                acc[priority] =
                    taskPriorityLevelRaw.find(
                        (item) => item._id === priority
                    )?.count ?? 0;
                return acc;
            },
            { low: 0, medium: 0, high: 0 }
        );

        /* -------- Recent Tasks -------- */

        const recentTasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueTo createdAt");

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
        };
        console.log(responseData)

        await cache.set(pathKey, responseData);

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    responseData,
                    "Admin dashboard fetched successfully"
                )
            );
    }
);

/* =======================
   User Dashboard
======================= */

const getUserDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user._id;
        const pathKey = `dashboard:${userId}`;

        const cached = await cache.get(pathKey);
        if (cached) {
            return res
                .status(200)
                .json(
                    ApiResponse.success(
                        200,
                        cached,
                        "Employee dashboard successfully fetched"
                    )
                );
        }

        const filter = {
            assignedTo: userId,
            isDeleted: false,
        };

        const taskStatuses = ["pending", "in-progress", "completed"] as const;
        const [pendingTasks, inProgressTasks, completedTasks, totalTasks, overDueTasks] = await Promise.all([

            ...taskStatuses.map((p: string) => {
                return Task.countDocuments({
                    ...filter,
                    status: p
                })
            }),
            Task.countDocuments(filter),
            Task.countDocuments({
                dueTo: { $lt: new Date() },
                status: { $ne: "completed" },
                ...filter,
            })
        ])
        /* -------- Status Distribution -------- */

        const taskDistributionRaw: Array<{
            _id: string;
            count: number;
        }> = await Task.aggregate([
            { $match: filter },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const taskDistribution = taskStatuses.reduce<TaskDistribution>(
            (acc, status) => {
                const key =
                    status === "in-progress" ? "inProgress" : status;
                const found = taskDistributionRaw.find(
                    (item) => item._id === status
                );
                acc[key] = found ? found.count : 0;
                return acc;
            },
            {
                pending: 0,
                inProgress: 0,
                completed: 0,
                all: totalTasks,
            }
        );

        /* -------- Priority Distribution -------- */

        const taskPriorities = ["low", "medium", "high"] as const;

        const taskPriorityLevelRaw: Array<{
            _id: string;
            count: number;
        }> = await Task.aggregate([
            { $match: filter },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        const taskPriorityLevels = taskPriorities.reduce<TaskPriorityLevels>(
            (acc, priority) => {
                acc[priority] =
                    taskPriorityLevelRaw.find(
                        (item) => item._id === priority
                    )?.count ?? 0;
                return acc;
            },
            { low: 0, medium: 0, high: 0 }
        );

        /* -------- Recent Tasks -------- */

        const recentTasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority description createdAt dueTo");

        const responseData = {
            statistics: {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overDueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        };

        await cache.set(pathKey, responseData);

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    responseData,
                    "Employee dashboard successfully fetched"
                )
            );
    }
);

export { getAdminDashboard, getUserDashboard };
