import { NextFunction, Request, Response } from "express";
import { param, query, body, validationResult } from "express-validator";

import { OrderStatus } from "../../../packages/common/src";

const orderStatuses = Object.values(OrderStatus);

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).json({
			message: "Validation failed",
			errors: errors.array({ onlyFirstError: true })
		});
		return;
	}

	next();
};

export const validateListOrdersQuery = [
	query("userId").optional().isString().trim().notEmpty().withMessage("userId must be a non-empty string"),
	query("status").optional().isIn(orderStatuses).withMessage("status is invalid")
];

export const validateOrderId = [
	param("id").isString().trim().notEmpty().withMessage("order id is required")
];

export const validateUpdateOrderStatus = [
	body("status").isIn(orderStatuses).withMessage("status is invalid")
];
