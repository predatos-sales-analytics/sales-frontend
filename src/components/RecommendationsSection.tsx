import { useMemo, useState } from 'react';
import { useJsonData } from '../hooks/usePipelineData';
import { DataTable } from './DataTable';
import type {
  ProductRecommendationsPayload,
  CustomerRecommendationsPayload,
  ProductAssociationsPayload,
} from '../types/pipelines';

const formatList = (value: number[] | string[]) => {
  if (!Array.isArray(value)) return value ?? '';
  return value.join(', ');
};

type ProductRecsResponse =
  | ProductRecommendationsPayload
  | { data: ProductRecommendationsPayload };
type CustomerRecsResponse =
  | CustomerRecommendationsPayload
  | { data: CustomerRecommendationsPayload };
type AssociationsResponse =
  | ProductAssociationsPayload
  | { data: ProductAssociationsPayload };

const extractProductPayload = (
  payload: ProductRecsResponse | null | undefined,
): ProductRecommendationsPayload | undefined => {
  if (!payload) return undefined;
  if ('recommendations' in payload && Array.isArray(payload.recommendations)) {
    return payload;
  }
  if ('data' in payload) {
    return payload.data;
  }
  return undefined;
};

const extractCustomerPayload = (
  payload: CustomerRecsResponse | null | undefined,
): CustomerRecommendationsPayload | undefined => {
  if (!payload) return undefined;
  if ('recommendations' in payload && Array.isArray(payload.recommendations)) {
    return payload;
  }
  if ('data' in payload) {
    return payload.data;
  }
  return undefined;
};

const extractAssociationsPayload = (
  payload: AssociationsResponse | null | undefined,
): ProductAssociationsPayload | undefined => {
  if (!payload) return undefined;
  if ('top_rules' in payload && Array.isArray(payload.top_rules)) {
    return payload;
  }
  if ('data' in payload) {
    return payload.data;
  }
  return undefined;
};

export function RecommendationsSection() {
  const associations = useJsonData<AssociationsResponse>({
    path: 'advanced/recommendations/product_associations.json',
  });

  const productRecs = useJsonData<ProductRecsResponse>({
    path: 'advanced/recommendations/product_recommendations.json',
  });
  const customerRecs = useJsonData<CustomerRecsResponse>({
    path: 'advanced/recommendations/customer_recommendations.json',
  });

  const loading = associations.loading || productRecs.loading || customerRecs.loading;
  const hasError = associations.error && productRecs.error && customerRecs.error;

  const associationPayload = extractAssociationsPayload(associations.data);
  const [productFilter, setProductFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  const productRows = useMemo(() => {
    const payload = extractProductPayload(productRecs.data);
    if (!payload?.recommendations) return [];
    return payload.recommendations.flatMap((entry) =>
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
    const payload = extractCustomerPayload(customerRecs.data);
    if (!payload?.recommendations) return [];
    return payload.recommendations.flatMap((entry) =>
      entry.recommendations.map((rec) => ({
        customer_id: entry.customer_id,
        recommended_product_id: rec.product_id,
        based_on_product: rec.based_on_product ?? null,
        confidence: rec.confidence ?? null,
        lift: rec.lift ?? null,
      })),
    );
  }, [customerRecs.data]);

  const associationRows = useMemo(() => {
    if (!associationPayload?.top_rules) return [];
    return associationPayload.top_rules.map((rule, index) => ({
      id: `${index}-${formatList(rule.antecedent)}`,
      antecedent: formatList(rule.antecedent),
      consequent: formatList(rule.consequent),
      confidence: rule.confidence ?? null,
      lift: rule.lift ?? null,
      support: rule.support ?? null,
    }));
  }, [associationPayload]);

  const filteredProductRows = useMemo(() => {
    if (!productFilter.trim()) return productRows;
    const query = productFilter.trim().toLowerCase();
    return productRows.filter(
      (row) =>
        String(row.product_id).toLowerCase().includes(query) ||
        String(row.recommended_product_id).toLowerCase().includes(query),
    );
  }, [productRows, productFilter]);

  const filteredCustomerRows = useMemo(() => {
    if (!customerFilter.trim()) return customerRows;
    const query = customerFilter.trim().toLowerCase();
    return customerRows.filter(
      (row) =>
        String(row.customer_id).toLowerCase().includes(query) ||
        String(row.recommended_product_id).toLowerCase().includes(query),
    );
  }, [customerRows, customerFilter]);

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
          No se encontraron archivos de recomendaciones. Ejecuta el pipeline y sincroniza los JSON
          dentro de <code>public/data/advanced/recommendations/</code>.
        </p>
      </section>
    );
  }

  const productSummary = extractProductPayload(productRecs.data)?.summary;
  const customerSummary = extractCustomerPayload(customerRecs.data)?.summary;
  const associationsSummary = associationPayload?.summary;

  const summaryChips = [
    associationsSummary
      ? `${associationsSummary.total_rules.toLocaleString()} reglas activas`
      : null,
    productSummary?.total_products
      ? `${productSummary.total_products.toLocaleString()} productos con sugerencias`
      : null,
    customerSummary?.total_customers
      ? `${customerSummary.total_customers.toLocaleString()} clientes priorizados`
      : null,
    associationsSummary?.min_support !== undefined
      ? `Soporte ≥ ${(associationsSummary.min_support * 100).toFixed(1)}%`
      : null,
    associationsSummary?.min_confidence !== undefined
      ? `Confianza ≥ ${(associationsSummary.min_confidence * 100).toFixed(1)}%`
      : null,
  ].filter(Boolean) as string[];

  return (
    <section className="section">
      <div className="section-header">
        <p className="eyebrow">Recomendaciones</p>
        <h2>Sugerencias generadas por FP-Growth</h2>
        <p className="helper-text">
          Resultados consumidos desde <code>public/data/advanced/recommendations/*.json</code>. Copia aquí los
          archivos generados en <code>output/advanced/recommendations</code>.
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
        <h3>Top Reglas de Asociación</h3>
        {associationRows.length > 0 ? (
          <DataTable
            columns={['antecedent', 'consequent', 'confidence', 'lift', 'support']}
            rows={associationRows}
            maxRows={30}
          />
        ) : (
          <p className="helper-text">
            No se encontraron reglas recientes. Ejecuta nuevamente el pipeline para generarlas.
          </p>
        )}
      </div>

      <div className="subsection">
        <h3>Productos complementarios</h3>
        <div className="filter-bar">
          <label>
            Buscar por producto&nbsp;
            <input
              type="text"
              value={productFilter}
              onChange={(event) => setProductFilter(event.target.value)}
              placeholder="ID de producto o sugerido"
            />
          </label>
        </div>
        {productRows.length > 0 ? (
          <DataTable
            columns={[
              'product_id',
              'recommended_product_id',
              'confidence',
              'lift',
              'support',
            ]}
            rows={filteredProductRows}
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
        <div className="filter-bar">
          <label>
            Buscar por cliente&nbsp;
            <input
              type="text"
              value={customerFilter}
              onChange={(event) => setCustomerFilter(event.target.value)}
              placeholder="ID de cliente o producto sugerido"
            />
          </label>
        </div>
        {customerRows.length > 0 ? (
          <DataTable
            columns={[
              'customer_id',
              'recommended_product_id',
              'confidence',
              'lift',
            ]}
            rows={filteredCustomerRows}
            maxRows={40}
          />
        ) : (
          <p className="helper-text">
            No se generaron sugerencias personalizadas. Revisa que existan reglas y clientes en los
            archivos del pipeline.
          </p>
        )}
      </div>
    </section>
  );
}

