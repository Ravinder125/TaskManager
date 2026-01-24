import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { cache, clearCache } from "../utils/cacheService.js";
import { validateObjectId } from "../utils/validateObjectId.js";

/* ======================================================
   Create Task
====================================================== */
const createTask = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json(ApiResponse.error(400, errors.array()[0].msg));
    }

    const {
        title,
        description,
        date,
        assignedTo,
        attachments,
        todoList,
        priority,
    } = req.body as {
        title: string;
        description: string;
        date?: Date;
        assignedTo: string[];
        attachments?: string[];
        todoList?: unknown[];
        priority?: "low" | "medium" | "high";
    };

    if (!Array.isArray(assignedTo) || !validateObjectId(assignedTo)) {
        return res
            .status(400)
            .json(
                ApiResponse.error(
                    400,
                    "assignedTo must be an array of valid user IDs"
                )
            );
    }

    const taskExists = await Task.findOne({
        title,
        createdBy: userId,
        isDeleted: false,
    });

    if (taskExists) {
        return res
            .status(400)
            .json(ApiResponse.error(400, "Task already exists"));
    }

    const task = await Task.create({
        title,
        description,
        todoList,
        attachments,
        createdBy: userId,
        assignedTo,
        priority: priority ?? "medium",
        dueTo: date,
    });

    await clearCache(undefined, undefined, { userId: userId.toString() });

    return res
        .status(201)
        .json(ApiResponse.success(201, task, "Task successfully created"));
});

/* ======================================================
   Get Task By ID
====================================================== */
const getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!validateObjectId(taskId)) {
        return res
            .status(400)
            .json(ApiResponse.error(400, "Invalid task ID"));
    }

    const cacheKey = `task:${taskId}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
        return res
            .status(200)
            .json(ApiResponse.success(200, cached, "Task fetched successfully"));
    }

    const task = await Task.findById(taskId).populate(
        "assignedTo",
        "fullName profileImageUrl email"
    );

    if (!task) {
        return res
            .status(404)
            .json(ApiResponse.error(404, "Task not found"));
    }

    await cache.set(cacheKey, task);

    return res
        .status(200)
        .json(ApiResponse.success(200, task, "Task fetched successfully"));
});

/* ======================================================
   Get Tasks (Pagination + Search)
====================================================== */
const getTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;
    const { status, search, sort = "asc", priority } = req.query as {
        status?: string;
        search?: string;
        sort?: "asc" | "desc";
        priority?: string;
    };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `${userId}:${status ?? "all"}:${search ?? ""}:${page}:${limit}:${sort}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
        return res
            .status(200)
            .json(ApiResponse.success(200, cached, "Tasks fetched successfully"));
    }

    const isAdmin = req.user.role === "admin";

    const baseQuery: Record<string, unknown> = {
        isDeleted: false,
        ...(isAdmin ? { createdBy: userId } : { assignedTo: userId }),
    };

    if (search?.trim()) {
        baseQuery.title = { $regex: search, $options: "i" };
    }
    if (status?.trim()) {
        baseQuery.status = status;
    }
    if (priority?.trim()) {
        baseQuery.priority = priority;
    }

    const [tasks, totalTasks] = await Promise.all([
        Task.find(baseQuery)
            .sort({ createdAt: sort === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .populate("assignedTo", "fullName email profileImageUrl"),
        Task.countDocuments(baseQuery),
    ]);

    const totalPages = Math.ceil(totalTasks / limit);

    const enrichedTasks = tasks.map((task) => {
        const completedTodoCount =
            task.todoList?.filter((t) => t.completed).length ?? 0;

        return {
            ...task.toObject(),
            completedTodoCount,
        };
    });

    const responseData = {
        tasks: enrichedTasks,
        pagination: {
            page,
            limit,
            totalPages,
            totalTasks,
        },
    };

    await cache.set(cacheKey, responseData);

    return res
        .status(200)
        .json(ApiResponse.success(200, responseData, "Tasks fetched successfully"));
});

/* ======================================================
   Update Task
====================================================== */
const updateTask = asyncHandler(async (req: Request, res: Response) => {
    const { taskId } = req.params;

    if (!validateObjectId(taskId)) {
        return res
            .status(400)
            .json(ApiResponse.error(400, "Invalid task ID"));
    }

    const task = await Task.findOne({
        _id: taskId,
        isDeleted: false,
    });

    if (!task) {
        return res
            .status(404)
            .json(ApiResponse.error(404, "Task not found"));
    }

    Object.assign(task, req.body);

    const completedTodoCount =
        task.todoList?.filter((t) => t.completed).length ?? 0;
    const totalTodos = task.todoList?.length ?? 0;

    task.progress =
        totalTodos > 0
            ? Math.round((completedTodoCount / totalTodos) * 100)
            : 0;

    if (task.progress === 100) task.status = "completed";
    else if (task.progress > 0) task.status = "in-progress";
    else task.status = "pending";

    const updatedTask = await task.save();

    await cache.set(`task:${taskId}`, updatedTask);
    await clearCache(undefined, undefined, { userId: req.user._id.toString() });

    return res
        .status(200)
        .json(
            ApiResponse.success(
                200,
                updatedTask,
                "Task successfully updated"
            )
        );
});

/* ======================================================
   Exports
====================================================== */
export {
    createTask,
    getTaskById,
    getTasks,
    updateTask,
};
