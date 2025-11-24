import { useJsonData } from '../hooks/usePipelineData';
import { DataTable } from './DataTable';
import type { BasicMetrics } from '../types/pipelines';

type HighlightCard = { id: string; label: string; value: string; helper?: string };

const formatNumber = (value?: number | null) => {
  if (value === undefined || value === null) return null;
  return value.toLocaleString('es-CO');
};

const normalizeBasicMetrics = (payload: unknown): BasicMetrics | null => {
  if (!payload || typeof payload !== 'object') return null;
  const raw = (payload as any).basic_metrics ?? payload;
  if (!raw || typeof raw !== 'object') return null;
  return raw as BasicMetrics;
};

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

  const normalized = normalizeBasicMetrics(basicMetrics.data);

  const highlightCards: HighlightCard[] = [];
  const totalTransactions =
    normalized?.total_transactions ?? normalized?.total_transacciones ?? null;
  const totalSales =
    normalized?.total_sales_units ?? normalized?.total_productos_vendidos ?? null;

  if (totalTransactions !== null) {
    highlightCards.push({
      id: 'transactions-highlight',
      label: 'Total de transacciones procesadas',
      value: formatNumber(totalTransactions) ?? `${totalTransactions}`,
    });
  }

  if (totalSales !== null) {
    highlightCards.push({
      id: 'sales-highlight',
      label: 'Unidades totales vendidas',
      value: formatNumber(totalSales) ?? `${totalSales}`,
    });
  }

  return (
    <section className="section">
      <div className="section-header">
        <p className="eyebrow">Resumen Ejecutivo</p>
        <h2>Métricas Principales</h2>
      </div>

      {highlightCards.length > 0 && (
        <div className="highlight-card-grid" role="list">
          {highlightCards.map((card) => (
            <article key={card.id} className="highlight-card" role="listitem">
              <p className="metric-label">{card.label}</p>
              <p className="highlight-value">{card.value}</p>
              {card.helper ? <p className="helper-text">{card.helper}</p> : null}
            </article>
          ))}
        </div>
      )}

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

