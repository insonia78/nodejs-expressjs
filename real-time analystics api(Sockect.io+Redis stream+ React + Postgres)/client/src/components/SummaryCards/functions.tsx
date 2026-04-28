import { SummaryCard } from "../../types";

export const formatCardValue = (card: SummaryCard): string => {
  return new Intl.NumberFormat().format(card.value);
};