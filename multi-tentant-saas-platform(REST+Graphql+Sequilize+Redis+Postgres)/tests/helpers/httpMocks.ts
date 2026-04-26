import { Response } from "express";
import { Mock, vi } from "vitest";

export interface MockResponse<T> {
	res: Response<T>;
	status: Mock;
	json: Mock;
}

export const createMockResponse = <T>(): MockResponse<T> => {
	const json = vi.fn();
	const status = vi.fn(() => ({ json }));

	return {
		res: { status } as unknown as Response<T>,
		status,
		json
	};
};
