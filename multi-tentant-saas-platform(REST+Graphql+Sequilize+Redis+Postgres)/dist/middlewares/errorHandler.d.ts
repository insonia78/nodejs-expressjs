import { NextFunction, Request, Response } from "express";
import { MessageResponse } from "../models/common";
export declare const notFoundHandler: (req: Request, res: Response<MessageResponse>, _next: NextFunction) => void;
export declare const errorHandler: (err: Error, _req: Request, res: Response<MessageResponse>, _next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map