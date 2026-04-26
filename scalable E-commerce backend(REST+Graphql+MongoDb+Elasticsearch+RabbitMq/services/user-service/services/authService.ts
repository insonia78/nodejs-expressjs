import bcrypt from "bcryptjs";

import { signAccessToken } from "../../../packages/common/src";
import { userConfig } from "../database/mongoose";
import { mapUserDocument, UserModel } from "../models/User";

export const registerUser = async (input: {
	name: string;
	email: string;
	password: string;
	role?: "customer" | "admin";
}): Promise<{ user: ReturnType<typeof mapUserDocument>; token: string }> => {
	const passwordHash = await bcrypt.hash(input.password, 10);
	const user = await UserModel.create({
		name: input.name,
		email: input.email.toLowerCase(),
		passwordHash,
		role: input.role ?? "customer"
	});

	const mapped = mapUserDocument(user);
	return {
		user: mapped,
		token: signAccessToken({ id: mapped.id, email: mapped.email, role: mapped.role }, userConfig.jwtSecret)
	};
};

export const loginUser = async (input: { email: string; password: string }): Promise<{ user: ReturnType<typeof mapUserDocument>; token: string } | null> => {
	const user = await UserModel.findOne({ email: input.email.toLowerCase() });
	if (!user) {
		return null;
	}

	const isValid = await bcrypt.compare(input.password, user.passwordHash);
	if (!isValid) {
		return null;
	}

	const mapped = mapUserDocument(user);
	return {
		user: mapped,
		token: signAccessToken({ id: mapped.id, email: mapped.email, role: mapped.role }, userConfig.jwtSecret)
	};
};

export const listUsers = async () => (await UserModel.find().sort({ createdAt: -1 })).map((user) => mapUserDocument(user));

export const getUserById = async (userId: string) => {
	const user = await UserModel.findById(userId);
	return user ? mapUserDocument(user) : null;
};