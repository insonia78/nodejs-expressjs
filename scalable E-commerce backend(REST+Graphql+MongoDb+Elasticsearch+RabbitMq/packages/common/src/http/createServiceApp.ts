import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

import { errorHandler, notFoundHandler } from "../middleware/errorHandler";
import { requestLogger } from "../middleware/requestLogger";
import { RequestWithTrace } from "../middleware/requestLogger";
import { ServiceName } from "../types/domain";

export const createServiceApp = (serviceName: ServiceName): Express => {
	const app = express();

	app.use(helmet());
	app.use(cors());
	app.use((req, _res, next) => {
		(req as RequestWithTrace).serviceName = serviceName;
		next();
	});
	app.use(requestLogger(serviceName));
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	return app;
};

export const attachErrorHandlers = (app: Express): void => {
	app.use(notFoundHandler);
	app.use(errorHandler);
};