import { buildSchema } from "graphql";

import { InventoryModel, mapInventoryDocument } from "../models/InventoryItem";

export const schema = buildSchema(`
  type Inventory {
    productId: String!
    sku: String!
    available: Int!
    reserved: Int!
    reorderThreshold: Int!
    updatedAt: String
  }

  type Query {
    inventories: [Inventory!]!
    inventory(productId: String!): Inventory
  }

  type Mutation {
    upsertInventory(productId: String!, sku: String!, available: Int!, reserved: Int, reorderThreshold: Int): Inventory!
  }
`);

export const rootValue = {
	inventories: async () => (await InventoryModel.find()).map((record) => mapInventoryDocument(record)),
	inventory: async ({ productId }: { productId: string }) => {
		const record = await InventoryModel.findOne({ productId });
		return record ? mapInventoryDocument(record) : null;
	},
	upsertInventory: async ({ productId, sku, available, reserved, reorderThreshold }: { productId: string; sku: string; available: number; reserved?: number; reorderThreshold?: number }) => {
		const record = await InventoryModel.findOneAndUpdate(
			{ productId },
			{ productId, sku, available, reserved: reserved ?? 0, reorderThreshold: reorderThreshold ?? 5 },
			{ upsert: true, new: true, runValidators: true }
		);
		return mapInventoryDocument(record);
	}
};