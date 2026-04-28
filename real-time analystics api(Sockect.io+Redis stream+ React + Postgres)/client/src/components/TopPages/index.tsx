import { sortPages } from "./functions";
import { TopPagesProps } from "./models";
import styles from "./css/styles.module.css";

export default function TopPages({ pages }: TopPagesProps) {
  return (
    <article className={styles.panel}>
      <h2>Top pages</h2>
      <ul className={styles.list}>
        {sortPages(pages).map((page) => (
          <li key={page.path}>
            <span>{page.path}</span>
            <strong>{page.views}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}