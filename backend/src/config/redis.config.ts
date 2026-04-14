import { createClient } from 'redis';
import { ENV } from './env.config.js';
import { logger } from './logger.js';

const client = createClient({
    username: ENV.REDIS_USERNAME,
    password: ENV.REDIS_PASSWORD,
    socket: {
        host: ENV.REDIS_SOCKET_HOST,
        port: Number(ENV.REDIS_SOCKET_PORT)
    }
});

client.on('error', (err:any) => logger.error('Redis Client Error', err));
client.on("connect", ()=> logger.info("Redis successfully connected"))

await client.connect();

const result = await client;
console.log(result)  // >>> bar
export default result