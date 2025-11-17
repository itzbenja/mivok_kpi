#  Mivok Analytics Dashboard

Dashboard de KPIs en tiempo real para la plataforma Mivok - Sistema de contratación de DJs.

##  Características

- **KPIs en Tiempo Real**: Métricas actualizadas automáticamente con Supabase Realtime
- **Gráficos Interactivos**: Visualizaciones con Tremor (AreaChart, DonutChart, LineChart, BarChart)
- **Filtros Avanzados**: Por fecha, año, tipo de evento, estado, ubicación
- **Cálculos Automáticos**: Conversiones, ingresos, ratings, tasas de rechazo
- **Responsive Design**: Optimizado para desktop y móvil

##  Tecnologías

- React 19 + TypeScript + Vite
- Tremor + Tailwind CSS
- Supabase (PostgreSQL + Realtime)
- Vercel

##  Instalación

```bash
npm install --legacy-peer-deps
cp .env.example .env
# Editar .env con credenciales de Supabase
```

##  Desarrollo

```bash
npm run dev
```

##  Base de Datos

1. Ejecutar database/schema.sql en Supabase
2. Ejecutar database/seed_data.sql para generar 5000 registros

Mivok  2025
