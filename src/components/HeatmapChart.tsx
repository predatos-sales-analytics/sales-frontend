import type { HeatmapData, CorrelationMatrix } from '../types/pipelines';

interface HeatmapChartProps {
  data: HeatmapData | CorrelationMatrix;
  type: 'correlation' | 'category_performance';
}

export function HeatmapChart({ data, type }: HeatmapChartProps) {
  if (type === 'correlation') {
    const correlationData = data as CorrelationMatrix;
    const matrix = correlationData.correlation_data.matrix;
    const variables = correlationData.correlation_data.variables;
    const variableNames = correlationData.correlation_data.variable_names;

    return (
      <div className="heatmap-container">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th></th>
              {variables.map((v) => (
                <th key={v}>{variableNames[v] || v}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variables.map((var1) => (
              <tr key={var1}>
                <td className="heatmap-row-label">{variableNames[var1] || var1}</td>
                {variables.map((var2) => {
                  const value = matrix[var1]?.[var2];
                  const opacity = value ? Math.abs(value) : 0;
                  const color = value && value > 0 ? '#2563eb' : '#ef4444';
                  return (
                    <td
                      key={var2}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: `rgba(${value && value > 0 ? '37, 99, 235' : '239, 68, 68'}, ${opacity})`,
                        color: opacity > 0.5 ? 'white' : '#0f172a',
                      }}
                    >
                      {value?.toFixed(2) || '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Category performance heatmap
  const heatmapData = data as HeatmapData;
  const categories = heatmapData.data.categories || [];
  const metrics = heatmapData.data.metrics || [];

  return (
    <div className="heatmap-container">
      <table className="heatmap-table">
        <thead>
          <tr>
            <th>Categoría</th>
            {metrics.map((m) => (
              <th key={m}>{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.category_id}>
              <td className="heatmap-row-label">{cat.category_name}</td>
              {metrics.map((metric) => {
                const value = cat.values[metric] || 0;
                return (
                  <td
                    key={metric}
                    className="heatmap-cell"
                    style={{
                      backgroundColor: `rgba(37, 99, 235, ${value})`,
                      color: value > 0.5 ? 'white' : '#0f172a',
                    }}
                  >
                    {value.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

