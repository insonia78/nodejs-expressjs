"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class ApiKey extends sequelize_1.Model {
}
exports.ApiKey = ApiKey;
ApiKey.init({
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
    key: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "ApiKey",
    tableName: "api_keys",
    timestamps: true,
    underscored: true
});
//# sourceMappingURL=ApiKey.js.map