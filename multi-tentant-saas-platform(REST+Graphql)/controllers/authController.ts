import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
	AuthErrorResponse,
	GenerateTokenRequestBody,
	GenerateTokenResponse
} from "../models/auth";
import { logger } from "../utils/logger";
import "dotenv/config";

export const generateToken = (
	req: Request<{}, GenerateTokenResponse | AuthErrorResponse, GenerateTokenRequestBody>,
	res: Response<GenerateTokenResponse | AuthErrorResponse>
): void => {
	logger.debug("POST /auth/token - incoming request");

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		logger.error("POST /auth/token - JWT_SECRET not configured");
		res.status(500).json({ message: "JWT_SECRET is not configured" });
		return;
	}

	const { userId } = req.body;
	const token = jwt.sign({ sub: userId }, secret, { expiresIn: "1h" });

	const response: GenerateTokenResponse = {
		message: "Token generated successfully",
		token
	};

	logger.info("POST /auth/token - token generated", { status: 200 });

	res.status(200).json(response);
};
