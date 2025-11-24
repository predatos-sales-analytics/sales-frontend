import { useEffect, useState } from 'react';
import './App.css';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';
import { AnalyticsSection } from './components/AnalyticsSection';
import { ClusteringSection } from './components/ClusteringSection';
import { RecommendationsSection } from './components/RecommendationsSection';

const PIPELINE_SECTIONS = [
  {
    id: 'executive-summary',
    label: 'Resumen Ejecutivo',
    description: 'KPIs diarios y rankings clave.',
    component: <ExecutiveSummarySection />,
  },
  {
    id: 'analytics',
    label: 'Analítica Temporal',
    description: 'Series de tiempo y correlaciones.',
    component: <AnalyticsSection />,
  },
  {
    id: 'clustering',
    label: 'Segmentación de Clientes',
    description: 'Perfiles y clusters detectados.',
    component: <ClusteringSection />,
  },
  {
    id: 'recommendations',
    label: 'Recomendaciones',
    description: 'Asociaciones producto↔cliente.',
    component: <RecommendationsSection />,
  },
];

function App() {
  const [activePipeline, setActivePipeline] = useState(PIPELINE_SECTIONS[0].id);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActivePipeline(visible[0].target.id);
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0.1, 0.25, 0.5],
      },
    );

    PIPELINE_SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-shell">
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <p className="eyebrow">Pipelines</p>
            <h2>Explora los resultados</h2>
            <p className="sidebar-description">
              Navega entre los artefactos que generan los DAGs de Spark.
            </p>
          </div>
          <nav className="pipeline-nav">
            {PIPELINE_SECTIONS.map((section) => (
              <a
                key={section.id}
                className={`pipeline-link ${activePipeline === section.id ? 'active' : ''}`}
                href={`#${section.id}`}
                onClick={() => setActivePipeline(section.id)}
              >
                <span className="pipeline-name">{section.label}</span>
                <span className="pipeline-description">{section.description}</span>
              </a>
            ))}
          </nav>
        </aside>

        <main className="pipeline-content">
          <header className="dashboard-header">
            <div>
              <p className="eyebrow">Sales Analytics</p>
              <h1>Dashboard de Análisis de Ventas</h1>
              <p className="subtitle">Visualización de resultados generados por los pipelines de Spark.</p>
            </div>
          </header>

          {PIPELINE_SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="pipeline-section-anchor">
              {section.component}
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
