import { useJsonData } from "../hooks/usePipelineData";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { BoxplotChart } from "./BoxplotChart";
import { CustomerBoxplotChart } from "./CustomerBoxplotChart";
import { HeatmapChart } from "./HeatmapChart";
import { useMemo } from "react";
import type {
  TimeSeriesData,
  DistributionData,
  CorrelationMatrix,
} from "../types/pipelines";

export function AnalyticsSection() {
  const dailySales = useJsonData<TimeSeriesData>({
    path: "analytics/daily_sales.json",
  });
  const weeklySales = useJsonData<TimeSeriesData>({
    path: "analytics/weekly_sales.json",
  });
  const monthlySales = useJsonData<TimeSeriesData>({
    path: "analytics/monthly_sales.json",
  });
  const dayOfWeek = useJsonData<DistributionData>({
    path: "analytics/day_of_week_patterns_distribution.json",
  });
  const categoryBoxplot = useJsonData<DistributionData>({
    path: "analytics/category_products_by_store_distribution.json",
  });
  const customerPurchaseBoxplot = useJsonData<DistributionData>({
    path: "analytics/customer_purchase_distribution.json",
  });
  const correlationMatrix = useJsonData<CorrelationMatrix>({
    path: "analytics/variable_correlation.json",
  });

  // Filtrar y ordenar los top 200 clientes para el boxplot
  const top200Customers = useMemo(() => {
    if (!customerPurchaseBoxplot.data?.data) return null;

    // Ordenar por total_products_purchased descendente y tomar los primeros 200
    const sortedData = [...customerPurchaseBoxplot.data.data]
      .sort(
        (a: any, b: any) =>
          b.total_products_purchased - a.total_products_purchased
      )
      .slice(0, 200)
      .map((item: any) => ({
        customer_id: item.customer_id,
        total_products_purchased: item.total_products_purchased,
      }));

    return sortedData;
  }, [customerPurchaseBoxplot.data]);

  const filteredCorrelationMatrix = useMemo(() => {
    if (!correlationMatrix.data) return null;

    const raw = correlationMatrix.data.correlation_data;
    if (!raw?.variables?.length) return correlationMatrix.data;

    const filteredVariables = raw.variables.filter(
      (variable) => variable !== "frequency"
    );

    const filteredMatrix = filteredVariables.reduce<
      Record<string, Record<string, number | null>>
    >((acc, rowVar) => {
      const row = raw.matrix[rowVar] || {};
      acc[rowVar] = filteredVariables.reduce<Record<string, number | null>>(
        (rowAcc, colVar) => {
          rowAcc[colVar] = row[colVar] ?? null;
          return rowAcc;
        },
        {}
      );
      return acc;
    }, {});

    const filteredVariableNames = { ...raw.variable_names };
    delete filteredVariableNames.frequency;

    return {
      ...correlationMatrix.data,
      correlation_data: {
        ...raw,
        variables: filteredVariables,
        variable_names: filteredVariableNames,
        matrix: filteredMatrix,
      },
    };
  }, [correlationMatrix.data]);

  return (
    <section className="section flex flex-col gap-10">
      <div className="section-header">
        <p className="eyebrow">Análisis Analítico</p>
        <h2>Visualizaciones Analíticas</h2>
      </div>

      <div className="subsection flex flex-col gap-4">
        <h3>Serie de Tiempo - Ventas Diarias</h3>
        {dailySales.loading && <p className="helper-text">Cargando...</p>}
        {dailySales.error && (
          <p className="helper-text error">{dailySales.error}</p>
        )}
        {dailySales.data && <TimeSeriesChart data={dailySales.data} />}
      </div>

      <div className="subsection flex flex-col gap-4">
        <h3>Serie de Tiempo - Ventas Semanales</h3>
        {weeklySales.loading && <p className="helper-text">Cargando...</p>}
        {weeklySales.error && (
          <p className="helper-text error">{weeklySales.error}</p>
        )}
        {weeklySales.data && <TimeSeriesChart data={weeklySales.data} />}
      </div>

      <div className="subsection flex flex-col gap-4">
        <h3>Serie de Tiempo - Ventas Mensuales</h3>
        {monthlySales.loading && <p className="helper-text">Cargando...</p>}
        {monthlySales.error && (
          <p className="helper-text error">{monthlySales.error}</p>
        )}
        {monthlySales.data && <TimeSeriesChart data={monthlySales.data} />}
      </div>

      <div className="subsection flex flex-col gap-4">
        <h3>Patrones por Día de la Semana</h3>
        {dayOfWeek.loading && <p className="helper-text">Cargando...</p>}
        {dayOfWeek.error && (
          <p className="helper-text error">{dayOfWeek.error}</p>
        )}
        {dayOfWeek.data && (
          <div className="chart-container">
            <div className="chart-wrapper">
              {/* Mostrar tabla por ahora */}
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Transacciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(dayOfWeek.data.data || []).map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td>{item.day_name || item.day_of_week}</td>
                      <td>{item.num_transacciones}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="subsection flex flex-col gap-4">
        <h3>Boxplot - Total Productos Vendidos por Categoría (4 tiendas)</h3>
        {categoryBoxplot.loading && <p className="helper-text">Cargando...</p>}
        {categoryBoxplot.error && (
          <p className="helper-text error">{categoryBoxplot.error}</p>
        )}
        {categoryBoxplot.data && <BoxplotChart data={categoryBoxplot.data} />}
      </div>

      <div className="subsection flex flex-col gap-4 mt-10 pt-6 border-t border-slate-200/70">
        <h3>Boxplot - Top 200 Clientes por Volumen de Compra</h3>
        <p className="helper-text">
          Distribución de compras de los 200 clientes con mayor volumen de
          productos.
        </p>
        {customerPurchaseBoxplot.loading && (
          <p className="helper-text">Cargando...</p>
        )}
        {customerPurchaseBoxplot.error && (
          <p className="helper-text error">{customerPurchaseBoxplot.error}</p>
        )}
        {top200Customers && <CustomerBoxplotChart data={top200Customers} />}
      </div>

      <div className="subsection flex flex-col gap-4 mt-10 pt-6 border-t border-slate-200/70">
        <h3>Heatmap - Matriz de Correlación</h3>
        {correlationMatrix.loading && (
          <p className="helper-text">Cargando...</p>
        )}
        {correlationMatrix.error && (
          <p className="helper-text error">{correlationMatrix.error}</p>
        )}
        {filteredCorrelationMatrix && (
          <HeatmapChart data={filteredCorrelationMatrix} type="correlation" />
        )}
      </div>
    </section>
  );
}
