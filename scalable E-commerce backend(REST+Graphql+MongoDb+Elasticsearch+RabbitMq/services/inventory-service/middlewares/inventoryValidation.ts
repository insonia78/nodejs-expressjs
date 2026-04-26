import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

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

export const validateProductId = [
	param("productId").isString().trim().notEmpty().withMessage("productId is required")
];

export const validateUpsertInventory = [
	body("productId").isString().trim().notEmpty().withMessage("productId is required"),
	body("sku").isString().trim().notEmpty().withMessage("sku is required"),
	body("available").optional().isInt({ min: 0 }).withMessage("available must be 0 or greater").toInt(),
	body("reserved").optional().isInt({ min: 0 }).withMessage("reserved must be 0 or greater").toInt(),
	body("reorderThreshold").optional().isInt({ min: 0 }).withMessage("reorderThreshold must be 0 or greater").toInt()
];
