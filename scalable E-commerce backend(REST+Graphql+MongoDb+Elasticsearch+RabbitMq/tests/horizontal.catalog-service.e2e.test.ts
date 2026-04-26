import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/catalog-service/queries/searchProducts", () => ({
	listProductsQuery: vi.fn(),
	getProductByIdQuery: vi.fn()
}));

vi.mock("../services/catalog-service/commands/createProduct", () => ({
	createProductCommand: vi.fn(),
	updateProductCommand: vi.fn(),
	deleteProductCommand: vi.fn()
}));

import app from "../services/catalog-service/app";
import { listProductsQuery } from "../services/catalog-service/queries/searchProducts";

describe("horizontal e2e: catalog-service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists products with filters through REST", async () => {
		vi.mocked(listProductsQuery).mockResolvedValue([
			{
				id: "p1",
				name: "Studio Headphones",
				slug: "studio-headphones",
				description: "Closed-back",
				price: 199.99,
				currency: "USD",
				category: "electronics",
				tags: ["audio"],
				stock: 25,
				active: true
			}
		]);

		const response = await request(app)
			.get("/products")
			.query({ category: "electronics", search: "studio"});

		expect(response.status).toBe(200);
		expect(response.body[0].slug).toBe("studio-headphones");
		expect(listProductsQuery).toHaveBeenCalledWith({
			category: "electronics",
			search: "studio",
			minPrice: undefined,
			maxPrice: undefined,
			active: undefined
		});
	});

	it("rejects invalid create payloads", async () => {
		const response = await request(app).post("/products").send({
			name: "Invalid Product",
			slug: "Invalid Slug",
			description: "Bad slug",
			price: 10,
			category: "misc"
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
	});
});
