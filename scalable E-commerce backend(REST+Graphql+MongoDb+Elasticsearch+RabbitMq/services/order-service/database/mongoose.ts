import { connectMongo, EventBus, getServiceConfig } from "../../../packages/common/src";

export const orderConfig = getServiceConfig("orders", 4003);
export const orderEventBus = new EventBus("orders", orderConfig.rabbitMqUrl);

export const connectOrderDatabase = async (): Promise<void> => {
	await connectMongo(orderConfig, "order_service");
};