import { createClient } from "redis";
import "dotenv/config";
type RedisClient = ReturnType<typeof createClient>;
export declare const getRedisClient: () => Promise<RedisClient | null>;
export declare const disconnectRedis: () => Promise<void>;
export {};
//# sourceMappingURL=redis.d.ts.map