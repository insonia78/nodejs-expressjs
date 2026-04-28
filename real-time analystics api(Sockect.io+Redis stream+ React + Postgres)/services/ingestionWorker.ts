import { insertTrackedEvent } from "../database/eventsRepository";
import { TrackedEvent } from "../types/analytics";
import { getRedisClient } from "../utils/redis";
import { getMetricsSnapshot } from "./metricsService";
import { broadcastMetrics } from "./realtimeService";

let workerStarted = false;

export const startEventWorker = async (): Promise<void> => {
  if (workerStarted) {
    return;
  }

  workerStarted = true;
  const redis = getRedisClient();
  const streamKey = process.env.REDIS_STREAM_KEY ?? "analytics:events";
  let cursor = "0-0";

  const consume = async (): Promise<void> => {
    while (true) {
      const response = await redis.xread("BLOCK", 5000, "STREAMS", streamKey, cursor);

      if (!response) {
        continue;
      }

      for (const stream of response) {
        const [, items] = stream;

        for (const [messageId, fields] of items) {
          cursor = messageId;
          const rawPayloadIndex = fields.findIndex((field) => field === "payload");
          const rawPayload = rawPayloadIndex >= 0 ? fields[rawPayloadIndex + 1] : undefined;

          if (!rawPayload) {
            continue;
          }

          const event = JSON.parse(rawPayload) as TrackedEvent;
          await insertTrackedEvent(event);
        }
      }

      const snapshot = await getMetricsSnapshot();
      broadcastMetrics(snapshot);
    }
  };

  void consume();
};