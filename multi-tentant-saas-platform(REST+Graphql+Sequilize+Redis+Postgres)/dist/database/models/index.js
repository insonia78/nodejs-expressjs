"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.ApiKey = exports.User = exports.Tenant = void 0;
const ApiKey_1 = require("./ApiKey");
Object.defineProperty(exports, "ApiKey", { enumerable: true, get: function () { return ApiKey_1.ApiKey; } });
const AuditLog_1 = require("./AuditLog");
Object.defineProperty(exports, "AuditLog", { enumerable: true, get: function () { return AuditLog_1.AuditLog; } });
const Tenant_1 = require("./Tenant");
Object.defineProperty(exports, "Tenant", { enumerable: true, get: function () { return Tenant_1.Tenant; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
Tenant_1.Tenant.hasMany(User_1.User, {
    foreignKey: "tenant_id",
    as: "users"
});
User_1.User.belongsTo(Tenant_1.Tenant, {
    foreignKey: "tenant_id",
    as: "tenant"
});
Tenant_1.Tenant.hasMany(ApiKey_1.ApiKey, {
    foreignKey: "tenant_id",
    as: "apiKeys"
});
ApiKey_1.ApiKey.belongsTo(Tenant_1.Tenant, {
    foreignKey: "tenant_id",
    as: "tenant"
});
Tenant_1.Tenant.hasMany(AuditLog_1.AuditLog, {
    foreignKey: "tenant_id",
    as: "auditLogs"
});
AuditLog_1.AuditLog.belongsTo(Tenant_1.Tenant, {
    foreignKey: "tenant_id",
    as: "tenant"
});
//# sourceMappingURL=index.js.map