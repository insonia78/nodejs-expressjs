import { buildSchema } from "graphql";

import { buildServiceUrl, getServiceConfig, requestJson } from "../../../packages/common/src";

const gatewayConfig = getServiceConfig("gateway", 4000);

const withQuery = (path: string, values: Record<string, string | number | boolean | undefined>): string => {
	const query = new URLSearchParams();

	for (const [key, value] of Object.entries(values)) {
		if (value !== undefined) {
			query.set(key, String(value));
		}
	}

	const suffix = query.toString();
	return suffix ? `${path}?${suffix}` : path;
};

export const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String!
    price: Float!
    currency: String!
    category: String!
    tags: [String!]!
    stock: Int!
    active: Boolean!
    createdAt: String
    updatedAt: String
  }

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

  type PaymentResult {
    orderId: String!
    amount: Float!
    currency: String!
    provider: String!
    status: String!
    transactionId: String!
    clientSecret: String
  }

  type Inventory {
    productId: String!
    sku: String!
    available: Int!
    reserved: Int!
    reorderThreshold: Int!
    updatedAt: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  input ProductInput {
    name: String!
    slug: String!
    description: String!
    price: Float!
    currency: String
    category: String!
    tags: [String!]
    stock: Int
    active: Boolean
  }

  type Query {
    products(category: String, search: String, minPrice: Float, maxPrice: Float, active: Boolean): [Product!]!
    product(id: ID!): Product
    cart(userId: String!): Cart!
    orders(userId: String, status: String): [Order!]!
    inventories: [Inventory!]!
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload
    addCartItem(userId: String!, productId: String!, quantity: Int!): Cart!
    checkout(userId: String!): Boolean!
    createProduct(input: ProductInput!): Product!
    updateOrderStatus(id: ID!, status: String!): Order
    processPayment(orderId: String!, amount: Float!, currency: String!): PaymentResult!
    upsertInventory(productId: String!, sku: String!, available: Int!, reserved: Int, reorderThreshold: Int): Inventory!
  }
`);

export const rootValue = {
	products: (args: { category?: string; search?: string; minPrice?: number; maxPrice?: number; active?: boolean }) =>
		requestJson(buildServiceUrl(gatewayConfig, "catalog", withQuery("/products", args))),
	product: ({ id }: { id: string }) => requestJson(buildServiceUrl(gatewayConfig, "catalog", `/products/${id}`)),
	cart: ({ userId }: { userId: string }) => requestJson(buildServiceUrl(gatewayConfig, "cart", `/cart?userId=${encodeURIComponent(userId)}`)),
	orders: (args: { userId?: string; status?: string }) =>
		requestJson(buildServiceUrl(gatewayConfig, "orders", withQuery("/orders", args))),
	inventories: () => requestJson(buildServiceUrl(gatewayConfig, "inventory", "/inventory")),
	users: () => requestJson(buildServiceUrl(gatewayConfig, "users", "/users")),
	user: ({ id }: { id: string }) => requestJson(buildServiceUrl(gatewayConfig, "users", `/users/${id}`)),
	register: ({ name, email, password, role }: { name: string; email: string; password: string; role?: string }) =>
		requestJson(buildServiceUrl(gatewayConfig, "users", "/auth/register"), {
			method: "POST",
			body: JSON.stringify({ name, email, password, role })
		}),
	login: ({ email, password }: { email: string; password: string }) =>
		requestJson(buildServiceUrl(gatewayConfig, "users", "/auth/login"), {
			method: "POST",
			body: JSON.stringify({ email, password })
		}),
	addCartItem: ({ userId, productId, quantity }: { userId: string; productId: string; quantity: number }) =>
		requestJson(buildServiceUrl(gatewayConfig, "cart", "/cart/items"), {
			method: "POST",
			body: JSON.stringify({ userId, productId, quantity })
		}),
	checkout: async ({ userId }: { userId: string }) => {
		await requestJson(buildServiceUrl(gatewayConfig, "cart", "/cart/checkout"), {
			method: "POST",
			body: JSON.stringify({ userId })
		});
		return true;
	},
	createProduct: ({ input }: { input: Record<string, unknown> }) =>
		requestJson(buildServiceUrl(gatewayConfig, "catalog", "/products"), {
			method: "POST",
			body: JSON.stringify(input)
		}),
	updateOrderStatus: ({ id, status }: { id: string; status: string }) =>
		requestJson(buildServiceUrl(gatewayConfig, "orders", `/orders/${id}/status`), {
			method: "PATCH",
			body: JSON.stringify({ status })
		}),
	processPayment: ({ orderId, amount, currency }: { orderId: string; amount: number; currency: string }) =>
		requestJson(buildServiceUrl(gatewayConfig, "payments", "/payments/process"), {
			method: "POST",
			body: JSON.stringify({ orderId, amount, currency })
		}),
	upsertInventory: ({ productId, sku, available, reserved, reorderThreshold }: { productId: string; sku: string; available: number; reserved?: number; reorderThreshold?: number }) =>
		requestJson(buildServiceUrl(gatewayConfig, "inventory", "/inventory"), {
			method: "POST",
			body: JSON.stringify({ productId, sku, available, reserved, reorderThreshold })
		})
};