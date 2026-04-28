import { AggregatePoint, SummaryCard, TopPage, TrackedEvent } from "../types/analytics";
import { pool } from "./postgres";

export const insertTrackedEvent = async (event: TrackedEvent): Promise<void> => {
  await pool.query(
    `
      INSERT INTO tracked_events (
        id, event_name, path, site, referrer, visitor_id, session_id, ip_address,
        user_agent, device_type, device_vendor, browser, os, metadata, occurred_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15
      )
    `,
    [
      event.id,
      event.event,
      event.path,
      event.site,
      event.referrer ?? null,
      event.visitorId,
      event.sessionId,
      event.ipAddress,
      event.userAgent,
      event.deviceType,
      event.deviceVendor,
      event.browser,
      event.os,
      JSON.stringify(event.metadata),
      event.timestamp
    ]
  );
};

export const getVisitorSummary = async (): Promise<SummaryCard[]> => {
  const result = await pool.query(`
    SELECT 'Total events' AS label, COUNT(*)::INT AS value FROM tracked_events
    UNION ALL
    SELECT 'Unique visitors' AS label, COUNT(DISTINCT visitor_id)::INT AS value FROM tracked_events
    UNION ALL
    SELECT 'Active sessions' AS label, COUNT(DISTINCT session_id)::INT AS value FROM tracked_events
    UNION ALL
    SELECT 'Tracked pages' AS label, COUNT(DISTINCT path)::INT AS value FROM tracked_events
  `);

  return result.rows as SummaryCard[];
};

export const getTopPages = async (): Promise<TopPage[]> => {
  const result = await pool.query(`
    SELECT path, COUNT(*)::INT AS views
    FROM tracked_events
    GROUP BY path
    ORDER BY views DESC
    LIMIT 6
  `);

  return result.rows as TopPage[];
};

export const getTrafficBreakdown = async (
  column: "device_type" | "browser" | "os"
): Promise<AggregatePoint[]> => {
  const result = await pool.query(`
    SELECT COALESCE(${column}, 'unknown') AS bucket, COUNT(*)::INT AS value
    FROM tracked_events
    GROUP BY bucket
    ORDER BY value DESC
    LIMIT 8
  `);

  return result.rows as AggregatePoint[];
};

export const getHourlyStats = async (): Promise<AggregatePoint[]> => {
  const result = await pool.query(`
    SELECT TO_CHAR(DATE_TRUNC('hour', occurred_at), 'HH24:00') AS bucket, COUNT(*)::INT AS value
    FROM tracked_events
    WHERE occurred_at >= NOW() - INTERVAL '24 hours'
    GROUP BY DATE_TRUNC('hour', occurred_at)
    ORDER BY DATE_TRUNC('hour', occurred_at)
  `);

  return result.rows as AggregatePoint[];
};

export const getDailyStats = async (): Promise<AggregatePoint[]> => {
  const result = await pool.query(`
    SELECT TO_CHAR(DATE_TRUNC('day', occurred_at), 'YYYY-MM-DD') AS bucket, COUNT(*)::INT AS value
    FROM tracked_events
    WHERE occurred_at >= NOW() - INTERVAL '7 days'
    GROUP BY DATE_TRUNC('day', occurred_at)
    ORDER BY DATE_TRUNC('day', occurred_at)
  `);

  return result.rows as AggregatePoint[];
};