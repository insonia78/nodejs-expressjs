import { NextFunction, Request, Response } from "express";
import { body, param, query, validationResult } from "express-validator";

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

export const validateCartQuery = [
	query("userId").optional().isString().trim().notEmpty().withMessage("userId must be a non-empty string")
];

export const validateAddCartItem = [
	body("productId").isString().trim().notEmpty().withMessage("productId is required"),
	body("quantity").optional().isInt({ min: 1 }).withMessage("quantity must be at least 1").toInt(),
	body("userId").optional().isString().trim().notEmpty().withMessage("userId must be a non-empty string")
];

export const validateUpdateCartItem = [
	param("productId").isString().trim().notEmpty().withMessage("productId is required"),
	body("quantity").isInt({ min: 0 }).withMessage("quantity must be 0 or greater").toInt(),
	body("userId").optional().isString().trim().notEmpty().withMessage("userId must be a non-empty string")
];

export const validateProductIdParam = [
	param("productId").isString().trim().notEmpty().withMessage("productId is required")
];

export const validateCheckout = [
	body("userId").optional().isString().trim().notEmpty().withMessage("userId must be a non-empty string"),
	query("userId").optional().isString().trim().notEmpty().withMessage("userId must be a non-empty string")
];
