export type ServiceName =
	| "catalog"
	| "cart"
	| "orders"
	| "payments"
	| "inventory"
	| "users"
	| "gateway";

export enum OrderStatus {
	PENDING = "pending",
	SHIPPED = "shipped",
	DELIVERED = "delivered",
	CANCELLED = "cancelled"
}

export enum PaymentStatus {
	AWAITING = "awaiting_payment",
	PAID = "paid",
	FAILED = "failed",
	REFUNDED = "refunded"
}

export interface ProductDocumentShape {
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
	createdAt?: string;
	updatedAt?: string;
}

export interface CartItemShape {
	productId: string;
	name: string;
	price: number;
	currency: string;
	quantity: number;
	sku?: string;
}

export interface CartShape {
	userId: string;
	items: CartItemShape[];
	subtotal: number;
	currency: string;
	updatedAt: string;
}

export interface OrderShape {
	id: string;
	userId: string;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	items: CartItemShape[];
	total: number;
	currency: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface PaymentResultShape {
	orderId: string;
	amount: number;
	currency: string;
	provider: "mock" | "stripe";
	status: "succeeded" | "failed";
	transactionId: string;
	clientSecret?: string;
}

export interface UserShape {
	id: string;
	name: string;
	email: string;
	role: "customer" | "admin";
	createdAt?: string;
	updatedAt?: string;
}

export interface InventoryShape {
	productId: string;
	sku: string;
	available: number;
	reserved: number;
	reorderThreshold: number;
	updatedAt?: string;
}

export interface DomainEvent<TPayload = unknown> {
	name: string;
	payload: TPayload;
	occurredAt: string;
	service: ServiceName;
	traceId?: string;
}