import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ValidationErrorResponse } from "../models/users";

export const validateRequest = (
	req: Request,
	res: Response<ValidationErrorResponse>,
	next: NextFunction
): void => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({
			message: "Validation failed",
			errors: errors.array().map((error) => error.msg)
		});
		return;
	}

	next();
};
