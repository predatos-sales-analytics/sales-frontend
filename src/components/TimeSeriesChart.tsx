import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { TimeSeriesData } from '../types/pipelines';

interface TimeSeriesChartProps {
  data: TimeSeriesData;
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  if (!data.data || data.data.length === 0) {
    return <p className="helper-text">No hay datos para mostrar.</p>;
  }

  const chartData = data.data.map((item) => ({
    ...item,
    [data.value_column]: Number(item[data.value_column]) || 0,
  }));

  return (
    <div className="chart-container">
      {data.statistics && (
        <div className="statistics-summary">
          <span>Promedio: {data.statistics.promedio?.toLocaleString() || 'N/A'}</span>
          <span>Mín: {data.statistics.minimo?.toLocaleString() || 'N/A'}</span>
          <span>Máx: {data.statistics.maximo?.toLocaleString() || 'N/A'}</span>
        </div>
      )}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={data.date_column} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={data.value_column}
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name={data.series_name}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

