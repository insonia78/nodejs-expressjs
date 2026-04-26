import { Request, Response } from "express";

import { AuthenticatedRequest, createLogger, getServiceConfig } from "../../../packages/common/src";

const gatewayConfig = getServiceConfig("gateway", 4000);
const logger = createLogger("gateway");

type TargetService = keyof typeof gatewayConfig.serviceUrls;

const copyQueryParams = (targetUrl: URL, query: Request["query"]): void => {
	for (const [key, rawValue] of Object.entries(query)) {
		if (Array.isArray(rawValue)) {
			for (const value of rawValue) {
				targetUrl.searchParams.append(key, String(value));
			}
			continue;
		}

		if (rawValue !== undefined) {
			targetUrl.searchParams.set(key, String(rawValue));
		}
	}
};

export const createServiceProxy = (service: TargetService, sourcePrefix: string) => {
	return async (req: Request, res: Response): Promise<void> => {
		const startedAt = Date.now();
		const forwardedPath = req.originalUrl.startsWith(sourcePrefix)
			? req.originalUrl.slice(sourcePrefix.length) || "/"
			: req.path;
		const targetUrl = new URL(forwardedPath, gatewayConfig.serviceUrls[service]);
		copyQueryParams(targetUrl, req.query);
		const requestId = (req as Request & { requestId?: string }).requestId;

		logger.debug("Proxy forwarding started", {
			requestId,
			method: req.method,
			path: req.originalUrl,
			targetService: service,
			targetUrl: targetUrl.toString()
		});

		try {
			const authenticatedRequest = req as AuthenticatedRequest;
			const response = await fetch(targetUrl, {
				method: req.method,
				headers: {
					...(req.headers.authorization ? { authorization: req.headers.authorization } : {}),
					...(req.headers["content-type"] ? { "content-type": String(req.headers["content-type"]) } : {}),
					...(authenticatedRequest.user?.id ? { "x-user-id": authenticatedRequest.user.id } : {})
				},
				body: ["GET", "HEAD"].includes(req.method.toUpperCase()) ? undefined : JSON.stringify(req.body)
			});

			const payload = await response.text();
			const contentType = response.headers.get("content-type");

			if (contentType) {
				res.setHeader("content-type", contentType);
			}

			logger.info("Proxy forwarding completed", {
				requestId,
				method: req.method,
				path: req.originalUrl,
				targetService: service,
				targetUrl: targetUrl.toString(),
				statusCode: response.status,
				durationMs: Date.now() - startedAt
			});

			res.status(response.status).send(payload);
		} catch (error) {
			logger.error("Proxy forwarding failed", {
				requestId,
				method: req.method,
				path: req.originalUrl,
				targetService: service,
				targetUrl: targetUrl.toString(),
				durationMs: Date.now() - startedAt,
				error
			});

			throw error;
		}
	};
};