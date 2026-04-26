import { Tenant, TenantStats } from "../models/tenants";
import { User } from "../models/users";
export declare const listUsers: (limit?: number) => User[];
export declare const addUser: (email: string, tenant_id: number, role: string) => User;
export declare const addTenant: (tenant: Tenant) => Tenant;
export declare const getTenantStats: () => TenantStats;
//# sourceMappingURL=dataStore.d.ts.map