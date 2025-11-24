import { useEffect, useState } from 'react';
import type { ArtifactMeta } from '../types/analytics';
import { MetricsGrid } from './MetricsGrid';
import { DataTable } from './DataTable';
import { ChartRenderer } from './ChartRenderer';

interface ArtifactCardProps {
  meta: ArtifactMeta;
  basePath: string;
}

export function ArtifactCard({ meta, basePath }: ArtifactCardProps) {
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!basePath) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const url = new URL(meta.relative_path.replace(/^\//, ''), ensureTrailingSlash(basePath)).toString();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`No se pudo cargar ${meta.relative_path}`);
        }
        return res.json();
      })
      .then((data) => setContent(data))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [meta, basePath]);

  return (
    <article className="artifact-card">
      <header>
        <div>
          <p className="artifact-type">{meta.type}</p>
          <h3>{meta.title}</h3>
        </div>
        {meta.generated_at ? <time dateTime={meta.generated_at}>{new Date(meta.generated_at).toLocaleString()}</time> : null}
      </header>
      {meta.description ? <p className="artifact-description">{meta.description}</p> : null}
      {loading && <p className="helper-text">Cargando...</p>}
      {error && <p className="helper-text error">{error}</p>}
      {!loading && !error ? renderContent(meta, content) : null}
    </article>
  );
}

const renderContent = (meta: ArtifactMeta, content: Record<string, unknown> | null) => {
  if (!content) {
    return <p className="helper-text">Sin datos disponibles.</p>;
  }

  if (meta.type === 'metrics') {
    return <MetricsGrid metrics={Array.isArray((content as { items?: any }).items) ? ((content as { items: any }).items as any[]) : []} />;
  }

  if (meta.type === 'table') {
    const rows = (content as { rows?: Array<Record<string, unknown>> }).rows ?? [];
    const schema = (content as { schema?: string[] }).schema ?? Object.keys(rows[0] ?? {});
    return (
      <>
        <ChartRenderer rows={rows} config={meta.visualization} />
        <DataTable columns={schema} rows={rows} />
      </>
    );
  }

  return <pre className="json-preview">{JSON.stringify(content, null, 2)}</pre>;
};

const ensureTrailingSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);









