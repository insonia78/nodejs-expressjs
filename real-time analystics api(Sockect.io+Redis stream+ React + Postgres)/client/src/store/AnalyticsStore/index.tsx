import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from "react";
import { useRealtimeMetrics } from "../../hooks/useRealtimeMetrics";
import { DashboardSnapshot } from "../../types";
import { createEmptySnapshot } from "./functions";
import { AnalyticsStoreContextValue } from "./models";

const AnalyticsStoreContext = createContext<AnalyticsStoreContextValue | null>(null);

export function AnalyticsStoreProvider({ children }: PropsWithChildren) {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(createEmptySnapshot());
  const [isConnected, setIsConnected] = useState(false);
  const realtimeMetrics = useRealtimeMetrics();

  useEffect(() => {
    if (realtimeMetrics.snapshot) {
      setSnapshot(realtimeMetrics.snapshot);
    }

    setIsConnected(realtimeMetrics.isConnected);
  }, [realtimeMetrics]);

  return (
    <AnalyticsStoreContext.Provider
      value={{ snapshot, isConnected, setSnapshot, setIsConnected }}
    >
      {children}
    </AnalyticsStoreContext.Provider>
  );
}

export const useAnalyticsStore = (): AnalyticsStoreContextValue => {
  const context = useContext(AnalyticsStoreContext);

  if (!context) {
    throw new Error("useAnalyticsStore must be used within AnalyticsStoreProvider");
  }

  return context;
};