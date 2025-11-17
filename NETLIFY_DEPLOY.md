# 🚀 Guía de Deploy en Netlify - Mivok KPI Dashboard

## ✅ Pre-requisitos

1. Cuenta en Netlify (https://netlify.com)
2. Repositorio GitHub: https://github.com/itzbenja/mivok_kpi
3. Credenciales de Supabase (URL + Anon Key)

## 📋 Pasos para Deploy

### 1️⃣ Importar Proyecto en Netlify

1. Ve a https://app.netlify.com
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **"Deploy with GitHub"**
4. Autoriza a Netlify si es la primera vez
5. Busca y selecciona el repositorio: `itzbenja/mivok_kpi`

### 2️⃣ Configuración de Build

Netlify **detectará automáticamente** la configuración de `netlify.toml`, pero verifica:

```
Build command: npm run build
Publish directory: dist
```

### 3️⃣ Variables de Entorno (CRÍTICO ⚠️)

**Antes de hacer deploy**, configura las variables de entorno:

1. En la página de configuración del site, ve a: **Site settings → Environment variables**
2. Click en **"Add a variable"** y agrega:

```
Key: VITE_SUPABASE_URL
Value: tu_url_de_supabase (ej: https://xxxxx.supabase.co)

Key: VITE_SUPABASE_ANON_KEY
Value: tu_clave_anonima_de_supabase
```

💡 **Importante**: Si no configuras estas variables, el build fallará con error:
```
Error: Missing Supabase environment variables
```

### 4️⃣ Deploy

1. Click en **"Deploy site"**
2. Espera 1-2 minutos mientras Netlify:
   - Instala dependencias con `npm install --legacy-peer-deps`
   - Ejecuta TypeScript check
   - Hace build con Vite
   - Publica la carpeta `dist`

### 5️⃣ Verificar Deploy

Una vez completado, verás:
- ✅ Estado: **Published**
- 🔗 URL de tu site: `https://[random-name].netlify.app`

Click en la URL para verificar que el dashboard funcione.

## 🔧 Solución de Problemas Comunes

### ❌ Error: "Missing Supabase environment variables"

**Causa**: Variables de entorno no configuradas en Netlify

**Solución**:
1. Ve a: `Site settings → Environment variables`
2. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. En la pestaña **"Deploys"**, click en **"Trigger deploy"** → **"Clear cache and deploy site"**

---

### ❌ Error: "Module not found" o "Cannot find module"

**Causa**: Dependencias no instaladas correctamente

**Solución**:
1. Verifica que `netlify.toml` tenga `NPM_FLAGS = "--legacy-peer-deps"`
2. En Netlify: **Deploys → Trigger deploy → Clear cache and deploy site**

---

### ❌ Error: Node version incompatible

**Causa**: Netlify usa versión incorrecta de Node

**Solución**:
El proyecto incluye `.nvmrc` con Node 20, pero si falla:
1. Ve a: `Site settings → Environment variables`
2. Agrega variable:
   ```
   Key: NODE_VERSION
   Value: 20
   ```
3. Redeploy

---

### ❌ Build funciona localmente pero falla en Netlify

**Diagnóstico**:
1. En Netlify, ve a: **Deploys → [último deploy fallido] → Deploy log**
2. Busca la primera línea con `Error:` o que esté marcada en rojo
3. Copia el error completo (incluyendo stack trace)

**Causas comunes**:
- Variables de entorno no configuradas
- Archivos no commiteados a Git
- Dependencias con versiones incompatibles

**Solución rápida**:
```bash
# En tu máquina local, prueba el build "limpio" como lo hace Netlify:
rm -rf node_modules
rm -rf dist
npm install --legacy-peer-deps
npm run build
```

Si falla localmente, ese es el error que verá Netlify. Arregla y haz commit/push.

---

### ❌ Site deploye pero muestra página en blanco

**Causa**: Variables de entorno no disponibles en runtime

**Solución**:
1. Abre DevTools del navegador (F12)
2. Ve a la pestaña **Console**
3. Si ves: `Missing Supabase environment variables`, repite el paso 3️⃣
4. Haz un nuevo deploy: **Deploys → Trigger deploy → Deploy site**

---

## 🎯 Configuración Recomendada Adicional

### Custom Domain (Opcional)

1. **Site settings → Domain management → Add custom domain**
2. Sigue las instrucciones para configurar DNS

### Deploy Previews (Automático)

Netlify ya está configurado para crear preview deploys automáticos en cada pull request.

### Deploy Hooks (Opcional)

Si quieres trigger builds desde Supabase u otro servicio:

1. **Site settings → Build & deploy → Build hooks**
2. **Add build hook** → Dale un nombre
3. Copia la URL generada
4. Usa esa URL con POST request para trigger builds

---

## 📊 Monitoreo Post-Deploy

Una vez deployed, verifica:

- ✅ Dashboard carga correctamente
- ✅ KPIs muestran datos reales
- ✅ Gráficos se renderizan
- ✅ Filtros funcionan
- ✅ Exportación CSV/Excel funciona
- ✅ Tema claro/oscuro cambia
- ✅ Responsive en móvil

---

## 🆘 ¿Aún tienes problemas?

1. **Revisa los logs completos** en Netlify: `Deploys → [deploy] → Deploy log`
2. **Copia el error completo** (incluyendo líneas de contexto antes y después)
3. **Comparte el error** con stack trace completo para diagnóstico específico

---

© 2025 Mivok Analytics
