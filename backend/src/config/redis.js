import Redis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config();
const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
});

redis.on('connect', () => console.log('Redis connected'))
redis.on('error', (error) => console.error('Redis error:', error))

export default redis;