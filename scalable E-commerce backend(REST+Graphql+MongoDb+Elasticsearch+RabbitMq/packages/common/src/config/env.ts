import "dotenv/config";

import { ServiceName } from "../types/domain";

export interface ServiceRuntimeConfig {
	serviceName: ServiceName;
	port: number;
	mongoUri: string;
	jwtSecret: string;
	rabbitMqUrl?: string;
	redisUrl?: string;
	elasticNode?: string;
	stripeSecretKey?: string;
	useStripe: boolean;
	autoCapturePayments: boolean;
	serviceUrls: Record<Exclude<ServiceName, "gateway">, string>;
}

const parseBoolean = (value: string | undefined, fallback = false): boolean => {
	if (value === undefined) {
		return fallback;
	}

	return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

export const getServiceConfig = (serviceName: ServiceName, defaultPort: number): ServiceRuntimeConfig => ({
	serviceName,
	port: Number(process.env.PORT ?? defaultPort),
	mongoUri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/scalable_ecommerce",
	jwtSecret: process.env.JWT_SECRET ?? "change-me",
	rabbitMqUrl: process.env.RABBITMQ_URL,
	redisUrl: process.env.REDIS_URL,
	elasticNode: process.env.ELASTICSEARCH_NODE,
	stripeSecretKey: process.env.STRIPE_SECRET_KEY,
	useStripe: parseBoolean(process.env.USE_STRIPE, false),
	autoCapturePayments: parseBoolean(process.env.AUTO_CAPTURE_PAYMENTS, true),
	serviceUrls: {
		catalog: process.env.CATALOG_SERVICE_URL ?? "http://127.0.0.1:4001",
		cart: process.env.CART_SERVICE_URL ?? "http://127.0.0.1:4002",
		orders: process.env.ORDER_SERVICE_URL ?? "http://127.0.0.1:4003",
		payments: process.env.PAYMENT_SERVICE_URL ?? "http://127.0.0.1:4004",
		inventory: process.env.INVENTORY_SERVICE_URL ?? "http://127.0.0.1:4005",
		users: process.env.USER_SERVICE_URL ?? "http://127.0.0.1:4006"
	}
});