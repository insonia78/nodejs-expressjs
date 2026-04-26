import { randomUUID } from "crypto";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

import { ServiceName } from "../types/domain";

type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
	requestId?: string;
	traceId?: string;
	path?: string;
	method?: string;
	statusCode?: number;
	durationMs?: number;
	[key: string]: unknown;
}

const levelOrder: Record<LogLevel, number> = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40
};

const resolveLogLevel = (): LogLevel => {
	const value = String(process.env.LOG_LEVEL ?? "info").toLowerCase();

	if (value === "debug" || value === "info" || value === "warn" || value === "error") {
		return value;
	}

	return "info";
};

const activeLevel = resolveLogLevel();

const shouldLog = (level: LogLevel): boolean => levelOrder[level] >= levelOrder[activeLevel];

const logDirectory = process.env.LOG_DIR
	? process.env.LOG_DIR
	: process.env.NODE_ENV === "test"
		? join(process.cwd(), ".logs-test")
		: join(process.cwd(), "logs");

const ensureLogDirectory = (): void => {
	if (!existsSync(logDirectory)) {
		mkdirSync(logDirectory, { recursive: true });
	}
};

const appendToLogFile = (fileName: string, line: string): void => {
	try {
		ensureLogDirectory();
		appendFileSync(join(logDirectory, fileName), `${line}\n`, "utf8");
	} catch {
		// Swallow filesystem errors to avoid impacting request handling.
	}
};

const resolveLogDate = (): string => new Date().toISOString().slice(0, 10);

const serializeError = (error: unknown): Record<string, unknown> | undefined => {
	if (!(error instanceof Error)) {
		return undefined;
	}

	return {
		name: error.name,
		message: error.message,
		stack: error.stack
	};
};

const writeLog = (level: LogLevel, service: ServiceName, message: string, context?: LogContext): void => {
	if (!shouldLog(level)) {
		return;
	}

	const payload = {
		timestamp: new Date().toISOString(),
		level,
		service,
		message,
		...context
	};

	const serialized = JSON.stringify(payload);
	const logDate = resolveLogDate();

	appendToLogFile(`${service}-${logDate}.log`, serialized);
	appendToLogFile(`master-${logDate}.log`, serialized);

	if (level === "error") {
		console.error(serialized);
		return;
	}

	if (level === "warn") {
		console.warn(serialized);
		return;
	}

	console.info(serialized);
};

export interface ServiceLogger {
	debug: (message: string, context?: LogContext) => void;
	info: (message: string, context?: LogContext) => void;
	warn: (message: string, context?: LogContext) => void;
	error: (message: string, context?: LogContext & { error?: unknown }) => void;
}

export const createLogger = (service: ServiceName): ServiceLogger => ({
	debug: (message, context) => writeLog("debug", service, message, context),
	info: (message, context) => writeLog("info", service, message, context),
	warn: (message, context) => writeLog("warn", service, message, context),
	error: (message, context) =>
		writeLog("error", service, message, {
			...context,
			...(context?.error ? { error: serializeError(context.error) ?? context.error } : {})
		})
});

export const createRequestId = (): string => randomUUID();