import { useMemo } from 'react';
import { useJsonData } from '../hooks/usePipelineData';
import { DataTable } from './DataTable';
import type {
  ProductRecommendationsPayload,
  CustomerRecommendationsPayload,
} from '../types/pipelines';

export function RecommendationsSection() {
  const productRecs = useJsonData<ProductRecommendationsPayload>({
    path: 'advanced/recommendations/product_recs.json',
  });
  const customerRecs = useJsonData<CustomerRecommendationsPayload>({
    path: 'advanced/recommendations/customer_recs.json',
  });

  const loading = productRecs.loading || customerRecs.loading;
  const hasError = productRecs.error && customerRecs.error;

  const productRows = useMemo(() => {
    if (!productRecs.data?.data) return [];
    return productRecs.data.data.flatMap((entry) =>
      entry.recommendations.map((rec) => ({
        product_id: entry.product_id,
        recommended_product_id: rec.product_id,
        confidence: rec.confidence ?? null,
        lift: rec.lift ?? null,
        support: rec.support ?? null,
      })),
    );
  }, [productRecs.data]);

  const customerRows = useMemo(() => {
    if (!customerRecs.data?.data) return [];
    return customerRecs.data.data.flatMap((entry) =>
      entry.recommendations.map((rec) => ({
        customer_id: entry.customer_id,
        recommended_product_id: rec.product_id,
        based_on_product: rec.based_on_product ?? null,
        confidence: rec.confidence ?? null,
        lift: rec.lift ?? null,
      })),
    );
  }, [customerRecs.data]);

  if (loading) {
    return (
      <section className="section">
        <h2>Recomendaciones</h2>
        <p className="helper-text">Cargando recomendaciones...</p>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="section">
        <h2>Recomendaciones</h2>
        <p className="helper-text error">
          No se encontraron archivos de recomendaciones. Ejecuta el pipeline y sincroniza
          <code> output/recommendations/*.json</code> dentro de <code>public/data/advanced/recommendations/</code>.
        </p>
      </section>
    );
  }

  const summaryChips = [
    productRecs.data?.total_products
      ? `${productRecs.data.total_products.toLocaleString()} productos con sugerencias`
      : null,
    customerRecs.data?.total_customers
      ? `${customerRecs.data.total_customers.toLocaleString()} clientes priorizados`
      : null,
    productRecs.data
      ? `Soporte ≥ ${(productRecs.data.min_support * 100).toFixed(1)}%`
      : null,
    productRecs.data
      ? `Confianza ≥ ${(productRecs.data.min_confidence * 100).toFixed(1)}%`
      : null,
  ].filter(Boolean) as string[];

  return (
    <section className="section">
      <div className="section-header">
        <p className="eyebrow">Recomendaciones</p>
        <h2>Sugerencias generadas por FP-Growth</h2>
        <p className="helper-text">
          Resultados consumidos desde <code>output/recommendations/*.json</code> (sincronizados en <code>public/data/advanced/recommendations/</code>).
        </p>
      </div>

      {summaryChips.length > 0 && (
        <div className="statistics-summary" role="list">
          {summaryChips.map((chip) => (
            <span key={chip} role="listitem">
              {chip}
            </span>
          ))}
        </div>
      )}

      <div className="subsection">
        <h3>Productos complementarios</h3>
        {productRows.length > 0 ? (
          <DataTable
            columns={[
              'product_id',
              'recommended_product_id',
              'confidence',
              'lift',
              'support',
            ]}
            rows={productRows}
            maxRows={40}
          />
        ) : (
          <p className="helper-text">
            No se detectaron asociaciones entre productos con los parámetros actuales.
          </p>
        )}
      </div>

      <div className="subsection">
        <h3>Recomendaciones por cliente</h3>
        {customerRows.length > 0 ? (
          <DataTable
            columns={[
              'customer_id',
              'recommended_product_id',
              'based_on_product',
              'confidence',
              'lift',
            ]}
            rows={customerRows}
            maxRows={40}
          />
        ) : (
          <p className="helper-text">
            No se generaron sugerencias personalizadas. Revisa que existan reglas y clientes
            en los archivos del pipeline.
          </p>
        )}
      </div>
    </section>
  );
}

