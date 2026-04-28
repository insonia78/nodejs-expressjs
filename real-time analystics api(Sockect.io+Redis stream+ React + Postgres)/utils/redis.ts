import Redis from "ioredis";

let redis: Redis | null = null;

export const connectRedis = async (): Promise<void> => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");
  }
};

export const getRedisClient = (): Redis => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");
  }

  return redis;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};