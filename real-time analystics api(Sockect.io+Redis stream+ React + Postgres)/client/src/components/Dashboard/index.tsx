import DeviceBreakdown from "../DeviceBreakdown";
import MetricsChart from "../MetricsChart";
import SummaryCards from "../SummaryCards";
import TopPages from "../TopPages";
import { buildDashboardTitle } from "./functions";
import { DashboardProps } from "./models";
import styles from "./css/styles.module.css";
import { useAnalyticsStore } from "../../store/AnalyticsStore";

function Dashboard({ snapshot, isConnected }: DashboardProps) {
  return (
    <main className={styles.dashboard}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Realtime analystics</p>
          <h1>Track events like a mini analytics suite.</h1>
          <p className={styles.subtitle}>{buildDashboardTitle(snapshot)}</p>
        </div>
        <div className={styles.connectionBadge} data-live={isConnected}>
          {isConnected ? "Live stream connected" : "Connecting..."}
        </div>
      </section>
      <SummaryCards summary={snapshot?.summary ?? []} />
      <section className={styles.grid}>
        <MetricsChart title="Hourly activity" data={snapshot?.hourly ?? []} />
        <MetricsChart title="Daily activity" data={snapshot?.daily ?? []} />
        <TopPages pages={snapshot?.topPages ?? []} />
        <DeviceBreakdown items={snapshot?.deviceBreakdown ?? []} />
      </section>
    </main>
  );
}

export default function DashboardContainer() {
  const { snapshot, isConnected } = useAnalyticsStore();
  return <Dashboard snapshot={snapshot} isConnected={isConnected} />;
}