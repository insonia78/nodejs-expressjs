import { Request, Response } from "express";

import { createLogger } from "../../../packages/common/src";
import { processPayment } from "../services/paymentProcessor";

const logger = createLogger("payments");

interface RequestWithId extends Request {
	requestId?: string;
}

export const processPaymentRequest = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const orderId = String(req.body.orderId ?? "");
	const amount = Number(req.body.amount ?? 0);
	const currency = String(req.body.currency ?? "USD");

	logger.debug("Process payment started", {
		requestId,
		path: req.path,
		method: req.method,
		orderId,
		amount,
		currency
	});

	try {
		const payment = await processPayment({
			orderId,
			amount,
			currency
		});

		logger.info("Process payment completed", {
			requestId,
			path: req.path,
			statusCode: 201,
			durationMs: Date.now() - startedAt,
			orderId,
			amount,
			currency
		});
		res.status(201).json(payment);
	} catch (error) {
		logger.error("Process payment failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			orderId,
			amount,
			currency,
			error
		});
		throw error;
	}
};