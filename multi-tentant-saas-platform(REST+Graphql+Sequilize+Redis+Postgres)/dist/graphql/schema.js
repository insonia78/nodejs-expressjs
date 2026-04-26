"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootValue = exports.schema = void 0;
const graphql_1 = require("graphql");
const dataStore_1 = require("../utils/dataStore");
exports.schema = (0, graphql_1.buildSchema)(`
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
exports.rootValue = {
    tenantStats: () => (0, dataStore_1.getTenantStats)(),
    users: ({ limit }) => (0, dataStore_1.listUsers)(limit)
};
//# sourceMappingURL=schema.js.map