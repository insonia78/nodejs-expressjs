import { NextFunction, Request, Response } from "express";
import { body, param, query, validationResult } from "express-validator";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
	param("id").isString().notEmpty().withMessage("Product id is required")
];

export const validateListProductsQuery = [
	query("category").optional().isString().trim().notEmpty(),
	query("search").optional().isString().trim().notEmpty(),
	query("minPrice").optional().isFloat({ min: 0 }).toFloat(),
	query("maxPrice").optional().isFloat({ min: 0 }).toFloat(),
	query("active").optional().isBoolean().toBoolean()
];

export const validateCreateProduct = [
	body("name").isString().trim().notEmpty(),
	body("slug").isString().trim().matches(slugPattern).withMessage("Slug must be lowercase and hyphen-separated"),
	body("description").isString().trim().notEmpty(),
	body("price").isFloat({ gt: 0 }).toFloat(),
	body("currency").optional().isString().trim().isLength({ min: 3, max: 3 }).toUpperCase(),
	body("category").isString().trim().notEmpty(),
	body("tags").optional().isArray(),
	body("tags.*").optional().isString().trim().notEmpty(),
	body("stock").optional().isInt({ min: 0 }).toInt(),
	body("active").optional().isBoolean().toBoolean()
];

export const validateUpdateProduct = [
	body("name").optional().isString().trim().notEmpty(),
	body("slug")
		.optional()
		.isString()
		.trim()
		.matches(slugPattern)
		.withMessage("Slug must be lowercase and hyphen-separated"),
	body("description").optional().isString().trim().notEmpty(),
	body("price").optional().isFloat({ gt: 0 }).toFloat(),
	body("currency").optional().isString().trim().isLength({ min: 3, max: 3 }).toUpperCase(),
	body("category").optional().isString().trim().notEmpty(),
	body("tags").optional().isArray(),
	body("tags.*").optional().isString().trim().notEmpty(),
	body("stock").optional().isInt({ min: 0 }).toInt(),
	body("active").optional().isBoolean().toBoolean()
];