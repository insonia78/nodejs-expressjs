import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import app from "../services/api-gateway/app";

describe("horizontal e2e: api-gateway", () => {
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

	it("proxies catalog requests through /api", async () => {
		const response = await request(app).get("/api/catalog/products").query({ search: "studio" });

		expect(response.status).toBe(200);
		expect(response.body[0].id).toBe("p1");
		expect(fetch).toHaveBeenCalledTimes(1);
	});
});
