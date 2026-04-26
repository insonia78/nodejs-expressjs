import { Request, Response } from "express";
import { Tenant } from "../database/models";
import { CreateTenantRequestBody, CreateTenantResponse } from "../models/tenants";
import { logger } from "../utils/logger";

export const createTenant = (
	req: Request<{}, CreateTenantResponse, CreateTenantRequestBody>,
	res: Response<CreateTenantResponse>
	): Promise<void> => {
	logger.debug("POST /tenants - incoming request");

	const { id, name, plan } = req.body;

	return Tenant.create({ id, name, plan })
		.then((tenant) => {
			const response: CreateTenantResponse = {
				message: "Tenant created successfully",
				data: {
					id: tenant.id,
					name: tenant.name,
					plan: tenant.plan
				}
			};

			logger.info("POST /tenants - tenant created", {
				status: 201,
				plan: tenant.plan
			});

			res.status(201).json(response);
		})
		.catch(() => {
			logger.error("POST /tenants - database insert failed");
			res.status(500).json({
				message: "Failed to create tenant",
				data: { id: 0, name: "", plan: "" }
			});
		});
};
