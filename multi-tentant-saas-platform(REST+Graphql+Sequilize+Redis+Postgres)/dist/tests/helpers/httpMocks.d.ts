import { Response } from "express";
import { Mock } from "vitest";
export interface MockResponse<T> {
    res: Response<T>;
    status: Mock;
    json: Mock;
}
export declare const createMockResponse: <T>() => MockResponse<T>;
//# sourceMappingURL=httpMocks.d.ts.map