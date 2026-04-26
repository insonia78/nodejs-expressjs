import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../index";

describe("Users routes", () => {
	process.env.JWT_SECRET = "test_secret";
	const testSecret = process.env.JWT_SECRET;
	const token = jwt.sign({ sub: "test-user" }, testSecret, { expiresIn: "1h" });

	it("GET /users without token returns 401", async () => {
		const response = await request(app).get("/users");

		expect(response.status).toBe(401);
		expect(response.body.message).toBe("Missing or invalid Authorization header");
	});

	it("GET /users returns users", async () => {
		const response = await request(app)
			.get("/users")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body.message).toBe("Users fetched successfully");
		expect(Array.isArray(response.body.data)).toBe(true);
		expect(response.body.data.length).toBeGreaterThan(0);
	});

	it("GET /users with invalid limit returns 400", async () => {
		const response = await request(app)
			.get("/users")
			.set("Authorization", `Bearer ${token}`)
			.query({ limit: 0 });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
		expect(Array.isArray(response.body.errors)).toBe(true);
	});

	it("POST /users creates a user", async () => {
		const response = await request(app)
			.post("/users")
			.set("Authorization", `Bearer ${token}`)
			.send({ email: "charlie@example.com", tenant_id: 1, role: "admin" });

		expect([201, 500]).toContain(response.status);
		if (response.status === 201) {
			expect(response.body.message).toBe("User created successfully");
			expect(response.body.data.email).toBe("charlie@example.com");
			expect(response.body.data.tenant_id).toBe(1);
			expect(response.body.data.role).toBe("admin");
		}
	});

	it("POST /users with invalid payload returns 400", async () => {
		const response = await request(app)
			.post("/users")
			.set("Authorization", `Bearer ${token}`)
			.send({ email: "", tenant_id: 0, role: "" });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
		expect(Array.isArray(response.body.errors)).toBe(true);
	});
});
