import { useEffect, useState } from 'react';

const DATA_BASE_PATH = '/data';

interface UseJsonDataOptions {
  path: string;
  enabled?: boolean;
}

export function useJsonData<T>({ path, enabled = true }: UseJsonDataOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const url = `${DATA_BASE_PATH}/${path}`;
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`No se pudo cargar ${path}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [path, enabled]);

  return { data, loading, error };
}

