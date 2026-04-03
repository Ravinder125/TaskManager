import { createClient } from 'redis';
import { ENV } from './env.config.js';

const client = createClient({
    username: ENV.REDIS_USERNAME,
    password: ENV.REDIS_PASSWORD,
    socket: {
        host: ENV.REDIS_SOCKET_HOST,
        port: Number(ENV.REDIS_SOCKET_PORT)
    }
});

client.on('error', (err:any) => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

export default result