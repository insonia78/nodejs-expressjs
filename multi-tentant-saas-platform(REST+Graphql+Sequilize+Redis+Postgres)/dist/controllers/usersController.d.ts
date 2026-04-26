import { Request, Response } from "express";
import { CreateUserRequestBody, CreateUserResponse, GetUsersRequestQuery, GetUsersResponse } from "../models/users";
export declare const getUsers: (req: Request<{}, GetUsersResponse, {}, GetUsersRequestQuery>, res: Response<GetUsersResponse>) => Promise<void>;
export declare const createUser: (req: Request<{}, CreateUserResponse, CreateUserRequestBody>, res: Response<CreateUserResponse>) => Promise<void>;
//# sourceMappingURL=usersController.d.ts.map