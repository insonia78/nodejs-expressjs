import { Request } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthErrorResponse, GenerateTokenRequestBody, GenerateTokenResponse } from "../../models/auth";
import { createMockResponse } from "../helpers/httpMocks";

const {
	mockSign,
	mockDebug,
	mockInfo,
	mockError
} = vi.hoisted(() => ({
	mockSign: vi.fn(),
	mockDebug: vi.fn(),
	mockInfo: vi.fn(),
	mockError: vi.fn()
}));

vi.mock("jsonwebtoken", () => ({
	default: {
		sign: mockSign
	}
}));

vi.mock("../../utils/logger", () => ({
	logger: {
		debug: mockDebug,
		info: mockInfo,
		error: mockError
	}
}));

import { generateToken } from "../../controllers/authController";

describe("authController.generateToken", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		delete process.env.JWT_SECRET;
	});

	it("returns 500 when JWT secret is missing", () => {
		const req = { body: { userId: "user-1" } } as Request<
			{},
			GenerateTokenResponse | AuthErrorResponse,
			GenerateTokenRequestBody
		>;
		const { res, status, json } = createMockResponse<
			GenerateTokenResponse | AuthErrorResponse
		>();

		generateToken(req, res);

		expect(status).toHaveBeenCalledWith(500);
		expect(json).toHaveBeenCalledWith({ message: "JWT_SECRET is not configured" });
		expect(mockError).toHaveBeenCalledWith("POST /auth/token - JWT_SECRET not configured");
		expect(mockSign).not.toHaveBeenCalled();
	});

	it("returns a signed token when JWT secret exists", () => {
		process.env.JWT_SECRET = "test-secret";
		mockSign.mockReturnValue("signed-token");

		const req = { body: { userId: "user-1" } } as Request<
			{},
			GenerateTokenResponse | AuthErrorResponse,
			GenerateTokenRequestBody
		>;
		const { res, status, json } = createMockResponse<
			GenerateTokenResponse | AuthErrorResponse
		>();

		generateToken(req, res);

		expect(mockSign).toHaveBeenCalledWith(
			{ sub: "user-1" },
			"test-secret",
			{ expiresIn: "1h" }
		);
		expect(status).toHaveBeenCalledWith(200);
		expect(json).toHaveBeenCalledWith({
			message: "Token generated successfully",
			token: "signed-token"
		});
		expect(mockInfo).toHaveBeenCalledWith("POST /auth/token - token generated", {
			status: 200
		});
	});
});
