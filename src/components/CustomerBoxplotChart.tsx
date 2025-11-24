import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface CustomerBoxplotChartProps {
  data: Array<{
    customer_id: number;
    total_products_purchased: number;
  }>;
}

export function CustomerBoxplotChart({ data }: CustomerBoxplotChartProps) {
  if (!data || data.length === 0) {
    return <p className="helper-text">No hay datos para mostrar.</p>;
  }

  // Calcular estadísticas para el boxplot
  const values = data
    .map((item) => item.total_products_purchased)
    .sort((a, b) => a - b);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const q1 = calculatePercentile(values, 25);
  const median = calculatePercentile(values, 50);
  const q3 = calculatePercentile(values, 75);

  const chartData = [
    {
      name: "Distribución",
      min,
      q1,
      median,
      q3,
      max,
    },
  ];

  return (
    <div className="chart-container">
      <p className="helper-text">
        Mostrando distribución de compras de los top {data.length} clientes.
        Mínimo: {min}, Q1: {q1.toFixed(0)}, Mediana: {median.toFixed(0)}, Q3:{" "}
        {q3.toFixed(0)}, Máximo: {max}
      </p>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                value: "Total Productos Comprados",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value: any) => value?.toLocaleString()} />
            <Legend />
            <Bar dataKey="min" fill="#94a3b8" name="Mínimo" />
            <Bar dataKey="q1" fill="#64748b" name="Q1 (25%)" />
            <Bar dataKey="median" fill="#2563eb" name="Mediana" />
            <Bar dataKey="q3" fill="#64748b" name="Q3 (75%)" />
            <Bar dataKey="max" fill="#94a3b8" name="Máximo" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla con los clientes individuales */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
          Ver detalle de los {data.length} clientes
        </summary>
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">Ranking</th>
                <th className="px-3 py-2 text-left">Customer ID</th>
                <th className="px-3 py-2 text-right">Total Productos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((customer, idx) => (
                <tr
                  key={customer.customer_id}
                  className="border-b border-slate-200"
                >
                  <td className="px-3 py-2">#{idx + 1}</td>
                  <td className="px-3 py-2">{customer.customer_id}</td>
                  <td className="px-3 py-2 text-right font-medium">
                    {customer.total_products_purchased.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function calculatePercentile(sorted: number[], percentile: number): number {
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
