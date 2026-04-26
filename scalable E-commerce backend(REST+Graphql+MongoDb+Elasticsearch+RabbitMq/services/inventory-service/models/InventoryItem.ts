import { Document, HydratedDocument, Model, Schema, model } from "mongoose";

import { InventoryShape } from "../../../packages/common/src";

export interface InventoryDocument extends Document {
	productId: string;
	sku: string;
	available: number;
	reserved: number;
	reorderThreshold: number;
	createdAt: Date;
	updatedAt: Date;
}

const inventorySchema = new Schema<InventoryDocument>(
	{
		productId: { type: String, required: true, unique: true, index: true },
		sku: { type: String, required: true },
		available: { type: Number, required: true, min: 0, default: 0 },
		reserved: { type: Number, required: true, min: 0, default: 0 },
		reorderThreshold: { type: Number, required: true, min: 0, default: 5 }
	},
	{ timestamps: true }
);

export const InventoryModel: Model<InventoryDocument> = model<InventoryDocument>("InventoryItem", inventorySchema);

export const mapInventoryDocument = (item: HydratedDocument<InventoryDocument>): InventoryShape => ({
	productId: item.productId,
	sku: item.sku,
	available: item.available,
	reserved: item.reserved,
	reorderThreshold: item.reorderThreshold,
	updatedAt: item.updatedAt?.toISOString()
});