"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.cacheResponse = void 0;
const redis_1 = require("../utils/redis");
const logger_1 = require("../utils/logger");
const DEFAULT_TTL_SECONDS = 60;
const stableStringify = (value) => {
    if (value === null || typeof value !== "object") {
        return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
        return `[${value.map((item) => stableStringify(item)).join(",")}]`;
    }
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries
        .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`)
        .join(",")}}`;
};
const buildCacheKey = (req) => {
    return [
        "api-cache",
        req.method,
        req.baseUrl || "root",
        req.path,
        stableStringify(req.query),
        stableStringify(req.body)
    ].join(":");
};
const cacheResponse = (ttlSeconds = DEFAULT_TTL_SECONDS) => {
    return async (req, res, next) => {
        const client = await (0, redis_1.getRedisClient)();
        if (!client || !client.isReady) {
            next();
            return;
        }
        const cacheKey = buildCacheKey(req);
        try {
            const cachedResponse = await client.get(cacheKey);
            if (cachedResponse) {
                logger_1.logger.info("Cache hit", { route: `${req.method} ${req.originalUrl}` });
                res.status(200).json(JSON.parse(cachedResponse));
                return;
            }
        }
        catch (error) {
            logger_1.logger.error("Cache read failed", {
                error: error instanceof Error ? error.message : String(error)
            });
        }
        const originalJson = res.json.bind(res);
        res.json = ((body) => {
            void (async () => {
                try {
                    await client.set(cacheKey, JSON.stringify(body), { EX: ttlSeconds });
                    logger_1.logger.info("Cache stored", {
                        route: `${req.method} ${req.originalUrl}`,
                        ttlSeconds
                    });
                }
                catch (error) {
                    logger_1.logger.error("Cache write failed", {
                        error: error instanceof Error ? error.message : String(error)
                    });
                }
            })();
            return originalJson(body);
        });
        next();
    };
};
exports.cacheResponse = cacheResponse;
const invalidateCache = (prefixes) => {
    return async (_req, _res, next) => {
        const client = await (0, redis_1.getRedisClient)();
        if (!client || !client.isReady) {
            next();
            return;
        }
        try {
            for (const prefix of prefixes) {
                const keys = await client.keys(`${prefix}*`);
                if (keys.length > 0) {
                    await client.del(keys);
                    logger_1.logger.info("Cache invalidated", { prefix, keyCount: keys.length });
                }
            }
        }
        catch (error) {
            logger_1.logger.error("Cache invalidation failed", {
                error: error instanceof Error ? error.message : String(error)
            });
        }
        next();
    };
};
exports.invalidateCache = invalidateCache;
//# sourceMappingURL=cache.js.map