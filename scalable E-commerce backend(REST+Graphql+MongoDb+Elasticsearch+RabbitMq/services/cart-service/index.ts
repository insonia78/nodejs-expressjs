import app from "./app";
import { cartConfig, cartEventBus, cartStore } from "./services/cartStore";

const start = async (): Promise<void> => {
	await cartStore.connect();
	await cartEventBus.connect();

	app.listen(cartConfig.port, () => {
		console.info(`[cart] listening on port ${cartConfig.port}`);
	});
};

void start().catch((error) => {
	console.error("Failed to start cart service", error);
	process.exit(1);
});