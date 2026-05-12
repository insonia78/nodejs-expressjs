# Node.js Backend Training Workspace

This workspace contains three TypeScript backend projects focused on modern API patterns, real-time data, and distributed architecture.

## Projects

### 1) Multi-tenant SaaS Platform
Folder: `multi-tentant-saas-platform(REST+Graphql+Sequilize+Redis+Postgres)`

Tech highlights:
- Express + TypeScript
- REST and GraphQL APIs
- Sequelize + PostgreSQL
- Redis caching
- Vitest test suite

### 2) Real-time Analytics API
Folder: `real-time analystics api(Sockect.io+Redis stream+ React + Postgres)`

Tech highlights:
- Express + TypeScript
- Socket.IO for realtime updates
- Redis Streams for event ingestion
- PostgreSQL for persistence
- React client app in `client/`

### 3) Scalable E-commerce Backend
Folder: `scalable E-commerce backend(REST+Graphql+MongoDb+Elasticsearch+RabbitMq`

Tech highlights:
- Microservices architecture
- REST + GraphQL gateway patterns
- MongoDB, Elasticsearch, RabbitMQ
- Docker and docker-compose
- End-to-end and service-level tests

## Prerequisites

Install before running projects:
- Node.js 20+ (or latest LTS)
- npm 10+
- Docker Desktop (for services like Postgres, Redis, MongoDB, Elasticsearch, RabbitMQ)

## Quick Start

Run each project independently.

1. Open a terminal
2. Move into one project folder
3. Install dependencies
4. Start required infrastructure (if needed)
5. Run dev server and tests

Example flow:

```bash
cd "multi-tentant-saas-platform(REST+Graphql+Sequilize+Redis+Postgres)"
npm install
npm run dev
npm test
```

## Suggested Commands by Project

Because scripts may differ, check each project's `package.json` for exact names. Common scripts are:
- `npm run dev`
- `npm run build`
- `npm start`
- `npm test`

## Notes

- Folder names contain spaces and special characters, so wrap paths in quotes in terminal commands.
- If database or cache connection errors appear, start supporting services with Docker first.
- Seed scripts are available in `scripts/` folders for test data setup.

## Learning Goals

Use this workspace to practice:
- API design with REST and GraphQL
- Tenant-aware backend design
- Event-driven and realtime processing
- Microservice communication and scaling
- Integration and end-to-end testing
