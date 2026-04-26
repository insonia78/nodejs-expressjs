import { Document, HydratedDocument, Model, Schema, model } from "mongoose";

import { PaymentResultShape } from "../../../packages/common/src";

export interface PaymentDocument extends Document {
	orderId: string;
	amount: number;
	currency: string;
	provider: "mock" | "stripe";
	status: "succeeded" | "failed";
	transactionId: string;
	clientSecret?: string;
	createdAt: Date;
	updatedAt: Date;
}

const paymentSchema = new Schema<PaymentDocument>(
	{
		orderId: { type: String, required: true, index: true },
		amount: { type: Number, required: true, min: 0 },
		currency: { type: String, required: true },
		provider: { type: String, enum: ["mock", "stripe"], required: true },
		status: { type: String, enum: ["succeeded", "failed"], required: true },
		transactionId: { type: String, required: true },
		clientSecret: { type: String }
	},
	{ timestamps: true }
);

export const PaymentModel: Model<PaymentDocument> = model<PaymentDocument>("Payment", paymentSchema);

export const mapPaymentDocument = (payment: HydratedDocument<PaymentDocument>): PaymentResultShape => ({
	orderId: payment.orderId,
	amount: payment.amount,
	currency: payment.currency,
	provider: payment.provider,
	status: payment.status,
	transactionId: payment.transactionId,
	clientSecret: payment.clientSecret
});