import { Request } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	AuthErrorResponse,
	GenerateTokenRequestBody,
	GenerateTokenResponse,
	RefreshTokenRequestBody
} from "../../models/auth";
import { createMockResponse } from "../helpers/httpMocks";

const {
	mockSign,
	mockVerify,
	mockDebug,
	mockInfo,
	mockError
} = vi.hoisted(() => ({
	mockSign: vi.fn(),
	mockVerify: vi.fn(),
	mockDebug: vi.fn(),
	mockInfo: vi.fn(),
	mockError: vi.fn()
}));

vi.mock("jsonwebtoken", () => ({
	default: {
		sign: mockSign,
		verify: mockVerify
	}
}));

vi.mock("../../utils/logger", () => ({
	logger: {
		debug: mockDebug,
		info: mockInfo,
		error: mockError
	}
}));

import { generateToken, refreshToken } from "../../controllers/authController";

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
		mockSign.mockReturnValueOnce("signed-token").mockReturnValueOnce("signed-refresh-token");

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
		expect(mockSign).toHaveBeenCalledWith(
			{ sub: "user-1", type: "refresh" },
			"test-secret",
			{ expiresIn: "7d" }
		);
		expect(status).toHaveBeenCalledWith(200);
		expect(json).toHaveBeenCalledWith({
			message: "Tokens generated successfully",
			token: "signed-token",
			refreshToken: "signed-refresh-token"
		});
		expect(mockInfo).toHaveBeenCalledWith("POST /auth/token - tokens generated", {
			status: 200
		});
	});
});

describe("authController.refreshToken", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		delete process.env.JWT_SECRET;
	});

	it("returns 500 when JWT secret is missing", () => {
		const req = { body: { refreshToken: "refresh-token" } } as Request<
			{},
			GenerateTokenResponse | AuthErrorResponse,
			RefreshTokenRequestBody
		>;
		const { res, status, json } = createMockResponse<
			GenerateTokenResponse | AuthErrorResponse
		>();

		refreshToken(req, res);

		expect(status).toHaveBeenCalledWith(500);
		expect(json).toHaveBeenCalledWith({ message: "JWT_SECRET is not configured" });
		expect(mockError).toHaveBeenCalledWith("POST /auth/refresh - JWT_SECRET not configured");
		expect(mockVerify).not.toHaveBeenCalled();
	});

	it("returns 401 when refresh token verification fails", () => {
		process.env.JWT_SECRET = "test-secret";
		mockVerify.mockImplementation(() => {
			throw new Error("invalid token");
		});

		const req = { body: { refreshToken: "bad-refresh-token" } } as Request<
			{},
			GenerateTokenResponse | AuthErrorResponse,
			RefreshTokenRequestBody
		>;
		const { res, status, json } = createMockResponse<
			GenerateTokenResponse | AuthErrorResponse
		>();

		refreshToken(req, res);

		expect(mockVerify).toHaveBeenCalledWith("bad-refresh-token", "test-secret");
		expect(status).toHaveBeenCalledWith(401);
		expect(json).toHaveBeenCalledWith({ message: "Invalid refresh token" });
	});

	it("returns new tokens when refresh token is valid", () => {
		process.env.JWT_SECRET = "test-secret";
		mockVerify.mockReturnValue({ sub: "user-1", type: "refresh" });
		mockSign.mockReturnValueOnce("new-access-token").mockReturnValueOnce("new-refresh-token");

		const req = { body: { refreshToken: "valid-refresh-token" } } as Request<
			{},
			GenerateTokenResponse | AuthErrorResponse,
			RefreshTokenRequestBody
		>;
		const { res, status, json } = createMockResponse<
			GenerateTokenResponse | AuthErrorResponse
		>();

		refreshToken(req, res);

		expect(mockVerify).toHaveBeenCalledWith("valid-refresh-token", "test-secret");
		expect(mockSign).toHaveBeenCalledWith(
			{ sub: "user-1" },
			"test-secret",
			{ expiresIn: "1h" }
		);
		expect(mockSign).toHaveBeenCalledWith(
			{ sub: "user-1", type: "refresh" },
			"test-secret",
			{ expiresIn: "7d" }
		);
		expect(status).toHaveBeenCalledWith(200);
		expect(json).toHaveBeenCalledWith({
			message: "Token refreshed successfully",
			token: "new-access-token",
			refreshToken: "new-refresh-token"
		});
		expect(mockInfo).toHaveBeenCalledWith("POST /auth/refresh - token refreshed", {
			status: 200
		});
	});
});
