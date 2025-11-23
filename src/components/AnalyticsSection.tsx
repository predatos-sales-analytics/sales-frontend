import { useJsonData } from '../hooks/usePipelineData';
import { TimeSeriesChart } from './TimeSeriesChart';
import { BoxplotChart } from './BoxplotChart';
import { HeatmapChart } from './HeatmapChart';
import type { TimeSeriesData, DistributionData, CorrelationMatrix, HeatmapData } from '../types/pipelines';

export function AnalyticsSection() {
  const dailySales = useJsonData<TimeSeriesData>({ path: 'analytics/daily_sales.json' });
  const weeklySales = useJsonData<TimeSeriesData>({ path: 'analytics/weekly_sales.json' });
  const monthlySales = useJsonData<TimeSeriesData>({ path: 'analytics/monthly_sales.json' });
  const dayOfWeek = useJsonData<DistributionData>({ path: 'analytics/day_of_week_patterns_distribution.json' });
  const categoryBoxplot = useJsonData<DistributionData>({
    path: 'analytics/category_products_by_store_distribution.json',
  });
  const correlationMatrix = useJsonData<CorrelationMatrix>({
    path: 'analytics/variable_correlation.json',
  });

  return (
    <section className="section">
      <div className="section-header">
        <p className="eyebrow">Análisis Analítico</p>
        <h2>Visualizaciones Analíticas</h2>
      </div>

      <div className="subsection">
        <h3>Serie de Tiempo - Ventas Diarias</h3>
        {dailySales.loading && <p className="helper-text">Cargando...</p>}
        {dailySales.error && <p className="helper-text error">{dailySales.error}</p>}
        {dailySales.data && <TimeSeriesChart data={dailySales.data} />}
      </div>

      <div className="subsection">
        <h3>Serie de Tiempo - Ventas Semanales</h3>
        {weeklySales.loading && <p className="helper-text">Cargando...</p>}
        {weeklySales.error && <p className="helper-text error">{weeklySales.error}</p>}
        {weeklySales.data && <TimeSeriesChart data={weeklySales.data} />}
      </div>

      <div className="subsection">
        <h3>Serie de Tiempo - Ventas Mensuales</h3>
        {monthlySales.loading && <p className="helper-text">Cargando...</p>}
        {monthlySales.error && <p className="helper-text error">{monthlySales.error}</p>}
        {monthlySales.data && <TimeSeriesChart data={monthlySales.data} />}
      </div>

      <div className="subsection">
        <h3>Patrones por Día de la Semana</h3>
        {dayOfWeek.loading && <p className="helper-text">Cargando...</p>}
        {dayOfWeek.error && <p className="helper-text error">{dayOfWeek.error}</p>}
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

      <div className="subsection">
        <h3>Boxplot - Total Productos Vendidos por Categoría (4 tiendas)</h3>
        {categoryBoxplot.loading && <p className="helper-text">Cargando...</p>}
        {categoryBoxplot.error && <p className="helper-text error">{categoryBoxplot.error}</p>}
        {categoryBoxplot.data && <BoxplotChart data={categoryBoxplot.data} />}
      </div>

      <div className="subsection">
        <h3>Heatmap - Matriz de Correlación</h3>
        {correlationMatrix.loading && <p className="helper-text">Cargando...</p>}
        {correlationMatrix.error && <p className="helper-text error">{correlationMatrix.error}</p>}
        {correlationMatrix.data && (
          <HeatmapChart data={correlationMatrix.data} type="correlation" />
        )}
      </div>
    </section>
  );
}

