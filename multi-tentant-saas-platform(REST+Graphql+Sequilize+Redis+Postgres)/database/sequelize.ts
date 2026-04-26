import "dotenv/config";
import { Sequelize } from "sequelize";
import { logger } from "../utils/logger";

const databaseName = process.env.POSTGRES_DB || "saas_platform";
const databaseUser = process.env.POSTGRES_USER || "postgres";
const databasePassword = process.env.POSTGRES_PASSWORD || "postgres";
const databaseHost = process.env.POSTGRES_HOST || "127.0.0.1";
const databasePort = Number(process.env.POSTGRES_PORT || 5432);


export const sequelize = new Sequelize(databaseName, databaseUser, databasePassword, {
	host: databaseHost,
	port: databasePort,
	dialect: "postgres",
	logging: false
});

export const connectDatabase = async (): Promise<void> => {
	try {
		await sequelize.authenticate();
		logger.info("Postgres connection established", {
			database: databaseName,
			host: databaseHost,
			port: databasePort
		});
	} catch (error) {
		logger.error("Unable to connect to Postgres", {
			error: error instanceof Error ? error.message : String(error)
		});
		throw error;
	}
};

export const syncDatabase = async (): Promise<void> => {
	await sequelize.sync();
	logger.info("Database models synchronized");
};
