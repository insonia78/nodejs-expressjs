import { Client } from "@elastic/elasticsearch";

import { ProductDocumentShape } from "../../../packages/common/src";
import { createLogger } from "../../../packages/common/src";
import { catalogConfig } from "../database/mongoose";

const indexName = "products";
const client = catalogConfig.elasticNode ? new Client({ node: catalogConfig.elasticNode }) : undefined;
const logger = createLogger("catalog");

export const syncProductSearch = async (product: ProductDocumentShape): Promise<void> => {
	if (!client) {
		return;
	}

	try {
		await client.index({
			index: indexName,
			id: product.id,
			document: product,
			refresh: true
		});
	} catch (error) {
		logger.warn("Failed to sync product to Elasticsearch", {
			productId: product.id,
			error
		});
	}
};

export const removeProductFromSearch = async (productId: string): Promise<void> => {
	if (!client) {
		return;
	}

	try {
		await client.delete({
			index: indexName,
			id: productId,
			refresh: true,
			ignore: [404]
		} as never);
	} catch (error) {
		logger.warn("Failed to remove product from Elasticsearch", {
			productId,
			error
		});
	}
};

export const searchProductIds = async (searchTerm: string): Promise<string[]> => {
	if (!client) {
		return [];
	}

	try {
		const response = await client.search<ProductDocumentShape>({
			index: indexName,
			query: {
				multi_match: {
					query: searchTerm,
					fields: ["name^3", "description", "category", "tags"]
				}
			}
		} as never);

		return response.hits.hits
			.map((hit) => String(hit._id ?? hit._source?.id ?? ""))
			.filter((value) => value.length > 0);
	} catch (error) {
		logger.warn("Elasticsearch search failed, falling back to MongoDB search", {
			searchTerm,
			error
		});
		return [];
	}
};