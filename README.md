# Sales Analytics Frontend

Dashboard React para visualizar los resultados de los pipelines de análisis de Spark.

## Estructura de Datos

El frontend espera que los JSON generados por los pipelines estén en `public/data/` con la siguiente estructura:

```
public/
  data/
    summary/
      basic_metrics.json
      top_10_products.json
      top_10_customers.json
      top_10_categories.json
      top_10_categories_by_products.json
      top_10_peak_days.json
      top_10_peak_days_by_products.json
    analytics/
      daily_sales.json
      weekly_sales.json
      monthly_sales.json
      day_of_week_patterns_distribution.json
      category_products_by_store_distribution.json
      variable_correlation.json
    advanced/
      clustering/
        customer_clusters.json
        cluster_summary.json
        clustering_visualization.json
      recommendations/
        (archivos de recomendaciones cuando estén disponibles)
```

## Copiar Datos desde Spark

Después de ejecutar los pipelines, copia los JSON generados:

### Windows (PowerShell)
```powershell
# Desde el directorio raíz del proyecto
Copy-Item -Path "airflow\output\summary\*" -Destination "sales-frontend\public\data\summary\" -Recurse -Force
Copy-Item -Path "airflow\output\analytics\*" -Destination "sales-frontend\public\data\analytics\" -Recurse -Force
Copy-Item -Path "airflow\output\advanced\*" -Destination "sales-frontend\public\data\advanced\" -Recurse -Force
```

### Linux/Mac
```bash
# Desde el directorio raíz del proyecto
mkdir -p sales-frontend/public/data/{summary,analytics,advanced/{clustering,recommendations}}
cp -r airflow/output/summary/* sales-frontend/public/data/summary/
cp -r airflow/output/analytics/* sales-frontend/public/data/analytics/
cp -r airflow/output/advanced/* sales-frontend/public/data/advanced/
```

## Desarrollo

```bash
cd sales-frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`
