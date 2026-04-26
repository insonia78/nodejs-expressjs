import app from "./app";
import { connectInventoryDatabase, inventoryConfig, inventoryEventBus } from "./database/mongoose";
import { registerInventoryConsumers } from "./events/consumers";

const start = async (): Promise<void> => {
	await connectInventoryDatabase();
	await inventoryEventBus.connect();
	await registerInventoryConsumers();

	app.listen(inventoryConfig.port, () => {
		console.info(`[inventory] listening on port ${inventoryConfig.port}`);
	});
};

void start().catch((error) => {
	console.error("Failed to start inventory service", error);
	process.exit(1);
});