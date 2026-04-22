"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantStats = exports.addTenant = exports.addUser = exports.listUsers = void 0;
const users = [
    { id: 1, email: "alice@example.com", tenant_id: 1, role: "admin" },
    { id: 2, email: "bob@example.com", tenant_id: 2, role: "member" }
];
const tenants = [
    { id: 1, name: "Acme", plan: "pro" },
    { id: 2, name: "Globex", plan: "starter" }
];
const listUsers = (limit) => {
    return typeof limit === "number" ? users.slice(0, limit) : [...users];
};
exports.listUsers = listUsers;
const addUser = (email, tenant_id, role) => {
    const user = {
        id: Date.now(),
        email,
        tenant_id,
        role
    };
    users.push(user);
    return user;
};
exports.addUser = addUser;
const addTenant = (tenant) => {
    tenants.push(tenant);
    return tenant;
};
exports.addTenant = addTenant;
const getTenantStats = () => {
    return {
        totalTenants: tenants.length,
        totalUsers: users.length
    };
};
exports.getTenantStats = getTenantStats;
//# sourceMappingURL=dataStore.js.map