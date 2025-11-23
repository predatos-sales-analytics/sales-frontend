import './App.css';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ClusteringSection } from './components/ClusteringSection';

function App() {
  return (
    <div className="app-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Sales Analytics</p>
          <h1>Dashboard de Análisis de Ventas</h1>
          <p className="subtitle">
            Visualización de resultados generados por los pipelines de Spark.
          </p>
        </div>
      </header>

      <ExecutiveSummarySection />
      <AnalyticsSection />
      <ClusteringSection />
    </div>
  );
}

export default App;
