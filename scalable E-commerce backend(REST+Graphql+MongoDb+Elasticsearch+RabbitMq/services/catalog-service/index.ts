import app from "./app";
import { catalogConfig, catalogEventBus, connectCatalogDatabase } from "./database/mongoose";

const start = async (): Promise<void> => {
	await connectCatalogDatabase();
	await catalogEventBus.connect();

	app.listen(catalogConfig.port, () => {
		console.info(`[catalog] listening on port ${catalogConfig.port}`);
	});
};

void start().catch((error) => {
	console.error("Failed to start catalog service", error);
	process.exit(1);
});