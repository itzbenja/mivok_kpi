# 🔥 Guía de Configuración de Firebase para Mivok Analytics

## ✅ **Firebase está instalado y listo**

El proyecto ya está configurado para usar Firebase Firestore. Ahora necesitas:

## 📋 Paso 1: Crear Proyecto Firebase (5 minutos)

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click en **"Agregar proyecto"** o **"Create a project"**
3. Nombre del proyecto: **`mivok-analytics`**
4. Click "Continuar"
5. **Deshabilita Google Analytics** (no lo necesitamos por ahora) o actívalo si quieres
6. Click "Crear proyecto"
7. Espera ~30 segundos

## 📱 Paso 2: Registrar App Web

1. En el dashboard, click en el icono **</> (Web)**
2. Nombre de la app: **`Mivok Dashboard`**
3. **NO marques** "Firebase Hosting"
4. Click "Registrar app"
5. **Copia** el objeto `firebaseConfig` que aparece (lo necesitas en el paso 4)

```javascript
// Se verá algo así:
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "mivok-analytics.firebaseapp.com",
  projectId: "mivok-analytics",
  storageBucket: "mivok-analytics.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXX"
};
```

## 🗄️ Paso 3: Crear Firestore Database

1. En el menú lateral, click en **"Firestore Database"**
2. Click **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de producción"** (lo configuraremos después)
4. Ubicación: Elige la más cercana (ej: `us-east1` o `southamerica-east1`)
5. Click "Habilitar"
6. Espera ~1 minuto

### Configurar Reglas de Seguridad

1. Ve a la pestaña **"Reglas"**
2. Reemplaza el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura a todos (solo para desarrollo/demo)
    match /{document=**} {
      allow read: if true;
      allow write: if false; // Solo escritura desde backend/admin
    }
  }
}
```

3. Click **"Publicar"**

⚠️ **IMPORTANTE**: Estas reglas permiten lectura pública (para el dashboard). En producción, agrega autenticación.

## 🔑 Paso 4: Configurar Variables de Entorno

Edita el archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=AIzaSyB...
VITE_FIREBASE_AUTH_DOMAIN=mivok-analytics.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mivok-analytics
VITE_FIREBASE_STORAGE_BUCKET=mivok-analytics.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXX
```

⚠️ Reemplaza con tus valores reales del paso 2

## 📊 Paso 5: Subir las Tablas/Colecciones que Tienes

**AHORA**: Pásame las tablas que tienes (estructura y datos) y te genero el script para subirlas a Firebase.

### Opciones para subir datos:

#### Opción A: Con Node.js Script (Recomendado)

Te crearé un script `upload-data.js` que:
- Lee tus datos
- Los sube a Firestore
- Crea las 4 colecciones: `djs`, `clientes`, `eventos`, `transacciones`

#### Opción B: Importación desde CSV/JSON

1. Exporta tus datos actuales a JSON
2. Usa el script de importación que te crearé

#### Opción C: Manual (para pocos datos)

En Firebase Console → Firestore:
1. Click "Iniciar colección"
2. ID de colección: `eventos`
3. Agregar documentos uno por uno

## 🎯 Estructura de Datos en Firestore

### Colección: `djs`
```javascript
{
  nombre: string,
  email: string,
  telefono: string,
  generos_musicales: string[],
  precio_hora_min: number,
  precio_hora_max: number,
  ubicacion: string,
  rating: number,
  total_eventos: number,
  eventos_completados: number,
  eventos_rechazados: number,
  fecha_registro: Timestamp,
  activo: boolean
}
```

### Colección: `clientes`
```javascript
{
  nombre: string,
  email: string,
  telefono: string,
  empresa: string | null,
  ubicacion: string,
  total_eventos: number,
  fecha_registro: Timestamp,
  activo: boolean
}
```

### Colección: `eventos`
```javascript
{
  dj_id: string,
  cliente_id: string,
  tipo_evento: string,
  fecha_evento: Timestamp,
  hora_inicio: string,
  duracion_horas: number,
  ubicacion: string,
  precio_ofrecido: number,
  precio_final: number | null,
  estado: string, // 'pendiente' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado'
  motivo_rechazo: string | null,
  rating_dj: number | null,
  rating_cliente: number | null,
  comentario_cliente: string | null,
  fecha_creacion: Timestamp
}
```

### Colección: `transacciones`
```javascript
{
  evento_id: string,
  monto: number,
  comision_plataforma: number,
  metodo_pago: string,
  estado: string,
  fecha_transaccion: Timestamp
}
```

## ✅ Verificar Instalación

```bash
npm run dev
```

Abre: http://localhost:5173

Si ves errores de "Missing Firebase environment variables", verifica el `.env`

## 🔧 Próximos Pasos

1. **Pásame tus tablas/datos** → Te genero el script de migración
2. Ejecutas el script → Datos en Firebase
3. Dashboard funcionando con datos reales
4. Listo para presentar 🎉

## 📝 Comandos Útiles

```bash
# Instalar dependencias (ya hecho)
npm install --legacy-peer-deps

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que el API Key en `.env` sea correcto
- Reinicia el servidor: Ctrl+C, luego `npm run dev`

### No hay datos en el dashboard
- Verifica que las colecciones existan en Firestore Console
- Las colecciones deben llamarse exactamente: `djs`, `clientes`, `eventos`, `transacciones`

### Reglas de Firestore denying access
- Ve a Firestore → Reglas
- Asegúrate que `allow read: if true;` esté habilitado

---

**¡Listo!** Ahora pásame las tablas que tienes para generar el script de migración 🚀
