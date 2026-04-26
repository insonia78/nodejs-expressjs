import dotenv from "dotenv";
import type { Model, ModelStatic } from "sequelize";
import { connectDatabase, sequelize, syncDatabase } from "../database/sequelize";
import "../database/models";

dotenv.config();

type TenantSeed = {
	name: string;
	plan: string;
	users: Array<{ email: string; role: string }>;
	apiKeys: string[];
	auditActions: string[];
};

const tenantSeeds: TenantSeed[] = [
	{
		name: "Acme Corp",
		plan: "pro",
		users: [
			{ email: "admin@acme.com", role: "admin" },
			{ email: "dev@acme.com", role: "developer" }
		],
		apiKeys: ["acme-api-key-001"],
		auditActions: ["tenant.seeded", "users.seeded"]
	},
	{
		name: "Globex Ltd",
		plan: "basic",
		users: [{ email: "owner@globex.com", role: "owner" }],
		apiKeys: ["globex-api-key-001"],
		auditActions: ["tenant.seeded"]
	}
];

type GenericModel = ModelStatic<Model>;

const getModel = (name: "Tenant" | "User" | "ApiKey" | "AuditLog"): GenericModel => {
	const model = sequelize.models[name];
	if (!model) {
		throw new Error(`Model '${name}' is not initialized`);
	}

	return model;
};

const seed = async (): Promise<void> => {
	await connectDatabase();
	await syncDatabase();

	const Tenant = getModel("Tenant");
	const User = getModel("User");
	const ApiKey = getModel("ApiKey");
	const AuditLog = getModel("AuditLog");

	for (const tenantSeed of tenantSeeds) {
		const [tenant, createdTenant] = await Tenant.findOrCreate({
			where: { name: tenantSeed.name },
			defaults: {
				name: tenantSeed.name,
				plan: tenantSeed.plan
			}
		});

		if (!createdTenant && tenant.get("plan") !== tenantSeed.plan) {
			tenant.set("plan", tenantSeed.plan);
			await tenant.save();
		}

		for (const userSeed of tenantSeed.users) {
			const tenantId = Number(tenant.get("id"));
			const [user, createdUser] = await User.findOrCreate({
				where: { email: userSeed.email },
				defaults: {
					email: userSeed.email,
					tenant_id: tenantId,
					role: userSeed.role
				}
			});

			if (
				!createdUser &&
				(Number(user.get("tenant_id")) !== tenantId ||
					String(user.get("role")) !== userSeed.role)
			) {
				user.set("tenant_id", tenantId);
				user.set("role", userSeed.role);
				await user.save();
			}
		}

		for (const apiKeyValue of tenantSeed.apiKeys) {
			const tenantId = Number(tenant.get("id"));
			await ApiKey.findOrCreate({
				where: { key: apiKeyValue },
				defaults: {
					tenant_id: tenantId,
					key: apiKeyValue
				}
			});
		}

		for (const action of tenantSeed.auditActions) {
			const tenantId = Number(tenant.get("id"));
			await AuditLog.findOrCreate({
				where: {
					tenant_id: tenantId,
					action
				},
				defaults: {
					tenant_id: tenantId,
					action
				}
			});
		}
	}

	const [tenantCount, userCount, apiKeyCount, auditLogCount] = await Promise.all([
		Tenant.count(),
		User.count(),
		ApiKey.count(),
		AuditLog.count()
	]);

	console.log("Seeding completed", {
		tenants: tenantCount,
		users: userCount,
		apiKeys: apiKeyCount,
		auditLogs: auditLogCount
	});
};

void seed()
	.catch((error: unknown) => {
		console.error("Database seeding failed", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await sequelize.close();
	});
