import app from "./app";
import { connectOrderDatabase, orderConfig, orderEventBus } from "./database/mongoose";
import { registerOrderConsumers } from "./events/consumers";

const start = async (): Promise<void> => {
	await connectOrderDatabase();
	await orderEventBus.connect();
	await registerOrderConsumers();

	app.listen(orderConfig.port, () => {
		console.info(`[orders] listening on port ${orderConfig.port}`);
	});
};

void start().catch((error) => {
	console.error("Failed to start order service", error);
	process.exit(1);
});