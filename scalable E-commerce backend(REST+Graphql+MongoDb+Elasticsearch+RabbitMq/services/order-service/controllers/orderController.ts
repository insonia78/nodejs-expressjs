import { Request, Response } from "express";

import { createLogger, OrderStatus } from "../../../packages/common/src";
import { updateOrderStatusCommand } from "../commands/createOrder";
import { getOrderByIdQuery, listOrdersQuery } from "../queries/searchOrders";

const logger = createLogger("orders");

interface RequestWithId extends Request {
	requestId?: string;
}

export const listOrders = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;

	logger.debug("List orders started", {
		requestId,
		path: req.path,
		method: req.method,
		query: req.query
	});

	try {
		const orders = await listOrdersQuery({
			userId: typeof req.query.userId === "string" ? req.query.userId : undefined,
			status: typeof req.query.status === "string" ? req.query.status : undefined
		});

		logger.info("List orders completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			count: orders.length
		});
		res.json(orders);
	} catch (error) {
		logger.error("List orders failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			error
		});
		throw error;
	}
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const orderId = String(req.params.id ?? "");

	logger.debug("Get order started", {
		requestId,
		path: req.path,
		method: req.method,
		orderId
	});

	try {
		const order = await getOrderByIdQuery(orderId);
		if (!order) {
			logger.warn("Get order - not found", {
				requestId,
				path: req.path,
				statusCode: 404,
				durationMs: Date.now() - startedAt,
				orderId
			});
			res.status(404).json({ message: "Order not found" });
			return;
		}

		logger.info("Get order completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			orderId
		});
		res.json(order);
	} catch (error) {
		logger.error("Get order failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			orderId,
			error
		});
		throw error;
	}
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const orderId = String(req.params.id ?? "");
	const newStatus = req.body.status as OrderStatus;

	logger.debug("Update order status started", {
		requestId,
		path: req.path,
		method: req.method,
		orderId,
		newStatus
	});

	try {
		const order = await updateOrderStatusCommand(orderId, newStatus);
		if (!order) {
			logger.warn("Update order status - not found", {
				requestId,
				path: req.path,
				statusCode: 404,
				durationMs: Date.now() - startedAt,
				orderId,
				newStatus
			});
			res.status(404).json({ message: "Order not found" });
			return;
		}

		logger.info("Update order status completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			orderId,
			newStatus
		});
		res.json(order);
	} catch (error) {
		logger.error("Update order status failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			orderId,
			newStatus,
			error
		});
		throw error;
	}
};