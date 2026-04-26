import { NextFunction, Request, Response } from "express";
import { AuthErrorResponse } from "../models/auth";
export declare const authenticateToken: (req: Request, res: Response<AuthErrorResponse>, next: NextFunction) => void;
//# sourceMappingURL=authJwt.d.ts.map