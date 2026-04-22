import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../index";

describe("GraphQL routes", () => {
	process.env.JWT_SECRET = "test_secret";
	const testSecret = process.env.JWT_SECRET;
	const token = jwt.sign({ sub: "test-user" }, testSecret, { expiresIn: "1h" });

	it("POST /graphql without token returns 401", async () => {
		const response = await request(app).post("/graphql").send({
			query: "{ users { id email tenant_id role } }"
		});

		expect(response.status).toBe(401);
		expect(response.body.message).toBe("Missing or invalid Authorization header");
	});

	it("POST /graphql returns limited users", async () => {
		const response = await request(app)
			.post("/graphql")
			.set("Authorization", `Bearer ${token}`)
			.send({ query: "query { users(limit: 1) { id email tenant_id role } }" });

		expect(response.status).toBe(200);
		expect(response.body.data.users).toEqual([
			{ id: 1, email: "alice@example.com", tenant_id: 1, role: "admin" }
		]);
	});

	it("POST /graphql returns tenant stats", async () => {
		const response = await request(app)
			.post("/graphql")
			.set("Authorization", `Bearer ${token}`)
			.send({ query: "query { tenantStats { totalTenants totalUsers } }" });

		expect(response.status).toBe(200);
		expect(response.body.data.tenantStats.totalTenants).toBeGreaterThan(0);
		expect(response.body.data.tenantStats.totalUsers).toBeGreaterThan(0);
	});
});
