import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/cart-service/services/cartStore", () => ({
	cartStore: {
		getCart: vi.fn(),
		addItem: vi.fn(),
		updateItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn()
	},
	getCatalogProductUrl: vi.fn()
}));

vi.mock("../services/cart-service/services/checkout", () => ({
	checkoutCart: vi.fn()
}));

import app from "../services/cart-service/app";
import { cartStore } from "../services/cart-service/services/cartStore";
import { checkoutCart } from "../services/cart-service/services/checkout";

describe("horizontal e2e: cart-service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns cart by user id", async () => {
		vi.mocked(cartStore.getCart).mockResolvedValue({
			userId: "u1",
			items: [],
			subtotal: 0,
			currency: "USD",
			updatedAt: new Date().toISOString()
		});

		const response = await request(app).get("/cart").query({ userId: "u1" });

		expect(response.status).toBe(200);
		expect(response.body.userId).toBe("u1");
		expect(cartStore.getCart).toHaveBeenCalledWith("u1");
	});

	it("checks out cart through REST", async () => {
		vi.mocked(checkoutCart).mockResolvedValue({ total: 199.99, currency: "USD" });

		const response = await request(app).post("/cart/checkout").send({ userId: "u1" });

		expect(response.status).toBe(202);
		expect(response.body.message).toBe("Checkout accepted");
		expect(checkoutCart).toHaveBeenCalledWith("u1");
	});

	it("rejects invalid cart query", async () => {
		const response = await request(app).get("/cart").query({ userId: "" });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
	});
});
