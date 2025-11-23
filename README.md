# Sales Analytics Dashboard (React + Vite)

Frontend ligero para visualizar los resultados exportados por los DAGs de Airflow. Lee los JSON ubicados en `public/data` y muestra métricas, tablas y gráficas usando Recharts.

## 🚀 Puesta en marcha

```bash
cd sales-frontend
npm install
npm run dev
# Build
npm run build
```

La aplicación asume que existe una carpeta `public/data` con la misma estructura que `airflow/output/dashboard`.

## 🔄 Flujo de datos

1. Ejecuta los DAGs en Airflow.
2. Copia los artefactos hacia el frontend:

   ```bash
   # Opción 1: variable en .env dentro del proyecto Airflow
   # FRONTEND_PUBLIC_PATH=/ruta/al/proyecto/sales-frontend/public/data

   # Opción 2: script manual
   python scripts/sync_dashboard_outputs.py
   ```

3. Inicia `npm run dev` y abre http://localhost:5173.

Cada DAG genera:

- `public/data/<dag_id>/latest/manifest.json` → describe las tareas y artefactos disponibles.
- Archivos JSON por artefacto (`metrics`, `table`, `data`) con sus valores.
- `public/data/index.json` → listado global de DAGs sincronizados.

## 📁 Estructura esperada en `public/data`

```
public/data/
├── index.json
└── advanced_sales_analytics/
    └── latest/
        ├── manifest.json
        ├── temporal_analysis/
        │   ├── temporal_overview.json
        │   ├── weekly_sales.json
        │   └── ...
        └── ...
```

El archivo `manifest.json` incluye el campo `relative_path` que se usa para cargar cada artefacto. Si necesitas depurar, revisa la consola del navegador para ver los fetch realizados.
