import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import app from "../services/api-gateway/app";

describe("api-gateway api", () => {
	beforeEach(() => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () =>
				new Response(JSON.stringify([{ id: "p1", name: "Studio Headphones" }]), {
					status: 200,
					headers: { "content-type": "application/json" }
				})
			)
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("proxies REST catalog requests", async () => {
		const response = await request(app).get("/api/catalog/products").query({ search: "studio" });

		expect(response.status).toBe(200);
		expect(response.body[0].id).toBe("p1");
		expect(fetch).toHaveBeenCalled();
	});

	it("exposes GraphQL aggregation", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () =>
				new Response(JSON.stringify([{ id: "p1", name: "Studio Headphones", slug: "studio-headphones", description: "Closed-back", price: 199.99, currency: "USD", category: "electronics", tags: ["audio"], stock: 25, active: true }]), {
					status: 200,
					headers: { "content-type": "application/json" }
				})
			)
		);

		const response = await request(app)
			.post("/graphql")
			.send({ query: "query { products(search: \"studio\") { id name } }" });

		expect(response.status).toBe(200);
		expect(response.body.data.products[0].name).toBe("Studio Headphones");
	});
});