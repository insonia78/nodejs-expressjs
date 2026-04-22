import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthErrorResponse } from "../models/auth";

export const authenticateToken = (
	req: Request,
	res: Response<AuthErrorResponse>,
	next: NextFunction
): void => {
	const authHeader = req.headers.authorization;
	
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({ message: "Missing or invalid Authorization header" });
		return;
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		res.status(401).json({ message: "Missing token" });
		return;
	}

	const secret = process.env.JWT_SECRET;

	if (!secret) {
		res.status(500).json({ message: "JWT_SECRET is not configured" });
		return;
	}

	jwt.verify(token, secret, (error) => {
		if (error) {
			res.status(403).json({ message: "Invalid or expired token" });
			return;
		}

		next();
	});
};
