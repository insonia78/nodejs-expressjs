import { calculatePercentage } from "./functions";
import { DeviceBreakdownProps } from "./models";
import styles from "./css/styles.module.css";

export default function DeviceBreakdown({ items }: DeviceBreakdownProps) {
  return (
    <article className={styles.panel}>
      <h2>Device mix</h2>
      <div className={styles.stack}>
        {items.map((item) => (
          <div className={styles.row} key={item.bucket}>
            <span>{item.bucket}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${calculatePercentage(item, items)}%` }}
              />
            </div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}