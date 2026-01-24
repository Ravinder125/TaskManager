import { Redis } from "ioredis";
import dotenv from "dotenv";
import { ENV } from "./env.config.js";

dotenv.config();


const redis = new Redis(ENV.REDIS_URL, {
    tls: {}, // required for Upstash TLS
});

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (error: Error) => {
    console.error("Redis error:", error);
});

export default redis;
