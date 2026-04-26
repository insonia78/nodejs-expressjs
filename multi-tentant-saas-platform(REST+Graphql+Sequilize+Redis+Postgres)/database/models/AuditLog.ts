import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";

export class AuditLog extends Model<InferAttributes<AuditLog>, InferCreationAttributes<AuditLog>> {
	declare id: number;
	declare tenant_id: number;
	declare action: string;
}

AuditLog.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		tenant_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "tenants",
				key: "id"
			}
		},
		action: {
			type: DataTypes.STRING(255),
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: "AuditLog",
		tableName: "audit_logs",
		timestamps: true,
		underscored: true
	}
);
