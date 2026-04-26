import { Document, HydratedDocument, Model, Schema, model } from "mongoose";

import { ProductDocumentShape } from "../../../packages/common/src";

export interface ProductDocument extends Document {
	name: string;
	slug: string;
	description: string;
	price: number;
	currency: string;
	category: string;
	tags: string[];
	stock: number;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
	{
		name: { type: String, required: true, trim: true },
		slug: { type: String, required: true, trim: true, unique: true },
		description: { type: String, required: true, trim: true },
		price: { type: Number, required: true, min: 0 },
		currency: { type: String, required: true, default: "USD" },
		category: { type: String, required: true, index: true },
		tags: [{ type: String, trim: true }],
		stock: { type: Number, required: true, min: 0, default: 0 },
		active: { type: Boolean, default: true }
	},
	{ timestamps: true }
);

export const ProductModel: Model<ProductDocument> = model<ProductDocument>("Product", productSchema);

export const mapProductDocument = (product: HydratedDocument<ProductDocument>): ProductDocumentShape => ({
	id: product.id,
	name: product.name,
	slug: product.slug,
	description: product.description,
	price: product.price,
	currency: product.currency,
	category: product.category,
	tags: product.tags,
	stock: product.stock,
	active: product.active,
	createdAt: product.createdAt?.toISOString(),
	updatedAt: product.updatedAt?.toISOString()
});