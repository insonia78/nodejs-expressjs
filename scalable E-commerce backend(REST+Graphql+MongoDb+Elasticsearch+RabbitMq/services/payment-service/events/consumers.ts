import { processPayment } from "../services/paymentProcessor";
import { paymentConfig, paymentEventBus } from "../database/mongoose";

export const registerPaymentConsumers = async (): Promise<void> => {
	await paymentEventBus.subscribe<{ orderId: string; total: number; currency: string }>("order.created", async (event) => {
		if (!paymentConfig.autoCapturePayments) {
			return;
		}

		await processPayment({
			orderId: event.payload.orderId,
			amount: event.payload.total,
			currency: event.payload.currency
		});
	});
};