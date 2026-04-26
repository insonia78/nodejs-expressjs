import { FilterQuery } from "mongoose";

import { OrderShape, OrderStatus } from "../../../packages/common/src";
import { mapOrderDocument, OrderDocument, OrderModel } from "../models/Order";

export const listOrdersQuery = async (filter: { userId?: string; status?: OrderStatus | string } = {}): Promise<OrderShape[]> => {
	const query: FilterQuery<OrderDocument> = {};

	if (filter.userId) {
		query.userId = filter.userId;
	}

	if (filter.status) {
		query.status = filter.status as OrderStatus;
	}

	const orders = await OrderModel.find(query).sort({ createdAt: -1 });
	return orders.map((order) => mapOrderDocument(order));
};

export const getOrderByIdQuery = async (orderId: string): Promise<OrderShape | null> => {
	const order = await OrderModel.findById(orderId);
	return order ? mapOrderDocument(order) : null;
};