import { NextFunction, Request, Response } from "express";
export declare const cacheResponse: (ttlSeconds?: number) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const invalidateCache: (prefixes: string[]) => (_req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cache.d.ts.map