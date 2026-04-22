import { InferAttributes, InferCreationAttributes, Model } from "sequelize";
export declare class AuditLog extends Model<InferAttributes<AuditLog>, InferCreationAttributes<AuditLog>> {
    id: number;
    tenant_id: number;
    action: string;
}
//# sourceMappingURL=AuditLog.d.ts.map