# Scalable E-commerce Backend

Microservice-based online store backend built with Express.js, TypeScript, MongoDB, Redis, RabbitMQ, and an optional Elasticsearch search layer. The gateway exposes both REST and GraphQL, while the internal services stay independently deployable.

## Services

- `api-gateway`: public entrypoint, REST proxy, GraphQL aggregation
- `catalog-service`: product CRUD, filtering, search indexing
- `cart-service`: Redis-backed cart storage and checkout initiation
- `order-service`: order lifecycle and CQRS-style command/query split
- `payment-service`: mock-first Stripe-capable payment processing
- `inventory-service`: stock records and order-driven inventory updates
- `user-service`: registration, login, JWT issuance

## Architecture Notes

- REST + GraphQL mix: direct REST routes for operational endpoints plus a unified GraphQL endpoint at the gateway
- Event-driven flow: `cart.checkout.requested` -> `order.created` -> `payment.completed` / `inventory.rejected`
- CQRS-style structure: commands and queries are separated inside the catalog and order services
- Search: catalog updates can be pushed to Elasticsearch when `ELASTICSEARCH_NODE` is configured
- Redis: cart service prefers Redis and falls back to in-memory storage for local development

## Quick Start

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Install dependencies with `npm install`.
3. Start the full stack with `docker compose up --build -d`.
4. Seed sample data with `npm run seed`.
5. Or run services directly in separate terminals:
   - `npm run dev:gateway`
   - `npm run dev:catalog`
   - `npm run dev:cart`
   - `npm run dev:orders`
   - `npm run dev:payments`
   - `npm run dev:inventory`
   - `npm run dev:users`
6. Run API tests with `npm test`.

## Core Endpoints

- Gateway REST base: `http://localhost:4000/api`
- Gateway GraphQL: `POST http://localhost:4000/graphql`
- Catalog REST: `GET /api/catalog/products`
- Cart REST: `POST /api/cart/cart/items`
- Checkout REST: `POST /api/cart/cart/checkout`
- Orders REST: `PATCH /api/orders/orders/:id/status`
- Users auth REST: `POST /api/users/auth/login`

## Example GraphQL Operations

```graphql
query Products {
  products(category: "electronics", search: "headphones") {
    id
    name
    price
    stock
  }
}
```

```graphql
mutation Register {
  register(name: "Ada", email: "ada@example.com", password: "secret123") {
    token
    user {
      id
      email
    }
  }
}
```

```graphql
mutation Checkout {
  checkout(userId: "user_123")
}
```

## Stripe Note

The default payment path is mock-first so the event flow works immediately. Setting `USE_STRIPE=true` switches payment creation to Stripe Payment Intents. For a production-grade Stripe flow, add webhook confirmation handling before moving beyond local/test usage.

## Seed Data

The seed script creates:

- one admin user and one customer user
- four products across multiple categories
- aligned inventory records for those products

Run it after MongoDB is available with `npm run seed`.