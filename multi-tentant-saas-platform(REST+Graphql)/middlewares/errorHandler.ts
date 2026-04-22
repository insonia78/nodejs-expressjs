import { NextFunction, Request, Response } from "express";
import { MessageResponse } from "../models/common";

export const notFoundHandler = (
	req: Request,
	res: Response<MessageResponse>,
	_next: NextFunction
): void => {
	res.status(404).json({
		message: `Route not found: ${req.method} ${req.originalUrl}`
	});
};

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response<MessageResponse>,
	_next: NextFunction
): void => {
	const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

	res.status(statusCode).json({
		message: err.message || "Internal server error"
	});
};
