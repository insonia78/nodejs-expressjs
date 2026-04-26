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
import { createProductCommand } from "../services/catalog-service/commands/createProduct";
import { listProductsQuery } from "../services/catalog-service/queries/searchProducts";

describe("catalog-service api", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists products through REST filters", async () => {
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

		const response = await request(app).get("/products").query({ category: "electronics", search: "studio" });

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

	it("creates a product through GraphQL", async () => {
		vi.mocked(createProductCommand).mockResolvedValue({
			id: "p2",
			name: "Travel Backpack",
			slug: "travel-backpack",
			description: "Weatherproof",
			price: 89,
			currency: "USD",
			category: "lifestyle",
			tags: ["travel"],
			stock: 18,
			active: true
		});

		const response = await request(app)
			.post("/graphql")
			.send({
				query: "mutation { createProduct(input: { name: \"Travel Backpack\", slug: \"travel-backpack\", description: \"Weatherproof\", price: 89, category: \"lifestyle\", tags: [\"travel\"], stock: 18, active: true }) { id slug } }"
			});

		expect(response.status).toBe(200);
		expect(response.body.data.createProduct.id).toBe("p2");
		expect(createProductCommand).toHaveBeenCalled();
	});
});