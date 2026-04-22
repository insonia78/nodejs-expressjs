import { ApiKey } from "./ApiKey";
import { AuditLog } from "./AuditLog";
import { Tenant } from "./Tenant";
import { User } from "./User";

Tenant.hasMany(User, {
	foreignKey: "tenant_id",
	as: "users"
});

User.belongsTo(Tenant, {
	foreignKey: "tenant_id",
	as: "tenant"
});

Tenant.hasMany(ApiKey, {
	foreignKey: "tenant_id",
	as: "apiKeys"
});

ApiKey.belongsTo(Tenant, {
	foreignKey: "tenant_id",
	as: "tenant"
});

Tenant.hasMany(AuditLog, {
	foreignKey: "tenant_id",
	as: "auditLogs"
});

AuditLog.belongsTo(Tenant, {
	foreignKey: "tenant_id",
	as: "tenant"
});

export { Tenant, User, ApiKey, AuditLog };
