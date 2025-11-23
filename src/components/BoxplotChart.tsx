import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { DistributionData } from '../types/pipelines';

interface BoxplotChartProps {
  data: DistributionData;
}

// Colores para cada métrica
const COLORS = ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444'];

export function BoxplotChart({ data }: BoxplotChartProps) {
  if (!data.data || data.data.length === 0) {
    return <p className="helper-text">No hay datos para mostrar.</p>;
  }

  // Si el formato es category_id, category_name, store_id, total_products_sold
  // Agrupar por categoría para el boxplot
  const groupedByCategory = data.data.reduce((acc, item) => {
    const categoryKey = item.category_name || `Categoría ${item.category_id}`;
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(item.total_products_sold || 0);
    return acc;
  }, {} as Record<string, number[]>);

  // Si el formato es metric_name, value (melt format)
  const hasMetricName = data.data[0]?.metric_name !== undefined;

  if (hasMetricName) {
    // Formato melt: mostrar distribución por métrica
    const groupedByMetric = data.data.reduce((acc, item) => {
      const metric = item.metric_name;
      if (!acc[metric]) {
        acc[metric] = [];
      }
      acc[metric].push(Number(item.value) || 0);
      return acc;
    }, {} as Record<string, number[]>);

    const chartData = Object.entries(groupedByMetric).map(([metric, values]) => ({
      metric,
      min: Math.min(...values),
      q1: calculatePercentile(values, 25),
      median: calculatePercentile(values, 50),
      q3: calculatePercentile(values, 75),
      max: Math.max(...values),
    }));

    return (
      <div className="chart-container">
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="min" fill="#94a3b8" name="Mínimo" />
              <Bar dataKey="q1" fill="#64748b" name="Q1" />
              <Bar dataKey="median" fill="#2563eb" name="Mediana" />
              <Bar dataKey="q3" fill="#64748b" name="Q3" />
              <Bar dataKey="max" fill="#94a3b8" name="Máximo" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Formato por categoría y tienda: crear datos para boxplot
  const chartData = Object.entries(groupedByCategory)
    .map(([category, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      return {
        category,
        min: Math.min(...sorted),
        q1: calculatePercentile(sorted, 25),
        median: calculatePercentile(sorted, 50),
        q3: calculatePercentile(sorted, 75),
        max: Math.max(...sorted),
        values: sorted, // Guardar para tooltip
      };
    })
    .sort((a, b) => b.median - a.median); // Ordenar por mediana descendente

  // Limitar a top 20 categorías para mejor visualización
  const limitedData = chartData.slice(0, 20);

  return (
    <div className="chart-container">
      <p className="helper-text">
        Mostrando top 20 categorías por mediana. Cada caja muestra: mínimo, Q1, mediana, Q3, máximo de las 4 tiendas.
      </p>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={limitedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              angle={-45}
              textAnchor="end"
              height={120}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis label={{ value: 'Total Productos Vendidos', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: any, name: string, props: any) => {
                if (name === 'values') {
                  return `Valores: [${props.payload.values.join(', ')}]`;
                }
                return value?.toLocaleString();
              }}
            />
            <Legend />
            <Bar dataKey="min" fill="transparent" />
            <Bar dataKey="q1" fill="#cbd5e1" name="Q1" />
            <Bar dataKey="median" fill="#2563eb" name="Mediana" />
            <Bar dataKey="q3" fill="#cbd5e1" name="Q3" />
            <Bar dataKey="max" fill="transparent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function calculatePercentile(sorted: number[], percentile: number): number {
  const sortedArr = [...sorted].sort((a, b) => a - b);
  const index = (percentile / 100) * (sortedArr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

