import { AggregatePoint } from "../../types";

export const normalizeChartData = (data: AggregatePoint[]): AggregatePoint[] => {
  return data.map((point) => ({
    bucket: point.bucket,
    value: point.value
  }));
};