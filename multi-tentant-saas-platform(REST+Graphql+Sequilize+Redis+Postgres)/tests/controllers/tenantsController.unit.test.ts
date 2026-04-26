import { Request } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateTenantRequestBody, CreateTenantResponse } from "../../models/tenants";
import { createMockResponse } from "../helpers/httpMocks";

const {
	mockCreate,
	mockDebug,
	mockInfo,
	mockError
} = vi.hoisted(() => ({
	mockCreate: vi.fn(),
	mockDebug: vi.fn(),
	mockInfo: vi.fn(),
	mockError: vi.fn()
}));

vi.mock("../../database/models", () => ({
	Tenant: {
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

import { createTenant } from "../../controllers/tenantsController";

describe("tenantsController.createTenant", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("creates a tenant and returns the saved payload", async () => {
		mockCreate.mockResolvedValue({ id: 4, name: "Acme", plan: "pro" });

		const req = { body: { id: 4, name: "Acme", plan: "pro" } } as Request<
			{},
			CreateTenantResponse,
			CreateTenantRequestBody
		>;
		const { res, status, json } = createMockResponse<CreateTenantResponse>();

		await createTenant(req, res);

		expect(mockCreate).toHaveBeenCalledWith({ id: 4, name: "Acme", plan: "pro" });
		expect(status).toHaveBeenCalledWith(201);
		expect(json).toHaveBeenCalledWith({
			message: "Tenant created successfully",
			data: { id: 4, name: "Acme", plan: "pro" }
		});
		expect(mockInfo).toHaveBeenCalledWith("POST /tenants - tenant created", {
			status: 201,
			plan: "pro"
		});
	});

	it("returns 500 when tenant creation fails", async () => {
		mockCreate.mockRejectedValue(new Error("insert failed"));

		const req = { body: { id: 4, name: "Acme", plan: "pro" } } as Request<
			{},
			CreateTenantResponse,
			CreateTenantRequestBody
		>;
		const { res, status, json } = createMockResponse<CreateTenantResponse>();

		await createTenant(req, res);

		expect(status).toHaveBeenCalledWith(500);
		expect(json).toHaveBeenCalledWith({
			message: "Failed to create tenant",
			data: { id: 0, name: "", plan: "" }
		});
		expect(mockError).toHaveBeenCalledWith("POST /tenants - database insert failed");
	});
});