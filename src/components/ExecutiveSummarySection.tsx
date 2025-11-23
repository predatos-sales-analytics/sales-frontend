import { useJsonData } from '../hooks/usePipelineData';
import { MetricsGrid } from './MetricsGrid';
import { DataTable } from './DataTable';
import type { BasicMetrics } from '../types/pipelines';

export function ExecutiveSummarySection() {
  const basicMetrics = useJsonData({ path: 'summary/basic_metrics.json' });
  const topProducts = useJsonData({ path: 'summary/top_10_products.json' });
  const topCustomers = useJsonData({ path: 'summary/top_10_customers.json' });
  const topCategories = useJsonData({ path: 'summary/top_10_categories.json' });
  const topCategoriesByProducts = useJsonData({
    path: 'summary/top_10_categories_by_products.json',
  });
  const peakDays = useJsonData({ path: 'summary/top_10_peak_days.json' });
  const peakDaysByProducts = useJsonData({
    path: 'summary/top_10_peak_days_by_products.json',
  });

  const loading =
    basicMetrics.loading ||
    topProducts.loading ||
    topCustomers.loading ||
    topCategories.loading;

  if (loading) {
    return (
      <section className="section">
        <h2>Resumen Ejecutivo</h2>
        <p className="helper-text">Cargando datos...</p>
      </section>
    );
  }

  const metrics: Array<{ id: string; label: string; value: number | null; suffix?: string }> = [];
  if (basicMetrics.data) {
    const data = basicMetrics.data as { basic_metrics?: BasicMetrics } | BasicMetrics;
    const m = (data as any).basic_metrics || data;
    if (m && typeof m === 'object' && 'total_transacciones' in m) {
      metrics.push(
        { id: 'transactions', label: 'Total Transacciones', value: m.total_transacciones },
        {
          id: 'products',
          label: 'Productos Vendidos',
          value: m.total_productos_vendidos,
        },
        { id: 'customers', label: 'Clientes Únicos', value: m.clientes_unicos },
        { id: 'unique_products', label: 'Productos Únicos', value: m.productos_unicos }
      );
    }
  }

  return (
    <section className="section">
      <div className="section-header">
        <p className="eyebrow">Resumen Ejecutivo</p>
        <h2>Métricas Principales</h2>
      </div>

      {metrics.length > 0 && <MetricsGrid metrics={metrics} />}

      {topProducts.data && (
        <div className="subsection">
          <h3>Top 10 Productos</h3>
          <DataTable
            columns={['product_id', 'category_name', 'total_sold']}
            rows={(topProducts.data as any).data || []}
          />
        </div>
      )}

      {topCustomers.data && (
        <div className="subsection">
          <h3>Top 10 Clientes</h3>
          <DataTable
            columns={['customer_id', 'num_transacciones', 'total_productos']}
            rows={(topCustomers.data as any).data || []}
          />
        </div>
      )}

      {topCategories.data && (
        <div className="subsection">
          <h3>Top 10 Categorías (por volumen)</h3>
          <DataTable
            columns={['category_name', 'total_volume']}
            rows={(topCategories.data as any).data || []}
          />
        </div>
      )}

      {topCategoriesByProducts.data && (
        <div className="subsection">
          <h3>Top 10 Categorías (por número de productos)</h3>
          <DataTable
            columns={['category_name', 'num_products']}
            rows={(topCategoriesByProducts.data as any).data || []}
          />
        </div>
      )}

      {peakDays.data && (
        <div className="subsection">
          <h3>Top 10 Días Pico (por transacciones)</h3>
          <DataTable
            columns={['date', 'num_transacciones']}
            rows={(peakDays.data as any).data || []}
          />
        </div>
      )}

      {peakDaysByProducts.data && (
        <div className="subsection">
          <h3>Top 10 Días Pico (por productos vendidos)</h3>
          <DataTable
            columns={['date', 'total_products_sold']}
            rows={(peakDaysByProducts.data as any).data || []}
          />
        </div>
      )}
    </section>
  );
}

