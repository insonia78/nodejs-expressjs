import { AggregatePoint } from "../../types";

export const calculatePercentage = (
  item: AggregatePoint,
  allItems: AggregatePoint[]
): number => {
  const total = allItems.reduce((sum, current) => sum + current.value, 0);
  if (total === 0) {
    return 0;
  }

  return Math.round((item.value / total) * 100);
};