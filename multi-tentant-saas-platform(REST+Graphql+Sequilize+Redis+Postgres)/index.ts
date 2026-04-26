import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { graphql } from "graphql";
import { connectDatabase, syncDatabase } from "./database/sequelize";
import "./database/models";
import { rootValue, schema } from "./graphql/schema";
import authRouter from "./routes/auth";
import tenantsRouter from "./routes/tenants";
import usersRouter from "./routes/users";
import { authenticateToken } from "./middlewares/authJwt";
import { cacheResponse } from "./middlewares/cache";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/logger";
import { disconnectRedis } from "./utils/redis";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRouter);

app.post(
	"/graphql",
	authenticateToken,
	cacheResponse(),
	async (req, res, next) => {
		const source = typeof req.body?.query === "string" ? req.body.query : "";

		if (!source) {
			res.status(400).json({ message: "GraphQL query is required" });
			return;
		}

		try {
			const result = await graphql({
				schema,
				source,
				rootValue,
				variableValues:
					req.body?.variables && typeof req.body.variables === "object"
						? req.body.variables
						: undefined
			});

			res.status(result.errors?.length ? 400 : 200).json(result);
		} catch (error) {
			next(error);
		}
	}
);
app.use("/tenants", tenantsRouter);
app.use("/users", usersRouter);
app.use(notFoundHandler);
app.use(errorHandler);

process.on("SIGINT", () => {
	void disconnectRedis().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
	void disconnectRedis().finally(() => process.exit(0));
});

export const startServer = async (): Promise<void> => {
	await connectDatabase();
	await syncDatabase();

	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});
};

if (require.main === module) {
	void startServer().catch((error) => {
		console.error("Failed to start server", error);
		process.exit(1);
	});
}

export default app;
