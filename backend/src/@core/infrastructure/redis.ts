import Redis from "ioredis";
import { env } from "../config/env.js";

// Singleton Pattern for Redis
let redisInstance: Redis | null = null;

export const getRedis = (): Redis => {
  if (!redisInstance) {
    console.log("🔌 Initializing Redis Connection...");
    
    redisInstance = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisInstance.on("connect", () => console.log("✅ Redis Connected"));
    redisInstance.on("error", (err) => console.error("❌ Redis Error:", err));
  }
  return redisInstance;
};

// Export singleton
export const redis = getRedis();