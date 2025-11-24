# 💻 Sales Analytics Frontend

Dashboard construido en React + Vite para consumir los resultados que producen los pipelines de Spark (carpeta `airflow/`). Cada vista del dashboard lee archivos JSON almacenados en `public/data/`.

## 👥 Autores

- Juan David Colonia Aldana – A00395956
- Miguel Ángel Gonzalez Arango – A00395687

## 🗂️ Estructura de carpetas

```
sales-frontend/
├── public/
│   └── data/
│       ├── summary/
│       ├── analytics/
│       └── advanced/
│           ├── clustering/
│           └── recommendations/
└── src/
    ├── components/         # Secciones y visualizaciones (TimeSeriesChart, Boxplot, etc.)
    ├── hooks/              # Hooks para cargar JSON (useJsonData)
    ├── types/              # Tipos TypeScript compartidos
    └── App.tsx             # Layout principal con rutas
```

Cada ruta espera archivos concretos:

- `public/data/summary/`: métricas ejecutivas (`basic_metrics.json`, `top_10_products.json`, etc.).
- `public/data/analytics/`: series temporales, patrones por día y heatmaps.
- `public/data/advanced/clustering/`: resultados de segmentación.
- `public/data/advanced/recommendations/`: reglas e inferencias del recomendador.

> **Importante:** después de correr los pipelines en Spark, copia manualmente los JSON generados dentro de `airflow/output/` hacia las carpetas equivalentes en `public/data/`. Sin esos archivos el dashboard mostrará mensajes de “datos faltantes”.

## ⚙️ Cómo funciona

- Cada componente usa el hook `useJsonData` para leer el JSON correspondiente desde `public/data/...`.
- Los gráficos están construidos con Recharts (line charts, bar charts, heatmaps, boxplots).
- El dashboard se organiza en secciones (`ExecutiveSummarySection`, `AnalyticsSection`, `ClusteringSection`, `RecommendationsSection`) que corresponden 1:1 con los pipelines de Spark.

## 🧪 Desarrollo local

1. Clona el repositorio y asegúrate de tener Node 18+.
2. Copia los archivos JSON a `public/data/` como se describió arriba.
3. Instala dependencias y levanta el servidor de desarrollo:

   ```bash
   cd sales-frontend
   npm install
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173/`.

Para generar una versión estática (`npm run build`) recuerda dejar los JSON en `public/data/`, ya que el dashboard no hace llamadas a API externas: todo se sirve desde archivos estáticos.
