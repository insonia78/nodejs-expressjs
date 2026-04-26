import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import app from "../services/api-gateway/app";

interface UserRecord {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface ProductRecord {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	currency: string;
	category: string;
	tags: string[];
	stock: number;
	active: boolean;
}

interface CartRecord {
	userId: string;
	items: Array<{ productId: string; quantity: number; name: string; price: number; currency: string; sku: string }>;
	subtotal: number;
	currency: string;
	updatedAt: string;
}

interface OrderRecord {
	id: string;
	userId: string;
	status: string;
	paymentStatus: string;
	items: CartRecord["items"];
	total: number;
	currency: string;
}

interface PaymentRecord {
	orderId: string;
	amount: number;
	currency: string;
	provider: string;
	status: string;
	transactionId: string;
}

interface InventoryRecord {
	productId: string;
	sku: string;
	available: number;
	reserved: number;
	reorderThreshold: number;
}

const readBody = (init?: RequestInit): Record<string, unknown> => {
	if (typeof init?.body !== "string") {
		return {};
	}

	try {
		return JSON.parse(init.body) as Record<string, unknown>;
	} catch {
		return {};
	}
};

describe("horizontal e2e: global flow via gateway", () => {
	beforeEach(() => {
		const users: UserRecord[] = [];
		const products: ProductRecord[] = [];
		const carts = new Map<string, CartRecord>();
		const orders: OrderRecord[] = [];
		const payments: PaymentRecord[] = [];
		const inventory = new Map<string, InventoryRecord>();

		vi.stubGlobal(
			"fetch",
			vi.fn(async (input: unknown, init?: RequestInit) => {
				const rawUrl =
					typeof input === "string"
						? input
						: input instanceof URL
							? input.toString()
							: String((input as { url?: string }).url ?? "");
				const url = new URL(rawUrl);
				const path = url.pathname;
				const method = (init?.method ?? "GET").toUpperCase();
				const body = readBody(init);

				if (method === "POST" && path.endsWith("/auth/register")) {
					const user: UserRecord = {
						id: `u${users.length + 1}`,
						name: String(body.name ?? ""),
						email: String(body.email ?? ""),
						role: String(body.role ?? "customer")
					};
					users.push(user);
					return new Response(JSON.stringify({ user, token: "token-123" }), {
						status: 201,
						headers: { "content-type": "application/json" }
					});
				}

				if (method === "POST" && path.endsWith("/products")) {
					const product: ProductRecord = {
						id: `p${products.length + 1}`,
						name: String(body.name ?? ""),
						slug: String(body.slug ?? ""),
						description: String(body.description ?? ""),
						price: Number(body.price ?? 0),
						currency: String(body.currency ?? "USD"),
						category: String(body.category ?? ""),
						tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
						stock: Number(body.stock ?? 0),
						active: Boolean(body.active ?? true)
					};
					products.push(product);
					return new Response(JSON.stringify(product), {
						status: 201,
						headers: { "content-type": "application/json" }
					});
				}

				if (method === "POST" && path.endsWith("/cart/items")) {
					const userId = String(body.userId ?? "guest-user");
					const productId = String(body.productId ?? "");
					const quantity = Number(body.quantity ?? 1);
					const product = products.find((entry) => entry.id === productId) ?? products[0];
					const cart: CartRecord = {
						userId,
						items: [
							{
								productId,
								quantity,
								name: product?.name ?? "unknown",
								price: product?.price ?? 0,
								currency: product?.currency ?? "USD",
								sku: product?.slug ?? "unknown"
							}
						],
						subtotal: Number(((product?.price ?? 0) * quantity).toFixed(2)),
						currency: product?.currency ?? "USD",
						updatedAt: new Date().toISOString()
					};
					carts.set(userId, cart);
					return new Response(JSON.stringify(cart), {
						status: 201,
						headers: { "content-type": "application/json" }
					});
				}

				if (method === "POST" && path.endsWith("/cart/checkout")) {
					const userId = String(body.userId ?? "guest-user");
					const cart = carts.get(userId);

					if (!cart || cart.items.length === 0) {
						return new Response(JSON.stringify({ message: "Cart is empty" }), {
							status: 400,
							headers: { "content-type": "application/json" }
						});
					}

					orders.push({
						id: `o${orders.length + 1}`,
						userId,
						status: "pending",
						paymentStatus: "awaiting_payment",
						items: cart.items,
						total: cart.subtotal,
						currency: cart.currency
					});

					carts.delete(userId);
					return new Response(JSON.stringify({ message: "Checkout accepted", userId, total: orders.at(-1)?.total ?? 0, currency: "USD" }), {
						status: 202,
						headers: { "content-type": "application/json" }
					});
				}

				if (method === "GET" && path.endsWith("/orders")) {
					return new Response(JSON.stringify(orders), {
						status: 200,
						headers: { "content-type": "application/json" }
					});
				}

				if (method === "PATCH" && /\/orders\/[^/]+\/status$/.test(path)) {
					const orderId = path.split("/").at(-2) ?? "";
					const order = orders.find((entry) => entry.id === orderId);
					if (!order) {
						return new Response(JSON.stringify({ message: "Order not found" }), {
							status: 404,
							headers: { "content-type": "application/json" }
						});
					}

					order.status = String(body.status ?? order.status);
					return new Response(JSON.stringify(order), {
						status: 200,
						headers: { "content-type": "application/json" }
					});
				}

				if (method === "POST" && path.endsWith("/payments/process")) {
					const payment: PaymentRecord = {
						orderId: String(body.orderId ?? ""),
						amount: Number(body.amount ?? 0),
						currency: String(body.currency ?? "USD"),
						provider: "mock",
						status: "succeeded",
						transactionId: `tx_${payments.length + 1}`
					};
					payments.push(payment);

					const relatedOrder = orders.find((entry) => entry.id === payment.orderId);
					if (relatedOrder) {
						relatedOrder.paymentStatus = "paid";
					}

					return new Response(JSON.stringify(payment), {
						status: 201,
						headers: { "content-type": "application/json" }
					});
				}

				if (method === "POST" && path.endsWith("/inventory")) {
					const record: InventoryRecord = {
						productId: String(body.productId ?? ""),
						sku: String(body.sku ?? ""),
						available: Number(body.available ?? 0),
						reserved: Number(body.reserved ?? 0),
						reorderThreshold: Number(body.reorderThreshold ?? 5)
					};
					inventory.set(record.productId, record);
					return new Response(JSON.stringify(record), {
						status: 201,
						headers: { "content-type": "application/json" }
					});
				}

				if (method === "GET" && path.endsWith("/inventory")) {
					return new Response(JSON.stringify(Array.from(inventory.values())), {
						status: 200,
						headers: { "content-type": "application/json" }
					});
				}

				return new Response(JSON.stringify({ message: `Unhandled route ${method} ${path}` }), {
					status: 404,
					headers: { "content-type": "application/json" }
				});
			})
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("executes a full user-to-order lifecycle across services via gateway", async () => {
		const register = await request(app).post("/api/users/auth/register").send({
			name: "Ada",
			email: "ada@example.com",
			password: "secret123"
		});
		expect(register.status).toBe(201);
		expect(register.body.user.id).toBe("u1");

		const product = await request(app).post("/api/catalog/products").send({
			name: "Studio Headphones",
			slug: "studio-headphones",
			description: "Closed-back",
			price: 199.99,
			currency: "USD",
			category: "electronics",
			tags: ["audio"],
			stock: 15,
			active: true
		});
		expect(product.status).toBe(201);

		const addToCart = await request(app).post("/api/cart/cart/items").send({
			userId: "u1",
			productId: product.body.id,
			quantity: 1
		});
		expect(addToCart.status).toBe(201);

		const checkout = await request(app).post("/api/cart/cart/checkout").send({ userId: "u1" });
		expect(checkout.status).toBe(202);

		const listOrders = await request(app).get("/api/orders/orders").query({ userId: "u1" });
		expect(listOrders.status).toBe(200);
		expect(listOrders.body).toHaveLength(1);
		expect(listOrders.body[0].status).toBe("pending");

		const payment = await request(app).post("/api/payments/payments/process").send({
			orderId: listOrders.body[0].id,
			amount: listOrders.body[0].total,
			currency: "USD"
		});
		expect(payment.status).toBe(201);
		expect(payment.body.status).toBe("succeeded");

		const statusUpdate = await request(app)
			.patch(`/api/orders/orders/${listOrders.body[0].id}/status`)
			.send({ status: "shipped" });
		expect(statusUpdate.status).toBe(200);
		expect(statusUpdate.body.status).toBe("shipped");

		const upsertInventory = await request(app).post("/api/inventory/inventory").send({
			productId: product.body.id,
			sku: product.body.slug,
			available: 14,
			reserved: 1,
			reorderThreshold: 5
		});
		expect(upsertInventory.status).toBe(201);

		const listInventory = await request(app).get("/api/inventory/inventory");
		expect(listInventory.status).toBe(200);
		expect(listInventory.body[0].productId).toBe(product.body.id);
	});
});
