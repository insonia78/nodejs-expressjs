import { FilterQuery } from "mongoose";

import { ProductDocumentShape } from "../../../packages/common/src";
import { mapProductDocument, ProductDocument, ProductModel } from "../models/Product";
import { searchProductIds } from "../services/searchService";

export interface ProductFilter {
	category?: string;
	minPrice?: number;
	maxPrice?: number;
	search?: string;
	active?: boolean;
}

export const listProductsQuery = async (filter: ProductFilter = {}): Promise<ProductDocumentShape[]> => {
	const query: FilterQuery<ProductDocument> = {};

	if (filter.category) {
		query.category = filter.category;
	}

	if (filter.active !== undefined) {
		query.active = filter.active;
	}

	if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
		query.price = {};

		if (filter.minPrice !== undefined) {
			query.price.$gte = filter.minPrice;
		}

		if (filter.maxPrice !== undefined) {
			query.price.$lte = filter.maxPrice;
		}
	}

	if (filter.search) {
		const elasticIds = await searchProductIds(filter.search);

		if (elasticIds.length > 0) {
			query._id = { $in: elasticIds };
		} else {
			query.$or = [
				{ name: { $regex: filter.search, $options: "i" } },
				{ description: { $regex: filter.search, $options: "i" } },
				{ category: { $regex: filter.search, $options: "i" } },
				{ tags: { $regex: filter.search, $options: "i" } }
			];
		}
	}

	const products = await ProductModel.find(query).sort({ createdAt: -1 });
	return products.map((product) => mapProductDocument(product));
};

export const getProductByIdQuery = async (productId: string): Promise<ProductDocumentShape | null> => {
	const product = await ProductModel.findById(productId);
	return product ? mapProductDocument(product) : null;
};