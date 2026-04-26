import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/user-service/services/authService", () => ({
	registerUser: vi.fn(),
	loginUser: vi.fn(),
	listUsers: vi.fn(),
	getUserById: vi.fn()
}));

import app from "../services/user-service/app";
import { registerUser } from "../services/user-service/services/authService";

describe("horizontal e2e: user-service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("registers a user through REST", async () => {
		vi.mocked(registerUser).mockResolvedValue({
			user: { id: "u1", name: "Ada", email: "ada@example.com", role: "customer" },
			token: "token-123"
		});

		const response = await request(app).post("/auth/register").send({
			name: "Ada",
			email: "ada@example.com",
			password: "secret123"
		});

		expect(response.status).toBe(201);
		expect(response.body.token).toBe("token-123");
	});

	it("rejects invalid login payload", async () => {
		const response = await request(app).post("/auth/login").send({
			email: "bad-email",
			password: ""
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
	});
});
