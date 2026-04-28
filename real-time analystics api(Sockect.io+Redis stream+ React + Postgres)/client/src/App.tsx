import Dashboard from "./components/Dashboard";
import { AnalyticsStoreProvider } from "./store/AnalyticsStore";

function App() {
  return (
    <AnalyticsStoreProvider>
      <Dashboard />
    </AnalyticsStoreProvider>
  );
}

export default App;