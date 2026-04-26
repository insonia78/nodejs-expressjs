import { CartShape, OrderShape, OrderStatus, PaymentStatus } from "../../../packages/common/src";
import { orderEventBus } from "../database/mongoose";
import { mapOrderDocument, OrderModel } from "../models/Order";

export const createOrderFromCheckoutCommand = async (payload: {
	userId: string;
	cart: CartShape;
}): Promise<OrderShape> => {
	const order = await OrderModel.create({
		userId: payload.userId,
		status: OrderStatus.PENDING,
		paymentStatus: PaymentStatus.AWAITING,
		items: payload.cart.items,
		total: payload.cart.subtotal,
		currency: payload.cart.currency
	});

	const mapped = mapOrderDocument(order);
	await orderEventBus.publish("order.created", {
		orderId: mapped.id,
		userId: mapped.userId,
		items: mapped.items,
		total: mapped.total,
		currency: mapped.currency
	});
	return mapped;
};

export const updateOrderStatusCommand = async (
	orderId: string,
	status: OrderStatus
): Promise<OrderShape | null> => {
	const order = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true });
	return order ? mapOrderDocument(order) : null;
};

export const markOrderPaidCommand = async (
	orderId: string,
	transactionId: string
): Promise<OrderShape | null> => {
	const order = await OrderModel.findByIdAndUpdate(
		orderId,
		{ paymentStatus: PaymentStatus.PAID, paymentTransactionId: transactionId },
		{ new: true }
	);
	return order ? mapOrderDocument(order) : null;
};

export const markOrderCancelledCommand = async (orderId: string, reason: string): Promise<OrderShape | null> => {
	const order = await OrderModel.findByIdAndUpdate(
		orderId,
		{ status: OrderStatus.CANCELLED, paymentStatus: PaymentStatus.FAILED, cancelReason: reason },
		{ new: true }
	);
	return order ? mapOrderDocument(order) : null;
};