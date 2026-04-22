"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenant = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class Tenant extends sequelize_1.Model {
}
exports.Tenant = Tenant;
Tenant.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    plan: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "Tenant",
    tableName: "tenants",
    timestamps: true,
    underscored: true
});
//# sourceMappingURL=Tenant.js.map