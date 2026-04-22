import { MessageResponse } from "./common";
export interface GenerateTokenRequestBody {
    userId: string;
}
export interface GenerateTokenResponse extends MessageResponse {
    token: string;
}
export interface AuthErrorResponse extends MessageResponse {
}
//# sourceMappingURL=auth.d.ts.map