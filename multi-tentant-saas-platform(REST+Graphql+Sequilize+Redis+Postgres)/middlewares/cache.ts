import { NextFunction, Request, Response } from "express";
import { getRedisClient } from "../utils/redis";
import { logger } from "../utils/logger";

const DEFAULT_TTL_SECONDS = 60;

const stableStringify = (value: unknown): string => {
	if (value === null || typeof value !== "object") {
		return JSON.stringify(value);
	}

	if (Array.isArray(value)) {
		return `[${value.map((item) => stableStringify(item)).join(",")}]`;
	}

	const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
		left.localeCompare(right)
	);

	return `{${entries
		.map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`)
		.join(",")}}`;
};

const buildCacheKey = (req: Request): string => {
	return [
		"api-cache",
		req.method,
		req.baseUrl || "root",
		req.path,
		stableStringify(req.query),
		stableStringify(req.body)
	].join(":");
};

export const cacheResponse = (ttlSeconds = DEFAULT_TTL_SECONDS) => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const client = await getRedisClient();

		if (!client || !client.isReady) {
			next();
			return;
		}

		const cacheKey = buildCacheKey(req);

		try {
			const cachedResponse = await client.get(cacheKey);
			if (cachedResponse) {
				logger.info("Cache hit", { route: `${req.method} ${req.originalUrl}` });
				res.status(200).json(JSON.parse(cachedResponse));
				return;
			}
		} catch (error) {
			logger.error("Cache read failed", {
				error: error instanceof Error ? error.message : String(error)
			});
		}

		const originalJson = res.json.bind(res);

		res.json = ((body: unknown) => {
			void (async () => {
				try {
					await client.set(cacheKey, JSON.stringify(body), { EX: ttlSeconds });
					logger.info("Cache stored", {
						route: `${req.method} ${req.originalUrl}`,
						ttlSeconds
					});
				} catch (error) {
					logger.error("Cache write failed", {
						error: error instanceof Error ? error.message : String(error)
					});
				}
			})();

			return originalJson(body);
		}) as Response["json"];

		next();
	};
};

export const invalidateCache = (prefixes: string[]) => {
	return async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
		const client = await getRedisClient();

		if (!client || !client.isReady) {
			next();
			return;
		}

		try {
			for (const prefix of prefixes) {
				const keys = await client.keys(`${prefix}*`);
				if (keys.length > 0) {
					await client.del(keys);
					logger.info("Cache invalidated", { prefix, keyCount: keys.length });
				}
			}
		} catch (error) {
			logger.error("Cache invalidation failed", {
				error: error instanceof Error ? error.message : String(error)
			});
		}

		next();
	};
};
