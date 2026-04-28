import { NumberFormatterOptions } from "./models";

export const formatNumber = (
  value: number,
  options: NumberFormatterOptions = {}
): string => {
  return new Intl.NumberFormat(undefined, {
    notation: options.compact ? "compact" : "standard",
    maximumFractionDigits: options.compact ? 1 : 0
  }).format(value);
};