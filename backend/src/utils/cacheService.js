import redis from "../config/redis.js"


export const cache = {
    get: async (key) => {
        const data = await redis.get(key)
        return JSON.parse(data)
    },
    set: async (key, data, time = 300) => {
        return await redis.set(key, JSON.stringify(data), "EX", time)
    },
    del: async (key) => {
        return await redis.del(key)
    },
}

export const clearCache = async (userId, taskId, tasks = {}) => {
    if (userId) {
        await cache.del(`profile:${userId}`)
    } else if (taskId) {
        await cache.del(`task:${taskId}`)
    } else if (tasks) {
        await Promise.all(
            [
                ...['all', 'pending', 'in-progress', 'completed'].map(status => {
                    cache.del(`tasks:${status}`);
                }),
                cache.del(`dashboard:${tasks.userId}`),
                cache.del(`task:${tasks.taskId}`)
            ]
        )
    }
}