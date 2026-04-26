export interface Tenant {
    id: number;
    name: string;
    plan: string;
}
export interface TenantStats {
    totalTenants: number;
    totalUsers: number;
}
export interface CreateTenantRequestBody {
    id: number;
    name: string;
    plan: string;
}
export interface CreateTenantResponse {
    message: string;
    data: Tenant;
}
//# sourceMappingURL=tenants.d.ts.map