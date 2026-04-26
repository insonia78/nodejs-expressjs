import { Request, Response } from "express";

import { createLogger } from "../../../packages/common/src";
import { getUserById, listUsers, loginUser, registerUser } from "../services/authService";

const logger = createLogger("users");

interface RequestWithId extends Request {
	requestId?: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const email = req.body?.email;

	logger.debug("Register started", {
		requestId,
		path: req.path,
		method: req.method,
		email
	});

	try {
		const result = await registerUser(req.body);
		logger.info("Register completed", {
			requestId,
			path: req.path,
			statusCode: 201,
			durationMs: Date.now() - startedAt,
			userId: result?.user?.id
		});
		res.status(201).json(result);
	} catch (error) {
		const duplicateEmail =
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code?: unknown }).code === 11000;

		if (duplicateEmail) {
			logger.warn("Register failed - email already exists", {
				requestId,
				path: req.path,
				statusCode: 409,
				durationMs: Date.now() - startedAt,
				email
			});
			res.status(409).json({ message: "User with this email already exists" });
			return;
		}

		logger.error("Register failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			error
		});
		throw error;
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const email = req.body?.email;

	logger.debug("Login started", {
		requestId,
		path: req.path,
		method: req.method,
		email
	});

	try {
		const result = await loginUser(req.body);
		if (!result) {
			logger.warn("Login failed - invalid credentials", {
				requestId,
				path: req.path,
				statusCode: 401,
				durationMs: Date.now() - startedAt
			});
			res.status(401).json({ message: "Invalid email or password" });
			return;
		}

		logger.info("Login completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			userId: result?.user?.id
		});
		res.json(result);
	} catch (error) {
		logger.error("Login failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			error
		});
		throw error;
	}
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;

	logger.debug("List users started", {
		requestId,
		path: req.path,
		method: req.method
	});

	try {
		const users = await listUsers();
		logger.info("List users completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			count: users.length
		});
		res.json(users);
	} catch (error) {
		logger.error("List users failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			error
		});
		throw error;
	}
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
	const startedAt = Date.now();
	const requestId = (req as RequestWithId).requestId;
	const userId = String(req.params.id ?? "");

	logger.debug("Get user started", {
		requestId,
		path: req.path,
		method: req.method,
		userId
	});

	try {
		const user = await getUserById(userId);
		if (!user) {
			logger.warn("Get user - not found", {
				requestId,
				path: req.path,
				statusCode: 404,
				durationMs: Date.now() - startedAt,
				userId
			});
			res.status(404).json({ message: "User not found" });
			return;
		}

		logger.info("Get user completed", {
			requestId,
			path: req.path,
			statusCode: 200,
			durationMs: Date.now() - startedAt,
			userId
		});
		res.json(user);
	} catch (error) {
		logger.error("Get user failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			userId,
			error
		});
		throw error;
	}
};