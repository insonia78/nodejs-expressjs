import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/user-service/services/authService", () => ({
	registerUser: vi.fn(),
	loginUser: vi.fn(),
	listUsers: vi.fn(),
	getUserById: vi.fn()
}));

import app from "../services/user-service/app";
import { getUserById, listUsers, loginUser, registerUser } from "../services/user-service/services/authService";

describe("user-service api", () => {
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
		expect(registerUser).toHaveBeenCalledWith({
			name: "Ada",
			email: "ada@example.com",
			password: "secret123"
		});
	});

	it("returns users through REST", async () => {
		vi.mocked(listUsers).mockResolvedValue([
			{ id: "u1", name: "Ada", email: "ada@example.com", role: "customer" }
		]);

		const response = await request(app).get("/users");

		expect(response.status).toBe(200);
		expect(response.body).toHaveLength(1);
		expect(response.body[0].email).toBe("ada@example.com");
	});

	it("logs in through GraphQL", async () => {
		vi.mocked(loginUser).mockResolvedValue({
			user: { id: "u1", name: "Ada", email: "ada@example.com", role: "customer" },
			token: "jwt-abc"
		});

		const response = await request(app)
			.post("/graphql")
			.send({ query: "mutation { login(email: \"ada@example.com\", password: \"secret123\") { token user { email } } }" });

		expect(response.status).toBe(200);
		expect(response.body.data.login.token).toBe("jwt-abc");
		expect(response.body.data.login.user.email).toBe("ada@example.com");
	});

	it("returns 404 for missing user", async () => {
		vi.mocked(getUserById).mockResolvedValue(null);

		const response = await request(app).get("/users/missing");

		expect(response.status).toBe(404);
	});
});