import Stripe from "stripe";

import { PaymentResultShape } from "../../../packages/common/src";
import { paymentConfig, paymentEventBus } from "../database/mongoose";
import { mapPaymentDocument, PaymentModel } from "../models/Payment";

const stripeClient = paymentConfig.useStripe && paymentConfig.stripeSecretKey
	? new Stripe(paymentConfig.stripeSecretKey)
	: undefined;

export const processPayment = async (input: {
	orderId: string;
	amount: number;
	currency: string;
}): Promise<PaymentResultShape> => {
	if (stripeClient) {
		const intent = await stripeClient.paymentIntents.create({
			amount: Math.round(input.amount * 100),
			currency: input.currency.toLowerCase(),
			automatic_payment_methods: { enabled: true }
		});

		const payment = await PaymentModel.create({
			orderId: input.orderId,
			amount: input.amount,
			currency: input.currency,
			provider: "stripe",
			status: "succeeded",
			transactionId: intent.id,
			clientSecret: intent.client_secret ?? undefined
		});

		const mapped = mapPaymentDocument(payment);
		await paymentEventBus.publish("payment.completed", mapped);
		return mapped;
	}

	const payment = await PaymentModel.create({
		orderId: input.orderId,
		amount: input.amount,
		currency: input.currency,
		provider: "mock",
		status: "succeeded",
		transactionId: `mock_${Date.now()}`
	});

	const mapped = mapPaymentDocument(payment);
	await paymentEventBus.publish("payment.completed", mapped);
	return mapped;
};