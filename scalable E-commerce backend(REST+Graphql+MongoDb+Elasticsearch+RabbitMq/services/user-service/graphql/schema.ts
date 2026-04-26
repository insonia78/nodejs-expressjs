import { buildSchema } from "graphql";

import { getUserById, listUsers, loginUser, registerUser } from "../services/authService";

export const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, role: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload
  }
`);

export const rootValue = {
	users: listUsers,
	user: ({ id }: { id: string }) => getUserById(id),
	register: ({ name, email, password, role }: { name: string; email: string; password: string; role?: "customer" | "admin" }) =>
		registerUser({ name, email, password, role }),
	login: ({ email, password }: { email: string; password: string }) => loginUser({ email, password })
};