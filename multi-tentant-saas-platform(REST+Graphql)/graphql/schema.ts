import { buildSchema } from "graphql";
import { getTenantStats, listUsers } from "../utils/dataStore";

export const schema = buildSchema(`
	type User {
		id: Int!
		email: String!
		tenant_id: Int!
		role: String!
	}

	type TenantStats {
		totalTenants: Int!
		totalUsers: Int!
	}

	type Query {
		tenantStats: TenantStats
		users(limit: Int): [User]
	}
`);

export const rootValue = {
	tenantStats: () => getTenantStats(),
	users: ({ limit }: { limit?: number }) => listUsers(limit)
};
