import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model
} from "sequelize";
import { sequelize } from "../sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare email: string;
	declare tenant_id: number;
	declare role: string;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		tenant_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "tenants",
				key: "id"
			}
		},
		role: {
			type: DataTypes.STRING(50),
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: "User",
		tableName: "users",
		timestamps: true,
		underscored: true
	}
);
