import { Tenant, TenantStats } from "../models/tenants";
import { User } from "../models/users";

const users: User[] = [
	{ id: 1, email: "alice@example.com", tenant_id: 1, role: "admin" },
	{ id: 2, email: "bob@example.com", tenant_id: 2, role: "member" }
];

const tenants: Tenant[] = [
	{ id: 1, name: "Acme", plan: "pro" },
	{ id: 2, name: "Globex", plan: "starter" }
];

export const listUsers = (limit?: number): User[] => {
	return typeof limit === "number" ? users.slice(0, limit) : [...users];
};

export const addUser = (email: string, tenant_id: number, role: string): User => {
	const user = {
		id: Date.now(),
		email,
		tenant_id,
		role
	};

	users.push(user);
	return user;
};

export const addTenant = (tenant: Tenant): Tenant => {
	tenants.push(tenant);
	return tenant;
};

export const getTenantStats = (): TenantStats => {
	return {
		totalTenants: tenants.length,
		totalUsers: users.length
	};
};
