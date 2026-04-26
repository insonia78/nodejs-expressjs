import { inventoryEventBus } from "../database/mongoose";
import { InventoryModel } from "../models/InventoryItem";

export const registerInventoryConsumers = async (): Promise<void> => {
	await inventoryEventBus.subscribe<{ id: string; slug: string; stock: number }>("catalog.product.upserted", async (event) => {
		await InventoryModel.findOneAndUpdate(
			{ productId: event.payload.id },
			{
				productId: event.payload.id,
				sku: event.payload.slug,
				available: event.payload.stock,
				$setOnInsert: { reserved: 0, reorderThreshold: 5 }
			},
			{ upsert: true, new: true }
		);
	});

	await inventoryEventBus.subscribe<{
		orderId: string;
		items: Array<{ productId: string; quantity: number }>;
	}>("order.created", async (event) => {
		for (const item of event.payload.items) {
			const inventory = await InventoryModel.findOne({ productId: item.productId });
			if (!inventory || inventory.available < item.quantity) {
				await inventoryEventBus.publish("inventory.rejected", {
					orderId: event.payload.orderId,
					reason: `Insufficient inventory for product ${item.productId}`
				});
				return;
			}
		}

		for (const item of event.payload.items) {
			await InventoryModel.findOneAndUpdate(
				{ productId: item.productId },
				{ $inc: { available: -item.quantity, reserved: item.quantity } },
				{ new: true }
			);
		}
	});
};