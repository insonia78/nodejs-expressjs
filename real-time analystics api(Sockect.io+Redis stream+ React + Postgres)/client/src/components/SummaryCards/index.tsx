import { formatCardValue } from "./functions";
import { SummaryCardsProps } from "./models";
import styles from "./css/styles.module.css";

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className={styles.cards}>
      {summary.map((card) => (
        <article className={styles.card} key={card.label}>
          <span>{card.label}</span>
          <strong>{formatCardValue(card)}</strong>
        </article>
      ))}
    </section>
  );
}