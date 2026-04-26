import { Request, Response, NextFunction } from "express";
import { GraphQLSchema, graphql } from "graphql";

export const createGraphqlHandler = <TRootValue extends object>(
	schema: GraphQLSchema,
	rootValue: TRootValue
) => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const source = typeof req.body?.query === "string" ? req.body.query : "";

		if (!source) {
			res.status(400).json({ message: "GraphQL query is required" });
			return;
		}

		try {
			const result = await graphql({
				schema,
				source,
				rootValue,
				contextValue: {
					req,
					res
				},
				variableValues:
					req.body?.variables && typeof req.body.variables === "object"
						? req.body.variables
						: undefined
			});

			res.status(result.errors?.length ? 400 : 200).json(result);
		} catch (error) {
			next(error);
		}
	};
};