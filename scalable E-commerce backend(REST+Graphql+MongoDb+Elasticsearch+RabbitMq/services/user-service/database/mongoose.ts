import { connectMongo, getServiceConfig } from "../../../packages/common/src";

export const userConfig = getServiceConfig("users", 4006);

export const connectUserDatabase = async (): Promise<void> => {
	await connectMongo(userConfig, "user_service");
};