# 📊 Mivok Analytics Dashboard

Dashboard de KPIs en tiempo real para la plataforma Mivok - Sistema de contratación de DJs.

## ✨ Características

- **KPIs en Tiempo Real**: Métricas actualizadas automáticamente con Supabase Realtime
- **Gráficos Interactivos**: Visualizaciones con Tremor (AreaChart, DonutChart, LineChart, BarChart)
- **Filtros Avanzados**: Por fecha, año, tipo de evento, estado, ubicación
- **Cálculos Automáticos**: Conversiones, ingresos, ratings, tasas de rechazo
- **Responsive Design**: Optimizado para desktop y móvil
- **Exportación**: CSV y Excel multi-hoja con totales automáticos

## 🛠️ Tecnologías

- React 19 + TypeScript + Vite
- Tremor + Tailwind CSS
- Supabase (PostgreSQL + Realtime)
- Vercel / Netlify

## 🚀 Deploy en Netlify

### Variables de Entorno Requeridas

En tu panel de Netlify (`Site settings > Environment variables`):

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### Configuración de Build

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 20 (configurado en `.nvmrc`)

El proyecto incluye `netlify.toml` con configuración optimizada.

## 💻 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/itzbenja/mivok_kpi.git
cd mivok_kpi

# Instalar dependencias
npm install --legacy-peer-deps

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

## 🏃 Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

## 🗄️ Base de Datos

1. Ejecutar `database/schema.sql` en Supabase SQL Editor
2. Ejecutar `database/seed_data.sql` para generar 5000+ registros de prueba

## ⚠️ Solución de Problemas

### Error: "Missing Supabase environment variables"
Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén en Netlify environment variables.

### Build falla en Netlify
- Confirma Node 20 (verifica `.nvmrc`)
- Usa flag `--legacy-peer-deps` en npm install
- Revisa logs completos de Netlify

---

© 2025 Mivok Analytics · Desarrollado con ❤️
