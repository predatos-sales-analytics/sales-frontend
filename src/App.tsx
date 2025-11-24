import { useMemo, useState } from "react";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { ExecutiveSummarySection } from "./components/ExecutiveSummarySection";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { ClusteringSection } from "./components/ClusteringSection";
import { RecommendationsSection } from "./components/RecommendationsSection";

const PIPELINE_ROUTES = [
  {
    id: "executive-summary",
    label: "Resumen Ejecutivo",
    icon: "📊",
    path: "/executive-summary",
    element: <ExecutiveSummarySection />,
  },
  {
    id: "analytics",
    label: "Analítica Temporal",
    icon: "🕒",
    path: "/analytics",
    element: <AnalyticsSection />,
  },
  {
    id: "clustering",
    label: "Segmentación de Clientes",
    icon: "🧩",
    path: "/clustering",
    element: <ClusteringSection />,
  },
  {
    id: "recommendations",
    label: "Recomendaciones",
    icon: "🤝",
    path: "/recommendations",
    element: <RecommendationsSection />,
  },
];

function App() {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const currentSection = useMemo(() => {
    return (
      PIPELINE_ROUTES.find((route) => location.pathname.startsWith(route.path))
        ?.label ?? ""
    );
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="app-layout">
        <aside className={`sidebar ${sidebarExpanded ? "" : "collapsed"}`}>
          <div className="sidebar-header">
            <p className="eyebrow">Pipelines</p>
            <h2>Explora los resultados</h2>
            <p className="sidebar-description">
              Navega entre los artefactos que generan los DAGs de Spark.
            </p>
          </div>

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarExpanded((prev) => !prev)}
            aria-label={
              sidebarExpanded
                ? "Colapsar menú lateral"
                : "Expandir menú lateral"
            }
            type="button"
          >
            {sidebarExpanded ? "◄ Ocultar" : "► Mostrar"}
          </button>

          <nav className="pipeline-nav">
            {PIPELINE_ROUTES.map((section) => (
              <NavLink
                key={section.id}
                className={({ isActive }) =>
                  `pipeline-link ${isActive ? "active" : ""}`
                }
                to={section.path}
                end
              >
                <span className="pipeline-icon" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="pipeline-name">{section.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main
          className={`pipeline-content ${sidebarExpanded ? "" : "collapsed"}`}
        >
          <header className="dashboard-header">
            <div>
              <p className="eyebrow">Sales Analytics</p>
              <h1>Dashboard de Análisis de Ventas</h1>
              <p className="subtitle">
                Visualización de resultados generados por los pipelines de
                Spark.
              </p>
              <p className="helper-text">
                {currentSection
                  ? `Estás viendo: ${currentSection}`
                  : "Selecciona un pipeline en la barra lateral."}
              </p>
            </div>
            <button
              className="sidebar-mobile-toggle"
              onClick={() => setSidebarExpanded((prev) => !prev)}
            >
              {sidebarExpanded ? "Cerrar menú" : "Abrir menú"}
            </button>
          </header>

          <Routes>
            <Route
              index
              element={<Navigate to="/executive-summary" replace />}
            />
            {PIPELINE_ROUTES.map((route) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
            <Route
              path="*"
              element={<Navigate to="/executive-summary" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
