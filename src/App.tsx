import './App.css';
import { DagSelector } from './components/DagSelector';
import { ArtifactCard } from './components/ArtifactCard';
import { useAnalyticsData } from './hooks/useAnalyticsData';

function App() {
  const { dagOptions, manifest, selectedDag, setSelectedDag, basePath, loading, error } = useAnalyticsData();

  return (
    <div className="app-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Sales Analytics</p>
          <h1>Resultados de Airflow</h1>
          <p className="subtitle">Monitorea los KPIs calculados por los DAGs de análisis.</p>
        </div>
        <DagSelector dags={dagOptions} selected={selectedDag} onChange={setSelectedDag} />
      </header>

      {error ? <div className="alert error">{error}</div> : null}
      {loading ? <div className="alert">Cargando datos...</div> : null}

      {manifest ? (
        manifest.tasks.map((task) => (
          <section key={task.task_id} className="task-section">
            <div className="task-header">
              <div>
                <p className="eyebrow">Tarea</p>
                <h2>{task.task_id.replaceAll('_', ' ')}</h2>
              </div>
              <span className="badge">{task.artifacts.length} artefactos</span>
            </div>
            <div className="artifacts-grid">
              {task.artifacts.map((artifact) => (
                <ArtifactCard key={`${task.task_id}-${artifact.artifact_id}`} meta={artifact} basePath={basePath} />
              ))}
            </div>
          </section>
        ))
      ) : (
        !loading && <EmptyState />
      )}
    </div>
  );
}

const EmptyState = () => (
  <div className="empty-state">
    <h2>Sin datos sincronizados</h2>
    <p>
      Asegúrate de ejecutar los DAGs en Airflow y copiar el contenido de <code>airflow/output/dashboard</code> hacia{' '}
      <code>sales-frontend/public/data</code>.
    </p>
  </div>
);

export default App;
