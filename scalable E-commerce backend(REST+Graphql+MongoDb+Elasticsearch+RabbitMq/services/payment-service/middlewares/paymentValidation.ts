import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

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

export const validateProcessPayment = [
	body("orderId").isString().trim().notEmpty().withMessage("orderId is required"),
	body("amount").isFloat({ gt: 0 }).withMessage("amount must be greater than 0").toFloat(),
	body("currency")
		.optional()
		.isString()
		.trim()
		.isLength({ min: 3, max: 3 })
		.withMessage("currency must be a 3-letter code")
		.toUpperCase()
];
