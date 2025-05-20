import Redis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config();
const redis = new Redis();

redis.on('connect', () => console.log('Redis connected'))
redis.on('error', (error) => console.error('Redis error:', error))

export default redis;