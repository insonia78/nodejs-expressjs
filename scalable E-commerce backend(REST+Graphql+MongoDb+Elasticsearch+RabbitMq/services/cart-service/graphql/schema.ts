import { buildSchema } from "graphql";

import { checkoutCart } from "../services/checkout";
import { cartStore } from "../services/cartStore";

export const schema = buildSchema(`
  type CartItem {
    productId: String!
    name: String!
    price: Float!
    currency: String!
    quantity: Int!
    sku: String
  }

  type Cart {
    userId: String!
    items: [CartItem!]!
    subtotal: Float!
    currency: String!
    updatedAt: String!
  }

  input AddCartItemInput {
    userId: String!
    productId: String!
    name: String!
    price: Float!
    currency: String = "USD"
    quantity: Int!
    sku: String
  }

  type Query {
    cart(userId: String!): Cart!
  }

  type Mutation {
    addCartItem(input: AddCartItemInput!): Cart!
    updateCartItem(userId: String!, productId: String!, quantity: Int!): Cart!
    removeCartItem(userId: String!, productId: String!): Cart!
    checkout(userId: String!): Boolean!
  }
`);

export const rootValue = {
	cart: ({ userId }: { userId: string }) => cartStore.getCart(userId),
	addCartItem: ({ input }: { input: { userId: string; productId: string; name: string; price: number; currency: string; quantity: number; sku?: string } }) =>
		cartStore.addItem(input.userId, {
			productId: input.productId,
			name: input.name,
			price: input.price,
			currency: input.currency,
			quantity: input.quantity,
			sku: input.sku
		}),
	updateCartItem: ({ userId, productId, quantity }: { userId: string; productId: string; quantity: number }) =>
		cartStore.updateItem(userId, productId, quantity),
	removeCartItem: ({ userId, productId }: { userId: string; productId: string }) => cartStore.removeItem(userId, productId),
	checkout: async ({ userId }: { userId: string }) => {
    try {
      await checkoutCart(userId);
      return true;
    } catch {
      return false;
    }
	}
};