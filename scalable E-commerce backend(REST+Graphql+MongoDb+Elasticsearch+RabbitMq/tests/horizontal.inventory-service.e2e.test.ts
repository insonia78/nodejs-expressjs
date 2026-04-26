import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/inventory-service/models/InventoryItem", () => ({
	InventoryModel: {
		find: vi.fn(),
		findOne: vi.fn(),
		findOneAndUpdate: vi.fn()
	},
	mapInventoryDocument: vi.fn((record: unknown) => record)
}));

import app from "../services/inventory-service/app";
import { InventoryModel } from "../services/inventory-service/models/InventoryItem";

describe("horizontal e2e: inventory-service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("gets inventory by product id", async () => {
		vi.mocked(InventoryModel.findOne).mockResolvedValue({
			productId: "p1",
			sku: "studio-headphones",
			available: 10,
			reserved: 1,
			reorderThreshold: 5,
			updatedAt: new Date().toISOString()
		} as never);

		const response = await request(app).get("/inventory/p1");

		expect(response.status).toBe(200);
		expect(response.body.productId).toBe("p1");
	});

	it("rejects invalid inventory payload", async () => {
		const response = await request(app).post("/inventory").send({
			productId: "p1",
			sku: "studio-headphones",
			available: -1
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
	});
});
