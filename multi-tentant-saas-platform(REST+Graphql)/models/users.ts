export interface User {
	id: number;
	email: string;
	tenant_id: number;
	role: string;
}

export interface GetUsersResponse {
	message: string;
	data: User[];
}

export interface CreateUserRequestBody {
	email?: string;
	tenant_id?: number;
	role?: string;
}

export interface GetUsersRequestQuery {
	limit?: string;
}

export interface CreateUserResponse {
	message: string;
	data: User;
}

export interface ValidationErrorResponse {
	message: string;
	errors: string[];
}
