import redis from "../config/redis.config.js";

/**
 * Cache helper
 */
export const cache = {
  get: async <T = unknown>(key: string): Promise<T | null> => {
    const data = await redis.get(key);

    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (error) {
      console.error("Redis parse error:", error);
      return null;
    }
  },

  set: async (
    key: string,
    value: unknown,
    ttl: number = 300
  ): Promise<string | null> => {
    return redis.set(
      key,
      JSON.stringify(value),
      {EX: ttl}
    );
  },

  del: async (key: string): Promise<number> => {
    return redis.del(key);
  },
};

/**
 * Types
 */
type TaskCacheContext = {
  userId: string;
  search?: {
    status?: string;
    title?: string;
  };
};

/**
 * Cache invalidation helper
 */
export const clearCache = async (
  userId?: string,
  taskId?: string,
  tasks?: TaskCacheContext
): Promise<void> => {

  /* Profile cache */
  if (userId) {
    await cache.del(`profile:${userId}`);
    return;
  }

  /* Single task cache */
  if (taskId) {
    await cache.del(`task:${taskId}`);
    return;
  }

  /* Task list cache */
  if (tasks?.userId) {
    const statuses = [
      "all",
      "pending",
      "in-progress",
      "completed",
    ];

    await Promise.all([
      ...statuses.map((status) => {

        /* If specific filtered cache */
        if (tasks.search?.status === status) {
          return cache.del(
            `${tasks.userId}:${status}:${tasks.search?.title ?? ""}`
          );
        }

        /* Otherwise clear base status cache */
        return cache.del(
          `${tasks.userId}:${status}:`
        );
      }),

      /* Dashboard cache */
      cache.del(`dashboard:${tasks.userId}`),
    ]);
  }
};