import Redis from "ioredis";

import { buildServiceUrl, CartItemShape, CartShape, EventBus, getServiceConfig } from "../../../packages/common/src";

export const cartConfig = getServiceConfig("cart", 4002);
export const cartEventBus = new EventBus("cart", cartConfig.rabbitMqUrl);

const emptyCart = (userId: string): CartShape => ({
	userId,
	items: [],
	subtotal: 0,
	currency: "USD",
	updatedAt: new Date().toISOString()
});

const recalculateCart = (cart: CartShape): CartShape => ({
	...cart,
	subtotal: Number(cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)),
	currency: cart.items[0]?.currency ?? "USD",
	updatedAt: new Date().toISOString()
});

class CartStore {
	private redis?: Redis;

	private fallback = new Map<string, CartShape>();

	constructor(redisUrl?: string) {
		if (!redisUrl) {
			return;
		}

		this.redis = new Redis(redisUrl, {
			lazyConnect: true,
			maxRetriesPerRequest: 1
		});

		this.redis.on("error", (error: unknown) => {
			console.warn("Redis error, falling back to in-memory cart store", error);
		});
	}

	private getKey(userId: string): string {
		return `cart:${userId}`;
	}

	async connect(): Promise<void> {
		if (!this.redis) {
			return;
		}

		try {
			if (this.redis.status === "wait") {
				await this.redis.connect();
			}
		} catch (error) {
			console.warn("Redis connection failed, using in-memory cart store", error);
			this.redis.disconnect();
			this.redis = undefined;
		}
	}

	async getCart(userId: string): Promise<CartShape> {
		if (this.redis) {
			const rawCart = await this.redis.get(this.getKey(userId));
			return rawCart ? (JSON.parse(rawCart) as CartShape) : emptyCart(userId);
		}

		return this.fallback.get(userId) ?? emptyCart(userId);
	}

	async saveCart(cart: CartShape): Promise<CartShape> {
		const normalized = recalculateCart(cart);

		if (this.redis) {
			await this.redis.set(this.getKey(cart.userId), JSON.stringify(normalized), "EX", 60 * 60 * 12);
		} else {
			this.fallback.set(cart.userId, normalized);
		}

		return normalized;
	}

	async addItem(userId: string, item: CartItemShape): Promise<CartShape> {
		const cart = await this.getCart(userId);
		const existingItem = cart.items.find((entry) => entry.productId === item.productId);

		if (existingItem) {
			existingItem.quantity += item.quantity;
		} else {
			cart.items.push(item);
		}

		return this.saveCart(cart);
	}

	async updateItem(userId: string, productId: string, quantity: number): Promise<CartShape> {
		const cart = await this.getCart(userId);
		cart.items = cart.items
			.map((item) => (item.productId === productId ? { ...item, quantity } : item))
			.filter((item) => item.quantity > 0);
		return this.saveCart(cart);
	}

	async removeItem(userId: string, productId: string): Promise<CartShape> {
		const cart = await this.getCart(userId);
		cart.items = cart.items.filter((item) => item.productId !== productId);
		return this.saveCart(cart);
	}

	async clear(userId: string): Promise<void> {
		if (this.redis) {
			await this.redis.del(this.getKey(userId));
			return;
		}

		this.fallback.delete(userId);
	}
}

export const cartStore = new CartStore(cartConfig.redisUrl);

export const getCatalogProductUrl = (productId: string): string => buildServiceUrl(cartConfig, "catalog", `/products/${productId}`);