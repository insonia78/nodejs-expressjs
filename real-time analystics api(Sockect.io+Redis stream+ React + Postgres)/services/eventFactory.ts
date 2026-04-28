import { Request } from "express";
import { UAParser } from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";
import { TrackedEvent } from "../types/analytics";

export const buildTrackedEvent = (req: Request): TrackedEvent => {
  const payload = req.body as Record<string, unknown>;
  const parser = new UAParser(req.get("user-agent") ?? "");
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const operatingSystem = parser.getOS();

  return {
    id: uuidv4(),
    event: String(payload.event),
    path: String(payload.path),
    site: typeof payload.site === "string" ? payload.site : "default-site",
    referrer: typeof payload.referrer === "string" ? payload.referrer : undefined,
    visitorId:
      typeof payload.visitorId === "string" && payload.visitorId.length > 0
        ? payload.visitorId
        : uuidv4(),
    sessionId:
      typeof payload.sessionId === "string" && payload.sessionId.length > 0
        ? payload.sessionId
        : uuidv4(),
    ipAddress: req.ip ?? "unknown",
    userAgent: req.get("user-agent") ?? "unknown",
    deviceType: device.type ?? "desktop",
    deviceVendor: device.vendor ?? "unknown",
    browser: browser.name ?? "unknown",
    os: operatingSystem.name ?? "unknown",
    metadata:
      typeof payload.metadata === "object" && payload.metadata !== null
        ? (payload.metadata as Record<string, unknown>)
        : {},
    timestamp: new Date().toISOString()
  };
};