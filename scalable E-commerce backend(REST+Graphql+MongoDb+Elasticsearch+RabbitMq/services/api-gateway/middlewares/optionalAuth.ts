import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { AuthenticatedRequest, createLogger } from "../../../packages/common/src";

const logger = createLogger("gateway");

export const attachUserIfPresent = (jwtSecret: string) => {
	return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
		const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
         
		if (!token) {
			next();
			return;
		}

		try {
			req.user = jwt.verify(token, jwtSecret) as AuthenticatedRequest["user"];
		} catch (error) {
			const requestIdHeader = req.headers["x-request-id"];
			const requestId =
				typeof requestIdHeader === "string"
					? requestIdHeader
					: Array.isArray(requestIdHeader) && typeof requestIdHeader[0] === "string"
						? requestIdHeader[0]
						: undefined;

			logger.warn("Ignoring invalid bearer token at gateway", {
				requestId,
				path: req.path,
				method: req.method,
				error: error instanceof Error ? error.message : String(error)
			});
		}

		next();
	};
};