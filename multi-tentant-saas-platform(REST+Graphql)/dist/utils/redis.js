"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.getRedisClient = void 0;
const redis_1 = require("redis");
const logger_1 = require("./logger");
require("dotenv/config");
let redisClient = null;
const getRedisUrl = () => {
    return process.env.REDIS_URL?.trim() || null;
};
const buildRedisClient = () => {
    const redisUrl = getRedisUrl();
    const client = (0, redis_1.createClient)({
        ...(redisUrl ? { url: redisUrl } : {}),
        socket: {
            connectTimeout: 250,
            reconnectStrategy: false
        }
    });
    client.on("error", (error) => {
        logger_1.logger.error("Redis client error", {
            error: error instanceof Error ? error.message : String(error)
        });
    });
    return client;
};
const getRedisClient = async () => {
    if (!getRedisUrl()) {
        return null;
    }
    if (redisClient?.isReady) {
        return redisClient;
    }
    redisClient = redisClient ?? buildRedisClient();
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            logger_1.logger.info("Redis connected");
        }
        return redisClient.isReady ? redisClient : null;
    }
    catch (error) {
        redisClient.destroy();
        redisClient = null;
        logger_1.logger.error("Redis unavailable, continuing without cache", {
            error: error instanceof Error ? error.message : String(error)
        });
        return null;
    }
};
exports.getRedisClient = getRedisClient;
const disconnectRedis = async () => {
    if (!redisClient?.isOpen) {
        return;
    }
    await redisClient.quit();
    logger_1.logger.info("Redis disconnected");
};
exports.disconnectRedis = disconnectRedis;
//# sourceMappingURL=redis.js.map