"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabase = exports.connectDatabase = exports.sequelize = void 0;
require("dotenv/config");
const sequelize_1 = require("sequelize");
const logger_1 = require("../utils/logger");
const databaseName = process.env.POSTGRES_DB || "saas_platform";
const databaseUser = process.env.POSTGRES_USER || "postgres";
const databasePassword = process.env.POSTGRES_PASSWORD || "postgres";
const databaseHost = process.env.POSTGRES_HOST || "127.0.0.1";
const databasePort = Number(process.env.POSTGRES_PORT || 5432);
exports.sequelize = new sequelize_1.Sequelize(databaseName, databaseUser, databasePassword, {
    host: databaseHost,
    port: databasePort,
    dialect: "postgres",
    logging: false
});
const connectDatabase = async () => {
    try {
        await exports.sequelize.authenticate();
        logger_1.logger.info("Postgres connection established", {
            database: databaseName,
            host: databaseHost,
            port: databasePort
        });
    }
    catch (error) {
        logger_1.logger.error("Unable to connect to Postgres", {
            error: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const syncDatabase = async () => {
    await exports.sequelize.sync();
    logger_1.logger.info("Database models synchronized");
};
exports.syncDatabase = syncDatabase;
//# sourceMappingURL=sequelize.js.map