import { buildSchema } from "graphql";

import { OrderStatus } from "../../../packages/common/src";
import { updateOrderStatusCommand } from "../commands/createOrder";
import { getOrderByIdQuery, listOrdersQuery } from "../queries/searchOrders";

export const schema = buildSchema(`
  type CartItem {
    productId: String!
    name: String!
    price: Float!
    currency: String!
    quantity: Int!
    sku: String
  }

  type Order {
    id: ID!
    userId: String!
    status: String!
    paymentStatus: String!
    items: [CartItem!]!
    total: Float!
    currency: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    orders(userId: String, status: String): [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    updateOrderStatus(id: ID!, status: String!): Order
  }
`);

export const rootValue = {
	orders: listOrdersQuery,
	order: ({ id }: { id: string }) => getOrderByIdQuery(id),
	updateOrderStatus: ({ id, status }: { id: string; status: string }) => updateOrderStatusCommand(id, status as OrderStatus)
};