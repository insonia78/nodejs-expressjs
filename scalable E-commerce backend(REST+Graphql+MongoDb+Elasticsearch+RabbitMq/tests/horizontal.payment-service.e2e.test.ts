import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/payment-service/services/paymentProcessor", () => ({
	processPayment: vi.fn()
}));

import app from "../services/payment-service/app";
import { processPayment } from "../services/payment-service/services/paymentProcessor";

describe("horizontal e2e: payment-service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("processes payments through REST", async () => {
		vi.mocked(processPayment).mockResolvedValue({
			orderId: "o1",
			amount: 199.99,
			currency: "USD",
			provider: "mock",
			status: "succeeded",
			transactionId: "tx_1"
		});

		const response = await request(app).post("/payments/process").send({
			orderId: "o1",
			amount: 199.99,
			currency: "usd"
		});

		expect(response.status).toBe(201);
		expect(response.body.transactionId).toBe("tx_1");
		expect(processPayment).toHaveBeenCalledWith({ orderId: "o1", amount: 199.99, currency: "USD" });
	});

	it("rejects invalid payment payload", async () => {
		const response = await request(app).post("/payments/process").send({
			orderId: "o1",
			amount: 0,
			currency: "USD"
		});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("Validation failed");
	});
});
