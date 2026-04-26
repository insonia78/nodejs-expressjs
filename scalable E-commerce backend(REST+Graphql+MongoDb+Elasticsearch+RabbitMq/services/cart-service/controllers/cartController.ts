import { Request, Response } from "express";

import { AuthenticatedRequest, createLogger, ProductDocumentShape, requestJson } from "../../../packages/common/src";
import { checkoutCart } from "../services/checkout";
import { cartStore, getCatalogProductUrl } from "../services/cartStore";

const logger = createLogger("cart");

interface RequestWithId extends Request {
	requestId?: string;
}

const resolveUserId = (req: Request): string => {
	const maybeAuth = req as AuthenticatedRequest;
	return (
		maybeAuth.user?.id ??
		(typeof req.headers["x-user-id"] === "string" ? req.headers["x-user-id"] : undefined) ??
		(typeof req.query.userId === "string" ? req.query.userId : undefined) ??
		(typeof req.body?.userId === "string" ? req.body.userId : undefined) ??
		"guest-user"
	);
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const userId = resolveUserId(req);

	logger.debug("Get cart started", {
		requestId,
		path: req.path,
		method: req.method,
		userId
	});

	try {
		const cart = await cartStore.getCart(userId);
		logger.info("Get cart completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			userId,
			itemCount: cart?.items?.length ?? 0
		});
		res.json(cart);
	} catch (error) {
		logger.error("Get cart failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			userId,
			error
		});
		throw error;
	}
};

export const addCartItem = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const userId = resolveUserId(req);
	const quantity = Number(req.body.quantity ?? 1);
	const productId = String(req.body.productId ?? "");

	logger.debug("Add cart item started", {
		requestId,
		path: req.path,
		method: req.method,
		userId,
		productId,
		quantity
	});

	try {
		const product = await requestJson<ProductDocumentShape>(getCatalogProductUrl(productId));

		const cart = await cartStore.addItem(userId, {
			productId: product.id,
			name: product.name,
			price: product.price,
			currency: product.currency,
			quantity,
			sku: product.slug
		});

		logger.info("Add cart item completed", {
			requestId,
			path: req.path,
			statusCode: 201,
			durationMs: Date.now() - startedAt,
			userId,
			productId
		});
		res.status(201).json(cart);
	} catch (error) {
		logger.error("Add cart item failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			userId,
			productId,
			error
		});
		throw error;
	}
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const userId = resolveUserId(req);
	const productId = String(req.params.productId ?? "");
	const quantity = Number(req.body.quantity ?? 1);

	logger.debug("Update cart item started", {
		requestId,
		path: req.path,
		method: req.method,
		userId,
		productId,
		quantity
	});

	try {
		const cart = await cartStore.updateItem(userId, productId, quantity);
		logger.info("Update cart item completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			userId,
			productId
		});
		res.json(cart);
	} catch (error) {
		logger.error("Update cart item failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			userId,
			productId,
			error
		});
		throw error;
	}
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const userId = resolveUserId(req);
	const productId = String(req.params.productId ?? "");

	logger.debug("Remove cart item started", {
		requestId,
		path: req.path,
		method: req.method,
		userId,
		productId
	});

	try {
		const cart = await cartStore.removeItem(userId, productId);
		logger.info("Remove cart item completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			userId,
			productId
		});
		res.json(cart);
	} catch (error) {
		logger.error("Remove cart item failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			userId,
			productId,
			error
		});
		throw error;
	}
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const userId = resolveUserId(req);

	logger.debug("Clear cart started", {
		requestId,
		path: req.path,
		method: req.method,
		userId
	});

	try {
		await cartStore.clear(userId);
		logger.info("Clear cart completed", {
			requestId,
			path: req.path,
			statusCode: 204,
			durationMs: Date.now() - startedAt,
			userId
		});
		res.status(204).send();
	} catch (error) {
		logger.error("Clear cart failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			userId,
			error
		});
		throw error;
	}
};

export const checkout = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const userId = resolveUserId(req);

	logger.debug("Checkout started", {
		requestId,
		path: req.path,
		method: req.method,
		userId
	});

	try {
		const result = await checkoutCart(userId);
		logger.info("Checkout completed", {
			requestId,
			path: req.path,
			statusCode: 202,
			durationMs: Date.now() - startedAt,
			userId,
			total: result.total,
			currency: result.currency
		});
		res.status(202).json({
			message: "Checkout accepted",
			userId,
			total: result.total,
			currency: result.currency
		});
	} catch (error) {
		logger.error("Checkout failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			userId,
			error
		});
		res.status(400).json({ message: "Cart is empty" });
	}
};