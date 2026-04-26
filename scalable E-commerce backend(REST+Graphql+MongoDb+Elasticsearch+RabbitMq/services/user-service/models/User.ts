import { Document, HydratedDocument, Model, Schema, model } from "mongoose";

import { UserShape } from "../../../packages/common/src";

export interface UserDocument extends Document {
	name: string;
	email: string;
	passwordHash: string;
	role: "customer" | "admin";
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, trim: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ["customer", "admin"], default: "customer" }
	},
	{ timestamps: true }
);

export const UserModel: Model<UserDocument> = model<UserDocument>("User", userSchema);

export const mapUserDocument = (user: HydratedDocument<UserDocument>): UserShape => ({
	id: user.id,
	name: user.name,
	email: user.email,
	role: user.role,
	createdAt: user.createdAt?.toISOString(),
	updatedAt: user.updatedAt?.toISOString()
});