import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
export declare class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: CreationOptional<number>;
    email: string;
    tenant_id: number;
    role: string;
}
//# sourceMappingURL=User.d.ts.map