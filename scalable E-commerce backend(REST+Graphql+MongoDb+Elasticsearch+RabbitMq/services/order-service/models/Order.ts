import { Document, HydratedDocument, Model, Schema, model } from "mongoose";

import { CartItemShape, OrderShape, OrderStatus, PaymentStatus } from "../../../packages/common/src";

export interface OrderDocument extends Document {
	userId: string;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	items: CartItemShape[];
	total: number;
	currency: string;
	paymentTransactionId?: string;
	cancelReason?: string;
	createdAt: Date;
	updatedAt: Date;
}

const cartItemSchema = new Schema<CartItemShape>(
	{
		productId: { type: String, required: true },
		name: { type: String, required: true },
		price: { type: Number, required: true },
		currency: { type: String, required: true },
		quantity: { type: Number, required: true },
		sku: { type: String }
	},
	{ _id: false }
);

const orderSchema = new Schema<OrderDocument>(
	{
		userId: { type: String, required: true, index: true },
		status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
		paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.AWAITING },
		items: { type: [cartItemSchema], default: [] },
		total: { type: Number, required: true, min: 0 },
		currency: { type: String, required: true },
		paymentTransactionId: { type: String },
		cancelReason: { type: String }
	},
	{ timestamps: true }
);

export const OrderModel: Model<OrderDocument> = model<OrderDocument>("Order", orderSchema);

export const mapOrderDocument = (order: HydratedDocument<OrderDocument>): OrderShape => ({
	id: order.id,
	userId: order.userId,
	status: order.status,
	paymentStatus: order.paymentStatus,
	items: order.items,
	total: order.total,
	currency: order.currency,
	createdAt: order.createdAt?.toISOString(),
	updatedAt: order.updatedAt?.toISOString()
});