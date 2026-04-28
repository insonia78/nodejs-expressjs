import "dotenv/config";
import { Client } from "pg";
import { pool, ensureTables } from "../database/postgres";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5433/analytics_db";

const ensureDatabaseExists = async (): Promise<void> => {
  const url = new URL(DATABASE_URL);
  const targetDatabase = url.pathname.replace(/^\//, "") || "analytics_db";
  const safeDatabase = targetDatabase.replace(/[^a-zA-Z0-9_]/g, "");

  if (!safeDatabase) {
    throw new Error("Invalid database name in DATABASE_URL");
  }

  // Connect to the maintenance database first so we can create the target DB when missing.
  url.pathname = "/postgres";
  const adminClient = new Client({ connectionString: url.toString() });

  await adminClient.connect();

  try {
    const check = await adminClient.query<{ exists: number }>(
      "SELECT 1 AS exists FROM pg_database WHERE datname = $1",
      [safeDatabase]
    );

    if (check.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE \"${safeDatabase}\"`);
      console.log(`Database '${safeDatabase}' created`);
    }
  } finally {
    await adminClient.end();
  }
};

const run = async (): Promise<void> => {
  await ensureDatabaseExists();
  await ensureTables();
  await pool.end();
  console.log("Database schema ensured");
};

void run().catch((error) => {
  console.error(error);
  process.exit(1);
});