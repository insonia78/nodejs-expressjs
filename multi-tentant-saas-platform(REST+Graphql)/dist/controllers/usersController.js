"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUsers = void 0;
const models_1 = require("../database/models");
const logger_1 = require("../utils/logger");
const getUsers = (req, res) => {
    logger_1.logger.debug("GET /users - incoming request");
    const limit = req.query.limit ? Number(req.query.limit) : null;
    return models_1.User.findAll({
        attributes: ["id", "email", "tenant_id", "role"],
        ...(limit ? { limit } : {}),
        order: [["id", "ASC"]]
    })
        .then((users) => {
        const response = {
            message: "Users fetched successfully",
            data: users.map((user) => ({
                id: user.id,
                email: user.email,
                tenant_id: user.tenant_id,
                role: user.role
            }))
        };
        logger_1.logger.info("GET /users - response sent", {
            status: 200,
            userCount: response.data.length
        });
        res.status(200).json(response);
    })
        .catch(() => {
        logger_1.logger.error("GET /users - database query failed");
        res.status(500).json({ message: "Failed to fetch users", data: [] });
    });
};
exports.getUsers = getUsers;
const createUser = (req, res) => {
    logger_1.logger.debug("POST /users - incoming request");
    const { email, tenant_id, role } = req.body;
    return models_1.User.create({
        email: email ?? "",
        tenant_id: tenant_id ?? 0,
        role: role ?? ""
    })
        .then((user) => {
        const response = {
            message: "User created successfully",
            data: {
                id: user.id,
                email: user.email,
                tenant_id: user.tenant_id,
                role: user.role
            }
        };
        logger_1.logger.info("POST /users - user created", {
            status: 201,
            role: response.data.role
        });
        res.status(201).json(response);
    })
        .catch(() => {
        logger_1.logger.error("POST /users - database insert failed");
        res.status(500).json({
            message: "Failed to create user",
            data: { id: 0, email: "", tenant_id: 0, role: "" }
        });
    });
};
exports.createUser = createUser;
//# sourceMappingURL=usersController.js.map