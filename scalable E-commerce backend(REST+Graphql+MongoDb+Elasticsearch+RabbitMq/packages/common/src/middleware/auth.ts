import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		email: string;
		role: string;
	};
}

export const signAccessToken = (
	payload: { id: string; email: string; role: string },
	jwtSecret: string
): string => jwt.sign(payload, jwtSecret, { expiresIn: "7d" });

export const authenticateToken = (jwtSecret: string) => {
	return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
		const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");

		if (!token) {
			res.status(401).json({ message: "Authentication token is required" });
			return;
		}

		try {
			req.user = jwt.verify(token, jwtSecret) as AuthenticatedRequest["user"];
			next();
		} catch (error) {
			res.status(401).json({ message: "Invalid authentication token", error });
		}
	};
};