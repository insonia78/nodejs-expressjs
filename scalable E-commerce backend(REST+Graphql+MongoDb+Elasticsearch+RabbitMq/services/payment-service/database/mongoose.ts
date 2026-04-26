import { connectMongo, EventBus, getServiceConfig } from "../../../packages/common/src";

export const paymentConfig = getServiceConfig("payments", 4004);
export const paymentEventBus = new EventBus("payments", paymentConfig.rabbitMqUrl);

export const connectPaymentDatabase = async (): Promise<void> => {
	await connectMongo(paymentConfig, "payment_service");
};