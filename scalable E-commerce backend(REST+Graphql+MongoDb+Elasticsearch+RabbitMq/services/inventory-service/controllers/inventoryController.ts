import { Request, Response } from "express";

import { createLogger } from "../../../packages/common/src";
import { InventoryModel, mapInventoryDocument } from "../models/InventoryItem";

const logger = createLogger("inventory");

interface RequestWithId extends Request {
	requestId?: string;
}

export const listInventory = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;

	logger.debug("List inventory started", {
		requestId,
		path: req.path,
		method: req.method
	});

	try {
		const records = await InventoryModel.find().sort({ updatedAt: -1 });
		logger.info("List inventory completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			count: records.length
		});
		res.json(records.map((record) => mapInventoryDocument(record)));
	} catch (error) {
		logger.error("List inventory failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			error
		});
		throw error;
	}
};

export const getInventory = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const productId = req.params.productId;

	logger.debug("Get inventory started", {
		requestId,
		path: req.path,
		method: req.method,
		productId
	});

	try {
		const record = await InventoryModel.findOne({ productId });
		if (!record) {
			logger.warn("Get inventory - not found", {
				requestId,
				path: req.path,
				statusCode: 404,
				durationMs: Date.now() - startedAt,
				productId
			});
			res.status(404).json({ message: "Inventory record not found" });
			return;
		}

		logger.info("Get inventory completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			productId
		});
		res.json(mapInventoryDocument(record));
	} catch (error) {
		logger.error("Get inventory failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			productId,
			error
		});
		throw error;
	}
};

export const upsertInventory = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const productId = req.body.productId;

	logger.debug("Upsert inventory started", {
		requestId,
		path: req.path,
		method: req.method,
		productId
	});

	try {
		const record = await InventoryModel.findOneAndUpdate(
			{ productId },
			{
				productId,
				sku: req.body.sku,
				available: Number(req.body.available ?? 0),
				reserved: Number(req.body.reserved ?? 0),
				reorderThreshold: Number(req.body.reorderThreshold ?? 5)
			},
			{ upsert: true, new: true, runValidators: true }
		);

		logger.info("Upsert inventory completed", {
			requestId,
			path: req.path,
			statusCode: 201,
			durationMs: Date.now() - startedAt,
			productId
		});
		res.status(201).json(mapInventoryDocument(record));
	} catch (error) {
		logger.error("Upsert inventory failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			productId,
			error
		});
		throw error;
	}
};