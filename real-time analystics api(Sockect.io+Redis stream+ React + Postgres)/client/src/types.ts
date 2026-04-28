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