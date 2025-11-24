import { useJsonData } from "../hooks/usePipelineData";
import { DataTable } from "./DataTable";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ZAxis,
} from "recharts";
import type {
  ClusteringData,
  ClusteringVisualization,
  ClusterProfile,
} from "../types/pipelines";

const CLUSTER_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

type CustomerClusterData = {
  n_clusters: number;
  total_customers: number;
  sample_assignments: Array<{
    customer_id: number;
    frequency: number;
    unique_products: number;
    total_volume: number;
    unique_categories: number;
    cluster: number;
  }>;
};

export function ClusteringSection() {
  const clusterSummary = useJsonData<ClusteringData>({
    path: "advanced/clustering/cluster_summary.json",
  });
  const clusteringViz = useJsonData<ClusteringVisualization>({
    path: "advanced/clustering/clustering_visualization.json",
  });
  const customerClusters = useJsonData<CustomerClusterData>({
    path: "advanced/clustering/customer_clusters.json",
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
              {profile.n_customers.toLocaleString()} clientes (
              {profile.percentage.toFixed(1)}%)
            </span>
          </div>

          <p className="cluster-description">{profile.description}</p>

          <div className="cluster-metrics">
            <div className="metric-item">
              <span className="metric-label">Frecuencia promedio</span>
              <span className="metric-value">
                {profile.metrics.avg_frequency.toFixed(1)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Productos distintos</span>
              <span className="metric-value">
                {profile.metrics.avg_unique_products.toFixed(1)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Volumen total</span>
              <span className="metric-value">
                {profile.metrics.avg_total_volume.toFixed(1)}
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Categorías distintas</span>
              <span className="metric-value">
                {profile.metrics.avg_unique_categories.toFixed(1)}
              </span>
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
        <>
          <div className="subsection flex flex-col gap-6">
            <h3>Visualización de Clusters</h3>

            {/* Scatter plot - Clasificación por puntos individuales */}
            {customerClusters.data && (
              <div className="chart-container">
                <h4 className="text-base font-semibold mb-2">
                  Clasificación K-Means: Frecuencia vs Volumen Total
                </h4>
                <ResponsiveContainer width="100%" height={500}>
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="frequency"
                      name="Frecuencia"
                      label={{
                        value: "Frecuencia de Compra",
                        position: "insideBottom",
                        offset: -10,
                        style: { fontSize: 14, fontWeight: 600 },
                      }}
                      domain={[0, "auto"]}
                    />
                    <YAxis
                      type="number"
                      dataKey="total_volume"
                      name="Volumen"
                      label={{
                        value: "Volumen Total de Productos",
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 14, fontWeight: 600 },
                      }}
                      domain={[0, "auto"]}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-slate-200 rounded shadow-lg">
                              <p className="font-semibold text-sm">
                                Cliente #{data.customer_id}
                              </p>
                              <p className="text-xs text-slate-600">
                                Cluster {data.cluster}:{" "}
                                {
                                  clusteringViz.data.visualization_data
                                    .cluster_labels[data.cluster]
                                }
                              </p>
                              <div className="mt-1 space-y-0.5">
                                <p className="text-xs">
                                  Frecuencia: {data.frequency}
                                </p>
                                <p className="text-xs">
                                  Volumen: {data.total_volume}
                                </p>
                                <p className="text-xs">
                                  Productos únicos: {data.unique_products}
                                </p>
                                <p className="text-xs">
                                  Categorías: {data.unique_categories}
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ fontSize: 13 }}
                    />
                    {[0, 1, 2, 3].map((clusterId) => {
                      const clusterData =
                        customerClusters.data.sample_assignments.filter(
                          (c) => c.cluster === clusterId
                        );
                      return (
                        <Scatter
                          key={`cluster-${clusterId}`}
                          name={`Cluster ${clusterId}: ${clusteringViz.data.visualization_data.cluster_labels[clusterId]}`}
                          data={clusterData}
                          fill={CLUSTER_COLORS[clusterId]}
                          fillOpacity={0.6}
                          shape="circle"
                        />
                      );
                    })}
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-sm text-slate-600 mt-2">
                  * Muestra de{" "}
                  {customerClusters.data.sample_assignments.length.toLocaleString()}{" "}
                  clientes de{" "}
                  {customerClusters.data.total_customers.toLocaleString()}{" "}
                  totales
                </p>
              </div>
            )}

            {/* Gráfico de pastel - Distribución de clientes */}
            <div className="chart-container">
              <h4 className="text-base font-semibold mb-2">
                Distribución de Clientes por Cluster
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(
                      clusteringViz.data.visualization_data.distribution
                    ).map(([cluster, count]) => ({
                      name: `Cluster ${cluster}: ${clusteringViz.data.visualization_data.cluster_labels[cluster]}`,
                      value: count,
                      cluster: parseInt(cluster),
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(1)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.keys(
                      clusteringViz.data.visualization_data.distribution
                    ).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CLUSTER_COLORS[index % CLUSTER_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="subsection">
            <h3>Tabla de Estadísticas por Cluster</h3>
            <DataTable
              columns={[
                "cluster",
                "n_customers",
                "avg_frequency",
                "avg_unique_products",
                "avg_total_volume",
              ]}
              rows={
                clusteringViz.data.visualization_data.cluster_statistics || []
              }
            />
          </div>
        </>
      )}
    </section>
  );
}
