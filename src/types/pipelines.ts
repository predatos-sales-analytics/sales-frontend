// Tipos para los datos de los pipelines

export interface BasicMetrics {
  total_transacciones: number;
  total_productos_vendidos: number;
  clientes_unicos: number;
  productos_unicos: number;
}

export interface TopItem {
  [key: string]: any;
  total_sold?: number;
  total_volume?: number;
  num_products?: number;
  num_transacciones?: number;
}

export interface ExecutiveSummaryData {
  basic_metrics: BasicMetrics;
  top_products: TopItem[];
  top_customers: TopItem[];
  top_categories: TopItem[];
  top_categories_by_products: TopItem[];
  peak_days: TopItem[];
  peak_days_by_products: TopItem[];
}

export interface TimeSeriesData {
  series_name: string;
  date_column: string;
  value_column: string;
  statistics?: {
    promedio: number | null;
    minimo: number | null;
    maximo: number | null;
  };
  data: Array<Record<string, any>>;
  generated_at: string;
}

export interface DistributionData {
  distribution_name: string;
  data: Array<Record<string, any>>;
  generated_at: string;
}

export interface CorrelationMatrix {
  matrix_name: string;
  correlation_data: {
    variables: string[];
    variable_names: Record<string, string>;
    matrix: Record<string, Record<string, number | null>>;
  };
  generated_at: string;
}

export interface HeatmapData {
  heatmap_name: string;
  data: {
    categories: Array<{
      category_id: number;
      category_name: string;
      values: Record<string, number>;
      raw_values: Record<string, number>;
    }>;
    metrics: string[];
    metric_keys: string[];
    normalization_info: Record<string, any>;
  };
  generated_at: string;
}

export interface ClusterProfile {
  cluster_id: number;
  label: string;
  description: string;
  n_customers: number;
  percentage: number;
  metrics: {
    avg_frequency: number;
    avg_unique_products: number;
    avg_total_volume: number;
    avg_unique_categories: number;
    min_frequency: number;
    max_frequency: number;
    min_volume: number;
    max_volume: number;
  };
  business_recommendations: string[];
}

export interface ClusteringData {
  n_clusters: number;
  cluster_profiles: Record<string, ClusterProfile>;
  generated_at: string;
}

export interface ClusteringVisualization {
  n_clusters: number;
  visualization_data: {
    cluster_statistics: Array<Record<string, any>>;
    cluster_labels: Record<string, string>;
    distribution: Record<string, number>;
  };
  cluster_summary: Record<string, ClusterProfile>;
  generated_at: string;
}

