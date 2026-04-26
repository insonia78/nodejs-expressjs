import { createLogger, ProductDocumentShape } from "../../../packages/common/src";
import { catalogEventBus } from "../database/mongoose";
import { mapProductDocument, ProductModel } from "../models/Product";
import { removeProductFromSearch, syncProductSearch } from "../services/searchService";
import { Request, Response } from "express";

const logger = createLogger("catalog");


export interface RequestWithId extends Request {
	requestId: string;
}

export interface ProductInput {
	name: string;
	slug: string;
	description: string;
	price: number;
	currency?: string;
	category: string;
	tags?: string[];
	stock?: number;
	active?: boolean;
}

export interface ProductPatchInput {
	name?: string;
	slug?: string;
	description?: string;
	price?: number;
	currency?: string;
	category?: string;
	tags?: string[];
	stock?: number;
	active?: boolean;
}

const publishProductUpserted = async (product: ProductDocumentShape): Promise<void> => {
	await catalogEventBus.publish("catalog.product.upserted", product);
	await syncProductSearch(product);
};

export const createProductCommand = async (req: Request ): Promise<ProductDocumentShape> => {
	 const startedAt = Date.now();
	 const requestId = (req as RequestWithId).requestId;
	 const input: ProductInput = await <any>req.body;
	try
	{	
		const existing = await ProductModel.findOne({ slug: input.slug });
		if (existing) {
			throw new Error(`Product with slug "${input.slug}" already exists`);
		}
	    const product = await ProductModel.create({
			...input,
			currency: input.currency ?? "USD",
			tags: input.tags ?? [],
			stock: input.stock ?? 0,
			active: input.active ?? true
		});

		const mapped = mapProductDocument(product);
		await publishProductUpserted(mapped);
		return mapped;
   }catch(error){
	    logger.error("Create product failed", {
			requestId,
			path: req.path,
			durationMs: Date.now() - startedAt,
			error
		});
		throw error;

   }
   return new Promise((resolve) => resolve({} as ProductDocumentShape));
};

export const updateProductCommand = async (
	productId: string,
	patch: ProductPatchInput
): Promise<ProductDocumentShape | null> => {
	const product = await ProductModel.findByIdAndUpdate(productId, patch, {
		new: true,
		runValidators: true
	});

	if (!product) {
		return null;
	}

	const mapped = mapProductDocument(product);
	await publishProductUpserted(mapped);
	return mapped;
};

export const deleteProductCommand = async (productId: string): Promise<boolean> => {
	const product = await ProductModel.findByIdAndDelete(productId);

	if (!product) {
		return false;
	}

	await catalogEventBus.publish("catalog.product.deleted", { productId });
	await removeProductFromSearch(productId);
	return true;
};