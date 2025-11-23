import type { DagIndexEntry } from '../types/analytics';

interface DagSelectorProps {
  dags: DagIndexEntry[];
  selected?: string | null;
  onChange: (dagId: string) => void;
}

export function DagSelector({ dags, selected, onChange }: DagSelectorProps) {
  if (!dags.length) {
    return <p className="helper-text">No hay ejecuciones disponibles.</p>;
  }

  return (
    <label className="dag-selector">
      <span>DAG</span>
      <select value={selected ?? ''} onChange={(event) => onChange(event.target.value)}>
        {dags.map((dag) => (
          <option key={dag.dag_id} value={dag.dag_id}>
            {dag.dag_label ?? dag.dag_id}
          </option>
        ))}
      </select>
    </label>
  );
}

