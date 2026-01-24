import redis from "../config/redis.config.js";

/**
 * Cache helper
 */
export const cache = {
    get: async <T = unknown>(key: string): Promise<T | null> => {
        const data = await redis.get(key);
        if (!data) return null; // prevent JSON.parse crash

        try {
            return JSON.parse(data) as T;
        } catch (err) {
            console.error("Failed to parse cache:", err);
            return null;
        }
    },

    set: async (
        key: string,
        data: unknown,
        time: number = 300
    ): Promise<"OK" | null> => {
        return redis.set(key, JSON.stringify(data), "EX", time);
    },

    del: async (key: string): Promise<number> => {
        return redis.del(key);
    },
};

/**
 * Cache invalidation helper
 */
type TaskCacheContext = {
    userId: string;
    search?: {
        status?: string;
        title?: string;
    };
};

export const clearCache = async (
    userId?: string,
    taskId?: string,
    tasks?: TaskCacheContext
): Promise<void> => {
    if (userId) {
        await cache.del(`profile:${userId}`);
        return;
    }

    if (taskId) {
        await cache.del(`task:${taskId}`);
        return;
    }

    if (tasks?.userId) {
        await Promise.all([
            ...["all", "pending", "in-progress", "completed"].map((status) => {
                if (tasks.search?.status === status) {
                    return cache.del(
                        `${tasks.userId}:${status}:${tasks.search?.title ?? ""}`
                    );
                }

                return cache.del(`${tasks.userId}:${status}:`);
            }),
            cache.del(`dashboard:${tasks.userId}`),
        ]);
    }
};
