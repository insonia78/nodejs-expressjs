import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
export declare class Tenant extends Model<InferAttributes<Tenant>, InferCreationAttributes<Tenant>> {
    id: CreationOptional<number>;
    name: string;
    plan: string;
}
//# sourceMappingURL=Tenant.d.ts.map