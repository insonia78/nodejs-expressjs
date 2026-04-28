import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { normalizeChartData } from "./functions";
import { MetricsChartProps } from "./models";
import styles from "./css/styles.module.css";

export default function MetricsChart({ title, data }: MetricsChartProps) {
  return (
    <article className={styles.panel}>
      <header className={styles.header}>
        <h2>{title}</h2>
      </header>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={normalizeChartData(data)}>
            <defs>
              <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d28c2c" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#d28c2c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="bucket" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#9b5a00" fill="url(#trafficFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}