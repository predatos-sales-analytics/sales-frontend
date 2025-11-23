import { useEffect, useMemo, useState } from "react";
import type { DagManifest, DashboardIndex } from "../types/analytics";

const buildDataUrl = (relativePath: string) =>
  new URL(relativePath.replace(/^\//, ""), getDataBase()).toString();

const getDataBase = () => {
  if (typeof window === "undefined") {
    return "http://localhost/data/";
  }
  return new URL(
    `${import.meta.env.BASE_URL}data/`,
    window.location.origin
  ).toString();
};

export function useAnalyticsData() {
  const [dashboardIndex, setDashboardIndex] = useState<DashboardIndex | null>(
    null
  );
  const [selectedDag, setSelectedDag] = useState<string | null>(null);
  const [manifest, setManifest] = useState<DagManifest | null>(null);
  const [basePath, setBasePath] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(buildDataUrl("index.json"), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo leer index.json");
        }
        return res.json() as Promise<DashboardIndex>;
      })
      .then((result) => {
        setDashboardIndex(result);
        if (result.dags.length > 0) {
          setSelectedDag((prev) => prev ?? result.dags[0].dag_id);
        }
        if (result.dags.length === 0) {
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(
            "No se encontró ningún dataset. Ejecuta los DAGs y sincroniza /public/data."
          );
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedDag || !dashboardIndex) {
      return;
    }
    const dagEntry = dashboardIndex.dags.find(
      (dag) => dag.dag_id === selectedDag
    );
    if (!dagEntry) {
      setManifest(null);
      setError("El DAG seleccionado no existe en index.json");
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();

    fetch(buildDataUrl(dagEntry.path), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`No se pudo leer manifest para ${dagEntry.dag_id}`);
        }
        return res.json() as Promise<DagManifest>;
      })
      .then((result) => {
        setManifest(result);
        const dagBase = dagEntry.path.replace(/manifest\.json$/i, "");
        setBasePath(buildDataUrl(dagBase));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setManifest(null);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [selectedDag, dashboardIndex]);

  const dagOptions = useMemo(
    () => dashboardIndex?.dags ?? [],
    [dashboardIndex]
  );

  return {
    dashboardIndex,
    dagOptions,
    manifest,
    selectedDag,
    setSelectedDag,
    basePath,
    loading,
    error,
  };
}
