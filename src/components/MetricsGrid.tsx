interface MetricItem {
  id: string;
  label: string;
  value: string | number | null;
  suffix?: string;
}

interface MetricsGridProps {
  metrics: MetricItem[];
}

const formatValue = (value: string | number | null) => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') {
    return value % 1 === 0 ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return value;
};

export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics.length) {
    return <p className="helper-text">No hay métricas para mostrar.</p>;
  }

  return (
    <div className="metrics-grid">
      {metrics.map((metric) => (
        <div key={metric.id} className="metric-card">
          <span className="metric-label">{metric.label}</span>
          <span className="metric-value">
            {formatValue(metric.value)}
            {metric.suffix ? <small>{metric.suffix}</small> : null}
          </span>
        </div>
      ))}
    </div>
  );
}









