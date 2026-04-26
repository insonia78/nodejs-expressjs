import { ServiceRuntimeConfig } from "../config/env";

type RequestInit = globalThis.RequestInit;

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export class HttpError extends Error {
	constructor(
		message: string,
		public readonly statusCode = 500,
		public readonly details?: unknown
	) {
		super(message);
	}
}

export const buildServiceUrl = (
	config: ServiceRuntimeConfig,
	serviceName: keyof ServiceRuntimeConfig["serviceUrls"],
	path: string
): string => `${config.serviceUrls[serviceName]}${path.startsWith("/") ? path : `/${path}`}`;

export const requestJson = async <TResponse>(url: string, init?: RequestInit): Promise<TResponse> => {
	const response = await fetch(url, {
		headers: {
			"content-type": "application/json",
			...(init?.headers ?? {})
		},
		...init
	});

	const contentType = response.headers.get("content-type") ?? "";
	const payload = contentType.includes("application/json") ? await response.json() : await response.text();

	if (!response.ok) {
		const detailsMessage =
			typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
				? payload.message
				: undefined;
		const message = detailsMessage
			? `Request failed with status ${response.status}: ${detailsMessage}`
			: `Request failed with status ${response.status}`;

		throw new HttpError(message, response.status, payload);
	}

	return payload as TResponse;
};