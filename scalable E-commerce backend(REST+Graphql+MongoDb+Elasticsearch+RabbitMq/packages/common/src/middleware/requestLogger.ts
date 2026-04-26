import { NextFunction, Request, Response } from "express";

import { createLogger, createRequestId } from "../logging/logger";
import { ServiceName } from "../types/domain";

export interface RequestWithTrace extends Request {
	requestId?: string;
	serviceName?: ServiceName;
}

const readRequestId = (req: Request): string | undefined => {
	const value = req.headers["x-request-id"];

	if (typeof value === "string") {
		return value;
	}

	if (Array.isArray(value) && typeof value[0] === "string") {
		return value[0];
	}

	return undefined;
};

export const requestLogger = (serviceName: ServiceName) => {
	const logger = createLogger(serviceName);

	return (req: RequestWithTrace, res: Response, next: NextFunction): void => {
		const startedAt = Date.now();
		const requestId = readRequestId(req) ?? createRequestId();

		req.requestId = requestId;
		res.setHeader("x-request-id", requestId);

		res.on("finish", () => {
			logger.info("Request completed", {
				requestId,
				method: req.method,
				path: req.originalUrl,
				statusCode: res.statusCode,
				durationMs: Date.now() - startedAt,
				ip: req.ip
			});
		});

		next();
	};
};