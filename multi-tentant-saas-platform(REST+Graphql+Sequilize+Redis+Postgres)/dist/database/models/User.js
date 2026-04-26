"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    tenant_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "tenants",
            key: "id"
        }
    },
    role: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true
});
//# sourceMappingURL=User.js.map