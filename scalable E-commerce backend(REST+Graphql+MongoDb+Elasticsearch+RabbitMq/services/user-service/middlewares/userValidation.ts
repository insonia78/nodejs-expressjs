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

export const validateRegister = [
	body("name").isString().trim().notEmpty().withMessage("Name is required"),
	body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
	body("password").isString().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
	body("role").optional().isIn(["customer", "admin"]).withMessage("Role must be customer or admin")
];

export const validateLogin = [
	body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
	body("password").isString().notEmpty().withMessage("Password is required")
];

export const validateUserId = [
	param("id").isString().trim().notEmpty().withMessage("User id is required")
];
