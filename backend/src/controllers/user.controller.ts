import { Request, Response } from "express";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { cache } from "../utils/cacheService.js";
import { validateObjectId } from "../utils/validateObjectId.js";

/* ======================================================
   Get All Users (Admin)
====================================================== */
const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const {
        search = "",
        sort = "asc",
    } = req.query as {
        search?: string;
        sort?: "asc" | "desc";
    };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `users:${req.user._id}:${page}:${limit}:${search}:${sort}`;

    const cachedUsers = await cache.get(cacheKey);
    if (cachedUsers) {
        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    cachedUsers,
                    "Users successfully fetched"
                )
            );
    }

    const query: Record<string, unknown> = { role: "employee" };

    if (search.trim()) {
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
            .json(ApiResponse.error(404, "No users found"));
    }

    const usersWithTaskCounts = await Promise.all(
        users.map(async (user) => {
            const baseTaskFilter = { assignedTo: user._id };

            const [pendingTasks, inProgressTasks, completedTasks] =
                await Promise.all([
                    Task.countDocuments({
                        ...baseTaskFilter,
                        status: "pending",
                    }),
                    Task.countDocuments({
                        ...baseTaskFilter,
                        status: "in-progress",
                    }),
                    Task.countDocuments({
                        ...baseTaskFilter,
                        status: "completed",
                    }),
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
    const totalPages = Math.ceil(totalUsers / limit);

    const responseData = {
        users: usersWithTaskCounts,
        pagination: {
            totalItems: totalUsers,
            page,
            limit,
            totalPages,
        },
    };

    await cache.set(cacheKey, responseData);

    return res
        .status(200)
        .json(
            ApiResponse.success(
                200,
                responseData,
                "Users successfully fetched"
            )
        );
});

/* ======================================================
   Get User By ID
====================================================== */
const getUserById = asyncHandler(
    async (req: Request, res: Response) => {
        const { userId } = req.params;

        if (!validateObjectId(userId)) {
            return res
                .status(400)
                .json(ApiResponse.error(400, "Invalid user id"));
        }

        const cacheKey = `user:${req.user._id}:${userId}`;

        const cachedUser = await cache.get(cacheKey);
        if (cachedUser) {
            return res
                .status(200)
                .json(
                    ApiResponse.success(
                        200,
                        cachedUser,
                        "User successfully fetched"
                    )
                );
        }

        const user = await User.findById(userId).select(
            "-password -refreshToken"
        );

        if (!user) {
            return res
                .status(404)
                .json(ApiResponse.error(404, "User not found"));
        }

        await cache.set(cacheKey, user)

        return res
            .status(200)
            .json(
                ApiResponse.success(
                    200,
                    user,
                    "User successfully fetched"
                )
            );
    }
);

/* ======================================================
   Delete User (Admin)
====================================================== */
const deletedUser = asyncHandler(
    async (_req: Request, res: Response) => {
        return res
            .status(501)
            .json(
                ApiResponse.error(
                    501,
                    "Delete user not implemented yet"
                )
            );
    }
);

export { getUsers, getUserById, deletedUser };
