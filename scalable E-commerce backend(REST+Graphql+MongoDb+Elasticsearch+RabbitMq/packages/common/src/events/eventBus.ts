import amqplib, { Channel, ChannelModel, ConsumeMessage } from "amqplib";

import { createLogger } from "../logging/logger";
import { DomainEvent, ServiceName } from "../types/domain";

type EventHandler<TPayload> = (event: DomainEvent<TPayload>) => Promise<void>;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export class EventBus {
	private connection?: ChannelModel;

	private channel?: Channel;

	private readonly exchange = "ecommerce.events";

	private readonly logger;

	constructor(
		private readonly serviceName: ServiceName,
		private readonly rabbitMqUrl?: string
	) {
		this.logger = createLogger(serviceName);
	}

	async connect(): Promise<void> {
		if (!this.rabbitMqUrl || this.channel) {
			if (!this.rabbitMqUrl) {
				this.logger.warn("RabbitMQ URL is not configured, event bus is disabled");
			}
			return;
		}

		let retries = 0;
		const maxRetries = 15;
		const baseDelay = 1000; // 1 second

		while (retries < maxRetries) {
			try {
				this.connection = await amqplib.connect(this.rabbitMqUrl);
				this.channel = await this.connection.createChannel();
				await this.channel.assertExchange(this.exchange, "topic", { durable: true });
				this.logger.info("Event bus connected", { exchange: this.exchange });
				return;
			} catch (error) {
				retries++;
				if (retries >= maxRetries) {
					this.logger.warn("Failed to connect to RabbitMQ, event bus will be disabled", {
						error: error instanceof Error ? error.message : String(error)
					});
					return; // Don't throw, allow service to continue without event bus
				}

				const delay = baseDelay * Math.pow(2, Math.min(retries - 1, 4)); // Exponential backoff, max 16s
				this.logger.debug(`RabbitMQ connection attempt ${retries}/${maxRetries} failed, retrying in ${delay}ms...`);
				await sleep(delay);
			}
		}
	}

	async publish<TPayload>(name: string, payload: TPayload, traceId?: string): Promise<void> {
		const event: DomainEvent<TPayload> = {
			name,
			payload,
			occurredAt: new Date().toISOString(),
			service: this.serviceName,
			traceId
		};

		if (!this.channel) {
			this.logger.info("Event skipped because RabbitMQ is not configured", {
				eventName: name,
				traceId,
				payload
			});
			return;
		}

		this.channel.publish(this.exchange, name, Buffer.from(JSON.stringify(event)), {
			contentType: "application/json",
			persistent: true
		});

		this.logger.debug("Event published", {
			eventName: name,
			traceId
		});
	}

	async subscribe<TPayload>(routingKey: string, handler: EventHandler<TPayload>): Promise<void> {
		if (!this.channel) {
			return;
		}

		const queueName = `${this.serviceName}.${routingKey}`;
		const { queue } = await this.channel.assertQueue(queueName, { durable: true });
		await this.channel.bindQueue(queue, this.exchange, routingKey);
		this.logger.info("Event subscription created", {
			routingKey,
			queue
		});

		await this.channel.consume(queue, async (message?: ConsumeMessage | null) => {
			if (!message || !this.channel) {
				return;
			}

			try {
				const event = JSON.parse(message.content.toString()) as DomainEvent<TPayload>;
				this.logger.debug("Event received", {
					routingKey,
					eventName: event.name,
					traceId: event.traceId
				});
				await handler(event);
				this.channel.ack(message);
			} catch (error) {
				this.logger.error("Failed to process event", {
					routingKey,
					error
				});
				this.channel.nack(message, false, false);
			}
		});
	}

	async close(): Promise<void> {
		await this.channel?.close();
		await this.connection?.close();
		this.logger.info("Event bus connection closed");
	}
}