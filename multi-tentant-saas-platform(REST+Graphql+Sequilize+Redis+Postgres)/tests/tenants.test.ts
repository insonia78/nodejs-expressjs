import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../index";

describe("Tenants routes", () => {
	process.env.JWT_SECRET = "test_secret";
	const testSecret = process.env.JWT_SECRET;
	const token = jwt.sign({ sub: "test-user" }, testSecret, { expiresIn: "1h" });

	it("POST /tenants without token returns 401", async () => {
		const response = await request(app).post("/tenants").send({
			id: 1,
			name: "Acme",
			plan: "pro"
		});

		expect(response.status).toBe(401);
		expect(response.body.message).toBe("Missing or invalid Authorization header");
	});

	it("POST /tenants creates a tenant", async () => {
		const response = await request(app)
			.post("/tenants")
			.set("Authorization", `Bearer ${token}`)
			.send({ id: 1, name: "Acme", plan: "pro" });

		expect(response.status).toBe(201);
		expect(response.body.message).toBe("Tenant created successfully");
		expect(response.body.data).toEqual({ id: 1, name: "Acme", plan: "pro" });
	});

	it("POST /tenants with invalid body returns 400", async () => {
		const response = await request(app)
			.post("/tenants")
			.set("Authorization", `Bearer ${token}`)
			.send({ id: 0, name: "", plan: "" });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
		expect(Array.isArray(response.body.errors)).toBe(true);
	});
});