export type ArtifactType = 'metrics' | 'table' | 'data';

export type VisualizationType = 'line' | 'bar';

export interface VisualizationHint {
  type: VisualizationType;
  x_field?: string;
  y_field?: string;
}

export interface ArtifactMeta {
  dag_id: string;
  task_id: string;
  artifact_id: string;
  title: string;
  type: ArtifactType;
  relative_path: string;
  description?: string;
  generated_at?: string;
  visualization?: VisualizationHint;
  row_count?: number;
  extra?: Record<string, unknown>;
}

export interface TaskArtifacts {
  task_id: string;
  artifacts: ArtifactMeta[];
}

export interface DagManifest {
  dag_id: string;
  dag_label?: string;
  generated_at: string;
  tasks: TaskArtifacts[];
}

export interface DagIndexEntry {
  dag_id: string;
  dag_label?: string;
  generated_at?: string;
  path: string;
}

export interface DashboardIndex {
  generated_at: string;
  dags: DagIndexEntry[];
}









