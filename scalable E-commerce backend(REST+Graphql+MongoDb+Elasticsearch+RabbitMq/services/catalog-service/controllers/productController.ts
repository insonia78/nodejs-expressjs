import { Request, Response } from "express";

import { createLogger } from "../../../packages/common/src";
import { deleteProductCommand, ProductPatchInput, updateProductCommand, createProductCommand } from "../commands/createProduct";
import { getProductByIdQuery, listProductsQuery } from "../queries/searchProducts";

const logger = createLogger("catalog");

interface RequestWithId extends Request {
	requestId?: string;
}

const getProductIdFromParams = (req: Request): string => String(req.params.id ?? "");

const readOptionalString = (value: unknown): string | undefined =>
	typeof value === "string" && value.length > 0 ? value : undefined;

const readOptionalNumber = (value: unknown): number | undefined =>
	typeof value === "number" && Number.isFinite(value) ? value : undefined;

const readOptionalBoolean = (value: unknown): boolean | undefined =>
	typeof value === "boolean" ? value : undefined;

export const listProducts = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;

	logger.debug("List products started", {
		requestId,
		path: req.path,
		method: req.method,
		query: req.query
	});

	try {
		const products = await listProductsQuery({
			category: readOptionalString(req.query.category),
			search: readOptionalString(req.query.search),
			minPrice: readOptionalNumber(req.query.minPrice),
			maxPrice: readOptionalNumber(req.query.maxPrice),
			active: readOptionalBoolean(req.query.active)
		});

		logger.info("List products completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			count: products.length
		});
		res.json(products);
	} catch (error) {
		logger.error("List products failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			error
		});
		throw error;
	}
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const productId = getProductIdFromParams(req);

	logger.debug("Get product started", {
		requestId,
		path: req.path,
		method: req.method,
		productId
	});

	try {
		const product = await getProductByIdQuery(productId);

		if (!product) {
			logger.warn("Get product - not found", {
				requestId,
				path: req.path,
				statusCode: 404,
				durationMs: Date.now() - startedAt,
				productId
			});
			res.status(404).json({ message: "Product not found" });
			return;
		}

		logger.info("Get product completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			productId
		});
		res.json(product);
	} catch (error) {
		logger.error("Get product failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			productId,
			error
		});
		throw error;
	}
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;

	logger.debug("Create product started", {
		requestId,
		path: req.path,
		method: req.method,
		productName: req.body?.name
	});

	try {
		const product = await createProductCommand(req);
		logger.info("Create product completed", {
			requestId,
			path: req.path,
			statusCode: 201,
			durationMs: Date.now() - startedAt,
			productId: product.id
		});
		res.status(201).json(product);
	} catch (error) {
		logger.error("Create product failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			error
		});
		throw error;
	}
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const productId = getProductIdFromParams(req);

	logger.debug("Update product started", {
		requestId,
		path: req.path,
		method: req.method,
		productId
	});

	try {
		const product = await updateProductCommand(productId, req.body as ProductPatchInput);

		if (!product) {
			logger.warn("Update product - not found", {
				requestId,
				path: req.path,
				statusCode: 404,
				durationMs: Date.now() - startedAt,
				productId
			});
			res.status(404).json({ message: "Product not found" });
			return;
		}

		logger.info("Update product completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			productId
		});
		res.json(product);
	} catch (error) {
		logger.error("Update product failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			productId,
			error
		});
		throw error;
	}
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const productId = getProductIdFromParams(req);

	logger.debug("Delete product started", {
		requestId,
		path: req.path,
		method: req.method,
		productId
	});

	try {
		const deleted = await deleteProductCommand(productId);
		const statusCode = deleted ? 204 : 404;

		if (deleted) {
			logger.info("Delete product completed", {
				requestId,
				path: req.path,
				statusCode,
				durationMs: Date.now() - startedAt,
				productId
			});
		} else {
			logger.warn("Delete product - not found", {
				requestId,
				path: req.path,
				statusCode,
				durationMs: Date.now() - startedAt,
				productId
			});
		}
		res.status(statusCode).send();
	} catch (error) {
		logger.error("Delete product failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			productId,
			error
		});
		throw error;
	}
};