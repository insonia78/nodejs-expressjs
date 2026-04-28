export interface TrackedEvent {
  id: string;
  event: string;
  path: string;
  site: string;
  referrer?: string;
  visitorId: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  deviceVendor: string;
  browser: string;
  os: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface SummaryCard {
  label: string;
  value: number;
}

export interface TopPage {
  path: string;
  views: number;
}

export interface AggregatePoint {
  bucket: string;
  value: number;
}

export interface DashboardSnapshot {
  summary: SummaryCard[];
  topPages: TopPage[];
  deviceBreakdown: AggregatePoint[];
  hourly: AggregatePoint[];
  daily: AggregatePoint[];
  generatedAt: string;
}