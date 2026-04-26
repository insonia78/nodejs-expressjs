import { connectMongo, EventBus, getServiceConfig } from "../../../packages/common/src";

export const catalogConfig = getServiceConfig("catalog", 4001);
export const catalogEventBus = new EventBus("catalog", catalogConfig.rabbitMqUrl);

export const connectCatalogDatabase = async (): Promise<void> => {
	await connectMongo(catalogConfig, "catalog_service");
};