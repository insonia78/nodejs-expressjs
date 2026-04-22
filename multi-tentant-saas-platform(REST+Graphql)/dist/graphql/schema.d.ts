export declare const schema: import("graphql").GraphQLSchema;
export declare const rootValue: {
    tenantStats: () => import("../models/tenants").TenantStats;
    users: ({ limit }: {
        limit?: number;
    }) => import("../models/users").User[];
};
//# sourceMappingURL=schema.d.ts.map