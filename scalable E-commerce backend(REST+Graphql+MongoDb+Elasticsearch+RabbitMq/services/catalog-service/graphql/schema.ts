import { buildSchema } from "graphql";

import { createProductCommand, deleteProductCommand, updateProductCommand } from "../commands/createProduct";
import { getProductByIdQuery, listProductsQuery } from "../queries/searchProducts";

export const schema = buildSchema(`
  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String!
    price: Float!
    currency: String!
    category: String!
    tags: [String!]!
    stock: Int!
    active: Boolean!
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    name: String!
    slug: String!
    description: String!
    price: Float!
    currency: String
    category: String!
    tags: [String!]
    stock: Int
    active: Boolean
  }

  input ProductPatchInput {
    name: String
    slug: String
    description: String
    price: Float
    currency: String
    category: String
    tags: [String!]
    stock: Int
    active: Boolean
  }

  type Query {
    products(category: String, minPrice: Float, maxPrice: Float, search: String, active: Boolean): [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductPatchInput!): Product
    deleteProduct(id: ID!): Boolean!
  }
`);

export const rootValue = {
	products: listProductsQuery,
	product: ({ id }: { id: string }) => getProductByIdQuery(id),
	createProduct: ({ input }: { input: Parameters<typeof createProductCommand>[0] }) => createProductCommand(input),
	updateProduct: ({ id, input }: { id: string; input: Parameters<typeof updateProductCommand>[1] }) =>
		updateProductCommand(id, input),
	deleteProduct: ({ id }: { id: string }) => deleteProductCommand(id)
};