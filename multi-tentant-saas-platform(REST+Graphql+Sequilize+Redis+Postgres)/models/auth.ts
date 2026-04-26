import { MessageResponse } from "./common";

export interface GenerateTokenRequestBody {
	userId: string;
}

export interface GenerateTokenResponse extends MessageResponse {
	token: string;
	refreshToken: string;
}

export interface RefreshTokenRequestBody {
	refreshToken: string;
}

export interface AuthErrorResponse extends MessageResponse {}
