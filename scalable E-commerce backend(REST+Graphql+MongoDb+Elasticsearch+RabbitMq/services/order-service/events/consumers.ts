import { CartShape } from "../../../packages/common/src";
import { createOrderFromCheckoutCommand, markOrderCancelledCommand, markOrderPaidCommand } from "../commands/createOrder";
import { orderEventBus } from "../database/mongoose";

export const registerOrderConsumers = async (): Promise<void> => {
	await orderEventBus.subscribe<{ userId: string; cart: CartShape }>(
		"cart.checkout.requested",
		async (event) => {
			await createOrderFromCheckoutCommand(event.payload);
		}
	);

	await orderEventBus.subscribe<{ orderId: string; transactionId: string }>("payment.completed", async (event) => {
		await markOrderPaidCommand(event.payload.orderId, event.payload.transactionId);
	});

	await orderEventBus.subscribe<{ orderId: string; reason: string }>("inventory.rejected", async (event) => {
		await markOrderCancelledCommand(event.payload.orderId, event.payload.reason);
	});
};