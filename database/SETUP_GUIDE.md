# 🗃️ Guía de Configuración de Base de Datos Supabase

## Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Configura:
   - **Name**: mivok-analytics
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Elige la más cercana
5. Espera ~2 minutos mientras se crea el proyecto

## Paso 2: Ejecutar Schema (Crear Tablas)

1. En el dashboard de Supabase, ve a **SQL Editor** (icono de base de datos en el menú izquierdo)
2. Click en "New Query"
3. Copia y pega el contenido completo de `database/schema.sql`
4. Click en **"RUN"** (esquina inferior derecha)
5. Deberías ver: ✅ Success. No rows returned

### ¿Qué hace este script?
- Crea 4 tablas: `djs`, `clientes`, `eventos`, `transacciones`
- Establece relaciones entre tablas
- Crea índices para optimizar queries

## Paso 3: Generar Datos de Prueba (5000 registros)

1. En SQL Editor, click en "New Query"
2. Copia y pega el contenido completo de `database/seed_data.sql`
3. Click en **"RUN"**
4. Espera ~30 segundos (es normal, está generando muchos datos)
5. Verifica que veas el resumen:
   ```
   DJs insertados: 200
   Clientes insertados: 500
   Eventos insertados: 5000
   Transacciones insertadas: ~3500
   ```

### ¿Qué datos se generan?

- **200 DJs**: Con nombres, géneros musicales, precios, ratings
- **500 Clientes**: Personas y empresas
- **5000 Eventos**: Del 2023 al 2025, con diferentes estados
- **~3500 Transacciones**: Para eventos completados/cancelados

## Paso 4: Obtener Credenciales

1. En el dashboard, ve a **Settings** → **API**
2. Copia estos valores:

### Project URL
```
https://xxxxxxxxxx.supabase.co
```

### anon/public key (API Key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

## Paso 5: Configurar Variables de Entorno

1. En la raíz del proyecto, edita el archivo `.env`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: Reemplaza con tus valores reales

## Paso 6: Verificar la Instalación

### Desde Supabase Dashboard

1. Ve a **Table Editor**
2. Deberías ver las 4 tablas: `djs`, `clientes`, `eventos`, `transacciones`
3. Click en cada tabla para ver los datos

### Desde tu App

1. Ejecuta: `npm run dev`
2. Abre: http://localhost:5173
3. Deberías ver KPIs con datos reales

## 🔍 Queries Útiles para Verificar

```sql
-- Ver total de registros
SELECT 
  (SELECT COUNT(*) FROM djs) as total_djs,
  (SELECT COUNT(*) FROM clientes) as total_clientes,
  (SELECT COUNT(*) FROM eventos) as total_eventos,
  (SELECT COUNT(*) FROM transacciones) as total_transacciones;

-- Ver eventos del 2025
SELECT tipo_evento, estado, COUNT(*) as cantidad
FROM eventos
WHERE EXTRACT(YEAR FROM fecha_evento) = 2025
GROUP BY tipo_evento, estado
ORDER BY cantidad DESC;

-- Ver top 10 DJs por rating
SELECT nombre, rating, eventos_completados, precio_hora_max
FROM djs
WHERE activo = true
ORDER BY rating DESC, eventos_completados DESC
LIMIT 10;
```

## 🚨 Troubleshooting

### Error: "relation does not exist"
- **Solución**: Ejecuta primero `schema.sql`, luego `seed_data.sql`

### Error: "permission denied"
- **Solución**: Verifica que el anon key sea correcto en `.env`

### Los KPIs muestran 0
- **Solución**: 
  1. Verifica que los scripts SQL se ejecutaron correctamente
  2. Check en Table Editor que las tablas tengan datos
  3. Revisa la consola del navegador (F12) para errores

### Error de CORS
- **Solución**: En Supabase → Settings → API → CORS, agrega `http://localhost:5173`

## 📊 Estructura de Datos

### djs
- 200 registros
- Géneros: House, Techno, Reggaeton, Latin, Rock, Pop, Hip Hop, R&B, Electronic, Trap
- Precios: $50,000 - $250,000 por hora
- Ubicaciones: Santiago, Valparaíso, Concepción, La Serena, Viña del Mar, etc.

### eventos
- 5000 registros (2023-2025)
- Estados: completado (60%), rechazado (10%), cancelado (5%), pendiente (15%), aceptado (10%)
- Tipos: Boda, Cumpleaños, Corporativo, Fiesta Temática, Graduación, Año Nuevo, Concierto

### transacciones
- ~3500 registros
- Comisión: 10% del precio final
- Métodos: Tarjeta, Transferencia, Efectivo

## ✅ Checklist Final

- [ ] Proyecto Supabase creado
- [ ] schema.sql ejecutado sin errores
- [ ] seed_data.sql ejecutado correctamente
- [ ] Tablas visibles en Table Editor con datos
- [ ] Variables de entorno configuradas en .env
- [ ] App corre con `npm run dev`
- [ ] Dashboard muestra datos reales

## 🎉 ¡Listo!

Tu dashboard ahora tiene 5000 eventos realistas para analizar. Puedes usar los filtros para:
- Ver eventos del 2025
- Filtrar por estado "completado"
- Analizar tipos de eventos más populares
- Ver ingresos mensuales
- Identificar DJs con mayor tasa de rechazo
