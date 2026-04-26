import app from "./app";
import { connectPaymentDatabase, paymentConfig, paymentEventBus } from "./database/mongoose";
import { registerPaymentConsumers } from "./events/consumers";

const start = async (): Promise<void> => {
	await connectPaymentDatabase();
	await paymentEventBus.connect();
	await registerPaymentConsumers();

	app.listen(paymentConfig.port, () => {
		console.info(`[payments] listening on port ${paymentConfig.port}`);
	});
};

void start().catch((error) => {
	console.error("Failed to start payment service", error);
	process.exit(1);
});