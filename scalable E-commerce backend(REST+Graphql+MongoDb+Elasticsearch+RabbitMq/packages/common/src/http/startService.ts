import { connect } from "mongoose";

import { ServiceRuntimeConfig } from "../config/env";

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const connectMongo = async (config: ServiceRuntimeConfig, databaseName: string): Promise<void> => {
	let retries = 0;
	const maxRetries = 15;
	const baseDelay = 1000; // 1 second

	while (retries < maxRetries) {
		try {
			await connect(config.mongoUri, {
				dbName: databaseName,
				serverSelectionTimeoutMS: 5000,
				socketTimeoutMS: 5000
			});
			console.info(`[${config.serviceName}] connected to MongoDB`);
			return;
		} catch (error) {
			retries++;
			if (retries >= maxRetries) {
				throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${error}`);
			}

			const delay = baseDelay * Math.pow(2, Math.min(retries - 1, 4)); // Exponential backoff, max 16s
			console.warn(`[${config.serviceName}] MongoDB connection attempt ${retries}/${maxRetries} failed, retrying in ${delay}ms...`);
			await sleep(delay);
		}
	}
};

export const startHttpService = async (
	config: ServiceRuntimeConfig,
	onStart: () => Promise<void> | void
): Promise<void> => {
	await onStart();
	console.info(`[${config.serviceName}] ready on port ${config.port}`);
};