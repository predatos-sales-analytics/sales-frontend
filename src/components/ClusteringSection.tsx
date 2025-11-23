import { useJsonData } from '../hooks/usePipelineData';
import { DataTable } from './DataTable';
import type { ClusteringData, ClusteringVisualization, ClusterProfile } from '../types/pipelines';

export function ClusteringSection() {
  const clusterSummary = useJsonData<ClusteringData>({
    path: 'advanced/clustering/cluster_summary.json',
  });
  const clusteringViz = useJsonData<ClusteringVisualization>({
    path: 'advanced/clustering/clustering_visualization.json',
  });

  if (clusterSummary.loading) {
    return (
      <section className="section">
        <h2>Segmentación de Clientes</h2>
        <p className="helper-text">Cargando datos...</p>
      </section>
    );
  }

  if (clusterSummary.error) {
    return (
      <section className="section">
        <h2>Segmentación de Clientes</h2>
        <p className="helper-text error">{clusterSummary.error}</p>
      </section>
    );
  }

  const profiles = clusterSummary.data?.cluster_profiles || {};

  return (
    <section className="section">
      <div className="section-header">
        <p className="eyebrow">Análisis Avanzado</p>
        <h2>Segmentación de Clientes (K-Means)</h2>
      </div>

      {Object.values(profiles).map((profile: ClusterProfile) => (
        <div key={profile.cluster_id} className="cluster-card">
          <div className="cluster-header">
            <h3>
              Cluster {profile.cluster_id}: {profile.label}
            </h3>
            <span className="badge">
              {profile.n_customers.toLocaleString()} clientes ({profile.percentage.toFixed(1)}%)
            </span>
          </div>

          <p className="cluster-description">{profile.description}</p>

          <div className="cluster-metrics">
            <div className="metric-item">
              <span className="metric-label">Frecuencia promedio</span>
              <span className="metric-value">{profile.metrics.avg_frequency.toFixed(1)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Productos distintos</span>
              <span className="metric-value">{profile.metrics.avg_unique_products.toFixed(1)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Volumen total</span>
              <span className="metric-value">{profile.metrics.avg_total_volume.toFixed(1)}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Categorías distintas</span>
              <span className="metric-value">{profile.metrics.avg_unique_categories.toFixed(1)}</span>
            </div>
          </div>

          <div className="recommendations">
            <h4>Recomendaciones de Negocio:</h4>
            <ul>
              {profile.business_recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {clusteringViz.data && (
        <div className="subsection">
          <h3>Distribución de Clusters</h3>
          <DataTable
            columns={['cluster', 'n_customers', 'avg_frequency', 'avg_unique_products', 'avg_total_volume']}
            rows={clusteringViz.data.visualization_data.cluster_statistics || []}
          />
        </div>
      )}
    </section>
  );
}

