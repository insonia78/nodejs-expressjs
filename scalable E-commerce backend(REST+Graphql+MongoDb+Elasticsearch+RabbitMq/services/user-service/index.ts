import app from "./app";
import { connectUserDatabase, userConfig } from "./database/mongoose";

const start = async (): Promise<void> => {
	await connectUserDatabase();

	app.listen(userConfig.port, () => {
		console.info(`[users] listening on port ${userConfig.port}`);
	});
};

void start().catch((error) => {
	console.error("Failed to start user service", error);
	process.exit(1);
});