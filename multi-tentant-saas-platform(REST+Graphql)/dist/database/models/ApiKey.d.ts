import { InferAttributes, InferCreationAttributes, Model } from "sequelize";
export declare class ApiKey extends Model<InferAttributes<ApiKey>, InferCreationAttributes<ApiKey>> {
    id: number;
    tenant_id: number;
    key: string;
}
//# sourceMappingURL=ApiKey.d.ts.map