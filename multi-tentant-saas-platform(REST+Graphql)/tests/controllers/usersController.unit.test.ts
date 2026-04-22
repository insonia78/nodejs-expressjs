import { Request } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	CreateUserRequestBody,
	CreateUserResponse,
	GetUsersRequestQuery,
	GetUsersResponse
} from "../../models/users";
import { createMockResponse } from "../helpers/httpMocks";

const {
	mockFindAll,
	mockCreate,
	mockDebug,
	mockInfo,
	mockError
} = vi.hoisted(() => ({
	mockFindAll: vi.fn(),
	mockCreate: vi.fn(),
	mockDebug: vi.fn(),
	mockInfo: vi.fn(),
	mockError: vi.fn()
}));

vi.mock("../../database/models", () => ({
	User: {
		findAll: mockFindAll,
		create: mockCreate
	}
}));

vi.mock("../../utils/logger", () => ({
	logger: {
		debug: mockDebug,
		info: mockInfo,
		error: mockError
	}
}));

import { createUser, getUsers } from "../../controllers/usersController";

describe("usersController", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("getUsers returns mapped users with limit", async () => {
		mockFindAll.mockResolvedValue([
			{ id: 1, email: "alice@example.com", tenant_id: 1, role: "admin" }
		]);

		const req = { query: { limit: "1" } } as Request<{}, GetUsersResponse, {}, GetUsersRequestQuery>;
		const { res, status, json } = createMockResponse<GetUsersResponse>();

		await getUsers(req, res);

		expect(mockFindAll).toHaveBeenCalledWith({
			attributes: ["id", "email", "tenant_id", "role"],
			limit: 1,
			order: [["id", "ASC"]]
		});
		expect(status).toHaveBeenCalledWith(200);
		expect(json).toHaveBeenCalledWith({
			message: "Users fetched successfully",
			data: [{ id: 1, email: "alice@example.com", tenant_id: 1, role: "admin" }]
		});
	});

	it("getUsers returns 500 when the database query fails", async () => {
		mockFindAll.mockRejectedValue(new Error("db error"));

		const req = { query: {} } as Request<{}, GetUsersResponse, {}, GetUsersRequestQuery>;
		const { res, status, json } = createMockResponse<GetUsersResponse>();

		await getUsers(req, res);

		expect(status).toHaveBeenCalledWith(500);
		expect(json).toHaveBeenCalledWith({ message: "Failed to fetch users", data: [] });
		expect(mockError).toHaveBeenCalledWith("GET /users - database query failed");
	});

	it("createUser persists a user and returns the created payload", async () => {
		mockCreate.mockResolvedValue({
			id: 10,
			email: "charlie@example.com",
			tenant_id: 1,
			role: "admin"
		});

		const req = { body: { email: "charlie@example.com", tenant_id: 1, role: "admin" } } as Request<
			{},
			CreateUserResponse,
			CreateUserRequestBody
		>;
		const { res, status, json } = createMockResponse<CreateUserResponse>();

		await createUser(req, res);

		expect(mockCreate).toHaveBeenCalledWith({
			email: "charlie@example.com",
			tenant_id: 1,
			role: "admin"
		});
		expect(status).toHaveBeenCalledWith(201);
		expect(json).toHaveBeenCalledWith({
			message: "User created successfully",
			data: {
				id: 10,
				email: "charlie@example.com",
				tenant_id: 1,
				role: "admin"
			}
		});
		expect(mockInfo).toHaveBeenCalledWith("POST /users - user created", {
			status: 201,
			role: "admin"
		});
	});

	it("createUser returns 500 when persistence fails", async () => {
		mockCreate.mockRejectedValue(new Error("insert failed"));

		const req = { body: { email: "charlie@example.com", tenant_id: 1, role: "admin" } } as Request<
			{},
			CreateUserResponse,
			CreateUserRequestBody
		>;
		const { res, status, json } = createMockResponse<CreateUserResponse>();

		await createUser(req, res);

		expect(status).toHaveBeenCalledWith(500);
		expect(json).toHaveBeenCalledWith({
			message: "Failed to create user",
			data: { id: 0, email: "", tenant_id: 0, role: "" }
		});
		expect(mockError).toHaveBeenCalledWith("POST /users - database insert failed");
	});
});
