import { createClient } from "redis";
import { logger } from "./logger";
import "dotenv/config";
type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;

const getRedisUrl = (): string | null => {
	return process.env.REDIS_URL?.trim() || null;
};

const buildRedisClient = (): RedisClient => {
	const redisUrl = getRedisUrl();
	const client = createClient({
		...(redisUrl ? { url: redisUrl } : {}),
		socket: {
			connectTimeout: 250,
			reconnectStrategy: false
		}
	});

	client.on("error", (error) => {
		logger.error("Redis client error", {
			error: error instanceof Error ? error.message : String(error)
		});
	});

	return client;
};

export const getRedisClient = async (): Promise<RedisClient | null> => {
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
			logger.info("Redis connected");
		}

		return redisClient.isReady ? redisClient : null;
	} catch (error) {
		redisClient.destroy();
		redisClient = null;
		logger.error("Redis unavailable, continuing without cache", {
			error: error instanceof Error ? error.message : String(error)
		});
		return null;
	}
};

export const disconnectRedis = async (): Promise<void> => {
	if (!redisClient?.isOpen) {
		return;
	}

	await redisClient.quit();
	logger.info("Redis disconnected");
};
