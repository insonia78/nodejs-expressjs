import { connectMongo, EventBus, getServiceConfig } from "../../../packages/common/src";

export const inventoryConfig = getServiceConfig("inventory", 4005);
export const inventoryEventBus = new EventBus("inventory", inventoryConfig.rabbitMqUrl);

export const connectInventoryDatabase = async (): Promise<void> => {
	await connectMongo(inventoryConfig, "inventory_service");
};