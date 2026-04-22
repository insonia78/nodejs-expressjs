import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
	AuthErrorResponse,
	GenerateTokenRequestBody,
	GenerateTokenResponse,
	RefreshTokenRequestBody
} from "../models/auth";
import { logger } from "../utils/logger";
import "dotenv/config";

const accessTokenExpiresIn = "1h";
const refreshTokenExpiresIn = "7d";

const getJwtSecret = (): string | undefined => process.env.JWT_SECRET;

const createAccessToken = (userId: string, secret: string): string =>
	jwt.sign({ sub: userId }, secret, { expiresIn: accessTokenExpiresIn });

const createRefreshToken = (userId: string, secret: string): string =>
	jwt.sign({ sub: userId, type: "refresh" }, secret, { expiresIn: refreshTokenExpiresIn });

const getRefreshTokenSubject = (token: string, secret: string): string | undefined => {
	const decoded = jwt.verify(token, secret);

	if (typeof decoded === "string") {
		return undefined;
	}

	return typeof decoded.sub === "string" ? decoded.sub : undefined;
};

export const generateToken = (
	req: Request<{}, GenerateTokenResponse | AuthErrorResponse, GenerateTokenRequestBody>,
	res: Response<GenerateTokenResponse | AuthErrorResponse>
): void => {
	logger.debug("POST /auth/token - incoming request");

	const secret = getJwtSecret();
	if (!secret) {
		logger.error("POST /auth/token - JWT_SECRET not configured");
		res.status(500).json({ message: "JWT_SECRET is not configured" });
		return;
	}

	const { userId } = req.body;
	const token = createAccessToken(userId, secret);
	const refreshToken = createRefreshToken(userId, secret);

	const response: GenerateTokenResponse = {
		message: "Tokens generated successfully",
		token,
		refreshToken
	};

	logger.info("POST /auth/token - tokens generated", { status: 200 });

	res.status(200).json(response);
};

export const refreshToken = (
	req: Request<{}, GenerateTokenResponse | AuthErrorResponse, RefreshTokenRequestBody>,
	res: Response<GenerateTokenResponse | AuthErrorResponse>
): void => {
	logger.debug("POST /auth/refresh - incoming request");

	const secret = getJwtSecret();
	if (!secret) {
		logger.error("POST /auth/refresh - JWT_SECRET not configured");
		res.status(500).json({ message: "JWT_SECRET is not configured" });
		return;
	}

	try {
		const userId = getRefreshTokenSubject(req.body.refreshToken, secret);

		if (!userId) {
			logger.error("POST /auth/refresh - invalid refresh token");
			res.status(401).json({ message: "Invalid refresh token" });
			return;
		}

		const response: GenerateTokenResponse = {
			message: "Token refreshed successfully",
			token: createAccessToken(userId, secret),
			refreshToken: createRefreshToken(userId, secret)
		};

		logger.info("POST /auth/refresh - token refreshed", { status: 200 });

		res.status(200).json(response);
	} catch (error) {
		logger.error("POST /auth/refresh - invalid refresh token", { error });
		res.status(401).json({ message: "Invalid refresh token" });
		return;
	}
};
