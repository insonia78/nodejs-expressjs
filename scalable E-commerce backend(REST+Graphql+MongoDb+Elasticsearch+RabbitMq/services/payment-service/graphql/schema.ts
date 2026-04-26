import { buildSchema } from "graphql";

import { processPayment } from "../services/paymentProcessor";

export const schema = buildSchema(`
  type PaymentResult {
    orderId: String!
    amount: Float!
    currency: String!
    provider: String!
    status: String!
    transactionId: String!
    clientSecret: String
  }

  type Query {
    paymentServiceHealth: String!
  }

  type Mutation {
    processPayment(orderId: String!, amount: Float!, currency: String!): PaymentResult!
  }
`);

export const rootValue = {
	paymentServiceHealth: () => "ok",
	processPayment: ({ orderId, amount, currency }: { orderId: string; amount: number; currency: string }) =>
		processPayment({ orderId, amount, currency })
};