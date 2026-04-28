# Real-time Analytics API

Mini analytics platform boilerplate modeled on your preferred project structure:

- root-level Express TypeScript backend with `controllers`, `routes`, `services`, `database`, `middlewares`, `utils`, `types`, `scripts`, and `tests`
- separate `client` React dashboard with feature folders that each contain `index.tsx`, `functions.tsx`, `models.tsx`, and `css/styles.module.css`
- Redis Streams based ingestion pipeline feeding PostgreSQL-backed aggregates
- Socket.io dashboard updates for live metrics

## Features

- `POST /track` event ingestion API
- `GET /metrics/dashboard` aggregated dashboard snapshot
- WebSocket broadcast channel for real-time dashboard updates
- IP, browser, OS, and device extraction from the incoming request
- hourly and daily aggregation queries in PostgreSQL
- local Docker setup for PostgreSQL and Redis

## Project Structure

```text
.
├── app.ts
├── index.ts
├── controllers/
├── routes/
├── services/
├── database/
├── middlewares/
├── utils/
├── types/
├── scripts/
├── tests/
├── client/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       ├── util/
│       └── types.ts
└── docker-compose.yml
```

## Quick Start

1. Copy `.env.example` to `.env`.
2. Install backend dependencies with `npm install`.
3. Install frontend dependencies with `npm install --prefix client`.
4. Start PostgreSQL and Redis with `docker compose up -d`.
5. Run the backend with `npm run dev`.
6. Run the dashboard with `npm run client:dev`.

## API Endpoints

- `POST /track`
- `GET /metrics/dashboard`
- `GET /health`

## Notes

- The current scaffold defaults to PostgreSQL for aggregation storage and Redis Streams for ingestion buffering.
- If you want a ClickHouse variant later, the current repository shape can absorb it by adding a second repository implementation under `database/`.
- The Redis worker is the lightweight Kafka-style layer in this starter. Replacing it with Kafka later is mostly a `services/eventQueue.ts` and `services/ingestionWorker.ts` concern.