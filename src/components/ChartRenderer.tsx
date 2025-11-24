import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { VisualizationHint } from '../types/analytics';

interface ChartRendererProps {
  rows: Array<Record<string, unknown>>;
  config?: VisualizationHint;
}

export function ChartRenderer({ rows, config }: ChartRendererProps) {
  if (!config || !config.type || !rows.length || !config.x_field || !config.y_field) {
    return null;
  }

  const numericRows = rows
    .map((row) => ({
      ...row,
      [config.y_field as string]: Number(row[config.y_field as string]),
    }))
    .filter((row) => Number.isFinite(row[config.y_field as string] as number));

  if (!numericRows.length) {
    return null;
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={260}>
        {config.type === 'line' ? (
          <LineChart data={numericRows} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.x_field} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={config.y_field} stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={numericRows} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.x_field} />
            <YAxis />
            <Tooltip />
            <Bar dataKey={config.y_field} fill="#0ea5e9" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}









