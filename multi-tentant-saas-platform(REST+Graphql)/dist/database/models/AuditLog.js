"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class AuditLog extends sequelize_1.Model {
}
exports.AuditLog = AuditLog;
AuditLog.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tenant_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "tenants",
            key: "id"
        }
    },
    action: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "AuditLog",
    tableName: "audit_logs",
    timestamps: true,
    underscored: true
});
//# sourceMappingURL=AuditLog.js.map