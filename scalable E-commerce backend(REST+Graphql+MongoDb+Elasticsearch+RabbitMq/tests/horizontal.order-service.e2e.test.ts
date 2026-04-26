import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OrderStatus, PaymentStatus } from "../packages/common/src";

vi.mock("../services/order-service/queries/searchOrders", () => ({
	listOrdersQuery: vi.fn(),
	getOrderByIdQuery: vi.fn()
}));

vi.mock("../services/order-service/commands/createOrder", () => ({
	updateOrderStatusCommand: vi.fn(),
	createOrderFromCheckoutCommand: vi.fn(),
	markOrderPaidCommand: vi.fn(),
	markOrderCancelledCommand: vi.fn()
}));

import app from "../services/order-service/app";
import { updateOrderStatusCommand } from "../services/order-service/commands/createOrder";
import { listOrdersQuery } from "../services/order-service/queries/searchOrders";

describe("horizontal e2e: order-service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists orders with filters", async () => {
		vi.mocked(listOrdersQuery).mockResolvedValue([
			{
				id: "o1",
				userId: "u1",
				status: OrderStatus.PENDING,
				paymentStatus: PaymentStatus.AWAITING,
				items: [],
				total: 199.99,
				currency: "USD"
			}
		]);

		const response = await request(app).get("/orders").query({ userId: "u1", status: "pending" });

		expect(response.status).toBe(200);
		expect(response.body[0].id).toBe("o1");
		expect(listOrdersQuery).toHaveBeenCalledWith({ userId: "u1", status: "pending" });
	});

	it("updates order status", async () => {
		vi.mocked(updateOrderStatusCommand).mockResolvedValue({
			id: "o1",
			userId: "u1",
			status: "shipped",
			paymentStatus: "paid",
			items: [],
			total: 199.99,
			currency: "USD"
		} as never);

		const response = await request(app).patch("/orders/o1/status").send({ status: "shipped" });

		expect(response.status).toBe(200);
		expect(response.body.status).toBe("shipped");
	});

	it("rejects invalid order status", async () => {
		const response = await request(app).patch("/orders/o1/status").send({ status: "unknown" });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
	});
});
