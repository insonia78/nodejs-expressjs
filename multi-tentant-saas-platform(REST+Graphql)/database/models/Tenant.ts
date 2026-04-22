import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model
} from "sequelize";
import { sequelize } from "../sequelize";

export class Tenant extends Model<InferAttributes<Tenant>, InferCreationAttributes<Tenant>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare plan: string;
}

Tenant.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		plan: {
			type: DataTypes.STRING(50),
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: "Tenant",
		tableName: "tenants",
		timestamps: true,
		underscored: true
	}
);
