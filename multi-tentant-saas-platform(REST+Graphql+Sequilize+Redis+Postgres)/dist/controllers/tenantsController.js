"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTenant = void 0;
const models_1 = require("../database/models");
const logger_1 = require("../utils/logger");
const createTenant = (req, res) => {
    logger_1.logger.debug("POST /tenants - incoming request");
    const { id, name, plan } = req.body;
    return models_1.Tenant.create({ id, name, plan })
        .then((tenant) => {
        const response = {
            message: "Tenant created successfully",
            data: {
                id: tenant.id,
                name: tenant.name,
                plan: tenant.plan
            }
        };
        logger_1.logger.info("POST /tenants - tenant created", {
            status: 201,
            plan: tenant.plan
        });
        res.status(201).json(response);
    })
        .catch(() => {
        logger_1.logger.error("POST /tenants - database insert failed");
        res.status(500).json({
            message: "Failed to create tenant",
            data: { id: 0, name: "", plan: "" }
        });
    });
};
exports.createTenant = createTenant;
//# sourceMappingURL=tenantsController.js.map