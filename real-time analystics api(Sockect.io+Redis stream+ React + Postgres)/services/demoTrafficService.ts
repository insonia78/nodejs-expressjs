import { v4 as uuidv4 } from "uuid";
import { enqueueEvent } from "./eventQueue";
import { TrackedEvent } from "../types/analytics";

let demoInterval: NodeJS.Timeout | null = null;

const samplePaths = ["/", "/pricing", "/features", "/docs", "/checkout"];
const sampleReferrers = ["https://google.com", "https://bing.com", "https://github.com", "direct"];

const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const createDemoEvent = (): TrackedEvent => {
  const sessionId = uuidv4();

  return {
    id: uuidv4(),
    event: "page_view",
    path: randomItem(samplePaths),
    site: "demo-site",
    referrer: randomItem(sampleReferrers),
    visitorId: uuidv4(),
    sessionId,
    ipAddress: "127.0.0.1",
    userAgent: "analytics-demo-bot",
    deviceType: "desktop",
    deviceVendor: "demo",
    browser: "demo-browser",
    os: "demo-os",
    metadata: {
      source: "demo-traffic"
    },
    timestamp: new Date().toISOString()
  };
};

export const startDemoTraffic = (): void => {
  const enabled = (process.env.ENABLE_DEMO_TRAFFIC ?? "true").toLowerCase() === "true";

  if (!enabled || demoInterval) {
    return;
  }

  const intervalMs = Number(process.env.DEMO_TRAFFIC_INTERVAL_MS ?? 3000);

  demoInterval = setInterval(() => {
    void enqueueEvent(createDemoEvent()).catch(() => undefined);
  }, intervalMs);
};
