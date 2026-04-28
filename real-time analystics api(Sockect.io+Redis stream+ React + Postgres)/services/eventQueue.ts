import { TrackedEvent } from "../types/analytics";
import { getRedisClient } from "../utils/redis";

export const enqueueEvent = async (event: TrackedEvent): Promise<void> => {
  const redis = getRedisClient();
  await redis.xadd(
    process.env.REDIS_STREAM_KEY ?? "analytics:events",
    "*",
    "payload",
    JSON.stringify(event)
  );
};