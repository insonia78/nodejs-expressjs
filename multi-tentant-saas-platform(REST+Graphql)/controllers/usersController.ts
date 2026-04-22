import { Request, Response } from "express";
import { User as SequelizeUser } from "../database/models";
import {
	CreateUserRequestBody,
	CreateUserResponse,
	GetUsersRequestQuery,
	GetUsersResponse
} from "../models/users";
import { logger } from "../utils/logger";

export const getUsers = (
	req: Request<{}, GetUsersResponse, {}, GetUsersRequestQuery>,
	res: Response<GetUsersResponse>
	): Promise<void> => {
	logger.debug("GET /users - incoming request");
	const limit = req.query.limit ? Number(req.query.limit) : null;

	return SequelizeUser.findAll({
		attributes: ["id", "email", "tenant_id", "role"],
		...(limit ? { limit } : {}),
		order: [["id", "ASC"]]
	})
		.then((users) => {
			const response: GetUsersResponse = {
				message: "Users fetched successfully",
				data: users.map((user) => ({
					id: user.id,
					email: user.email,
					tenant_id: user.tenant_id,
					role: user.role
				}))
			};

			logger.info("GET /users - response sent", {
				status: 200,
				userCount: response.data.length
			});

			res.status(200).json(response);
		})
		.catch(() => {
			logger.error("GET /users - database query failed");
			res.status(500).json({ message: "Failed to fetch users", data: [] });
		});
};

export const createUser = (
	req: Request<{}, CreateUserResponse, CreateUserRequestBody>,
	res: Response<CreateUserResponse>
	): Promise<void> => {
	logger.debug("POST /users - incoming request");

	const { email, tenant_id, role } = req.body;

	return SequelizeUser.create({
		email: email ?? "",
		tenant_id: tenant_id ?? 0,
		role: role ?? ""
	})
		.then((user) => {
			const response: CreateUserResponse = {
				message: "User created successfully",
				data: {
					id: user.id,
					email: user.email,
					tenant_id: user.tenant_id,
					role: user.role
				}
			};

			logger.info("POST /users - user created", {
				status: 201,
				role: response.data.role
			});

			res.status(201).json(response);
		})
		.catch(() => {
			logger.error("POST /users - database insert failed");
			res.status(500).json({
				message: "Failed to create user",
				data: { id: 0, email: "", tenant_id: 0, role: "" }
			});
		});
};
