# 📊 Generación de Datos Masivos - Mivok KPI

## 🎯 Objetivo
Generar **5,000+ registros realistas** para poblar la base de datos y poder demostrar el dashboard con datos significativos.

## 📦 Datos que se generan

| Tabla | Cantidad | Descripción |
|-------|----------|-------------|
| **DJs** | 300 | Nombres chilenos, comunas RM, géneros musicales, precios/hora realistas |
| **Clientes** | 500 | Personas y empresas con datos chilenos |
| **Eventos** | 5,000 | Distribuidos 2021-2025, todos los tipos y estados |
| **Propuestas** | ~10,000 | 1-3 propuestas por evento |

## 🚀 Pasos para ejecutar

### 1. Verificar variables de entorno
Asegúrate de tener en tu archivo `.env`:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon
```

### 2. Ejecutar el script
```bash
node scripts/generate-massive-data.mjs
```

⏱️ **Tiempo estimado:** 2-3 minutos

### 3. Verificar en Supabase
Ve a tu proyecto en Supabase > Table Editor y verifica:
- `dj_profiles`: ~300 registros
- `user_profiles`: ~500 registros
- `events`: ~5,000 registros
- `proposals`: ~10,000 registros

## 🎨 Características de los datos

### DJs realistas
- ✅ Nombres y apellidos chilenos comunes
- ✅ Comunas de la Región Metropolitana
- ✅ Géneros musicales variados (Reggaeton, House, Cumbia, etc.)
- ✅ Precios entre $25k-$130k por hora
- ✅ Ratings 3.5-5.0 estrellas
- ✅ 90% activos, 10% inactivos

### Eventos realistas
- ✅ Tipos: boda, cumpleaños, corporativo, fiesta, concierto, etc.
- ✅ Estados: pendiente, aceptado, rechazado, completado, cancelado
- ✅ Precios $50k-$400k según tipo y duración
- ✅ Fechas distribuidas 2021-2025
- ✅ Motivos de rechazo lógicos
- ✅ Ratings y comentarios en eventos completados

### Propuestas realistas
- ✅ 1-3 propuestas por evento
- ✅ Variación de precios ±$30k
- ✅ Estados coherentes (pendiente/aceptado/rechazado)
- ✅ Mensajes contextuales

## 📈 KPIs que podrás analizar después

Con estos datos podrás demostrar:

1. **Rechazos por DJ** → ¿Qué DJs rechazan más eventos?
2. **Precio promedio por DJ** → ¿Quiénes cobran más?
3. **Variación precio ofrecido vs final** → ¿Cuánto negocian?
4. **Clientes recurrentes** → ¿Cuántos vuelven a contratar?
5. **Distribución por tipo de evento** → ¿Qué eventos son más populares?
6. **Tendencias temporales** → ¿Qué meses son pico?
7. **Tasas de conversión** → ¿Cuántos eventos se completan?

## ⚠️ Notas importantes

- **El script NO borra datos existentes**, solo inserta nuevos
- Si ejecutas múltiples veces, tendrás registros duplicados
- Los emails tienen timestamps únicos para evitar colisiones
- El script usa lotes de 500 registros para optimizar inserciones

## 🔄 Para regenerar datos limpios

Si quieres empezar de cero:

1. Ve a Supabase SQL Editor
2. Ejecuta:
```sql
TRUNCATE TABLE proposals, events, user_profiles, dj_profiles CASCADE;
```
3. Vuelve a ejecutar: `node scripts/generate-massive-data.mjs`

## 🎓 Para el "profe"

Este dataset permite demostrar:
- ✅ Filtros por año → "Cuántos contrataron en 2025"
- ✅ Filtros por estado → "Solo eventos completados"
- ✅ Análisis de precios → "Precio promedio por hora de cada DJ"
- ✅ Análisis de rechazos → "Qué DJs rechazan más"
- ✅ ROI de marketing → "Cuántos clientes realmente contratan"
- ✅ Exportación Excel → Archivos multi-hoja profesionales

---

**¿Problemas?** Verifica que las tablas en Supabase se llamen exactamente:
- `dj_profiles`
- `user_profiles`
- `events`
- `proposals`
