SELECT 'CREATE DATABASE analytics_db'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'analytics_db'
)\gexec

\connect analytics_db
