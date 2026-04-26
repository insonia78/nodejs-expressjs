import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";

export class ApiKey extends Model<InferAttributes<ApiKey>, InferCreationAttributes<ApiKey>> {
	declare id: number;
	declare tenant_id: number;
	declare key: string;
}

ApiKey.init(
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
		key: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true
		}
	},
	{
		sequelize,
		modelName: "ApiKey",
		tableName: "api_keys",
		timestamps: true,
		underscored: true
	}
);
