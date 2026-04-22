import { Request, Response } from "express";
import { AuthErrorResponse, GenerateTokenRequestBody, GenerateTokenResponse } from "../models/auth";
import "dotenv/config";
export declare const generateToken: (req: Request<{}, GenerateTokenResponse | AuthErrorResponse, GenerateTokenRequestBody>, res: Response<GenerateTokenResponse | AuthErrorResponse>) => void;
//# sourceMappingURL=authController.d.ts.map