/*
  Script para generar ~5000 registros sintéticos realistas para las tablas usadas por el dashboard:
  - dj_profiles
  - user_profiles (clientes)
  - events
  - proposals

  Requisitos:
    Variables de entorno: VITE_SUPABASE_URL, VITE_SUPABASE_SERVICE_KEY (usar service role para inserts masivos)
  Uso:
    npx ts-node scripts/generateSyntheticData.ts  (o compilar a JS y ejecutar con node)

  NOTA: No usa faker directamente para evitar instalar aún más dependencias; generadores simples + listas.
*/

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
// Usar SERVICE KEY para poder insertar (NO la anon key)
const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!url || !serviceKey) {
  console.error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// Helpers
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const generos = ['house','techno','edm','pop','urban','trap','latin','rock'];
const tiposEvento = ['boda','corporativo','cumpleaños','fiesta','concierto'];
const ubicaciones = ['Santiago','Valparaíso','Concepción','La Serena','Antofagasta','Temuco'];
const estadosEvento = ['pendiente','aceptado','rechazado','completado','cancelado'];
const estadosPropuesta = ['pendiente','aceptado','rechazado','expirado'];

interface DJProfile {
  id?: string;
  nombre: string;
  email: string;
  genero_principal: string;
  generos_secundarios: string[];
  precio_min_hora: number;
  precio_max_hora: number;
  ubicacion: string;
  rating: number;
  activo: boolean;
  created_at?: string;
}

interface UserProfile {
  id?: string;
  nombre: string;
  email: string;
  empresa?: string;
  ubicacion: string;
  activo: boolean;
  created_at?: string;
}

interface EventRow {
  id?: string;
  dj_id: string;
  user_id: string;
  tipo_evento: string;
  fecha_evento: string; // ISO date
  precio_ofrecido: number;
  precio_final: number | null;
  estado: string;
  duracion_horas: number;
  created_at?: string;
}

interface ProposalRow {
  id?: string;
  dj_id: string;
  user_id: string;
  evento_id?: string | null; // algunas propuestas vinculadas luego
  precio_propuesto: number;
  estado: string;
  created_at?: string;
}

async function generate() {
  console.time('TOTAL');
  // 1. DJs
  const djCount = 150;
  const djs: DJProfile[] = Array.from({ length: djCount }).map((_, i) => {
    const base = rand(25, 60) * 1000; // precio mínimo
    const max = base + rand(10, 40) * 1000;
    return {
      nombre: `DJ_${i.toString().padStart(3,'0')}`,
      email: `dj${i}@test.local`,
      genero_principal: sample(generos),
      generos_secundarios: Array.from(new Set([sample(generos), sample(generos)])).slice(0, rand(1,2)),
      precio_min_hora: base,
      precio_max_hora: max,
      ubicacion: sample(ubicaciones),
      rating: (Math.random() * 2 + 3).toFixed(2) as unknown as number,
      activo: Math.random() > 0.05
    };
  });

  const { data: insertedDJs, error: djError } = await supabase.from('dj_profiles').insert(djs).select();
  if (djError) throw djError;
  console.log(`Insertados DJs: ${insertedDJs?.length}`);

  // 2. Usuarios (clientes)
  const userCount = 800;
  const users: UserProfile[] = Array.from({ length: userCount }).map((_, i) => ({
    nombre: `Cliente_${i.toString().padStart(3,'0')}`,
    email: `cliente${i}@test.local`,
    empresa: Math.random() > 0.7 ? `Empresa_${rand(1,300)}` : undefined,
    ubicacion: sample(ubicaciones),
    activo: Math.random() > 0.1
  }));
  const { data: insertedUsers, error: userError } = await supabase.from('user_profiles').insert(users).select();
  if (userError) throw userError;
  console.log(`Insertados Usuarios: ${insertedUsers?.length}`);

  // Map ids para eventos/propuestas
  const djIds = insertedDJs!.map(d => d.id);
  const userIds = insertedUsers!.map(u => u.id);

  // 3. Eventos (~5000)
  const eventCount = 5000;
  const events: EventRow[] = [];
  for (let i = 0; i < eventCount; i++) {
    const dj_id = sample(djIds);
    const user_id = sample(userIds);
    const tipo = sample(tiposEvento);
    // Distribuir fechas últimos 4.5 años
    const start = new Date(2021,0,1).getTime();
    const end = Date.now();
    const fechaMillis = rand(start, end);
    const fecha = new Date(fechaMillis);
    const fecha_evento = fecha.toISOString().substring(0,10);
    const duracion_horas = rand(2,8);
    const precioBaseHora = rand(30,90) * 1000;
    const precio_ofrecido = Math.round(precioBaseHora * duracion_horas * (Math.random()*0.25 + 0.9));
    const estado = sample(estadosEvento);
    const precio_final = ['completado','aceptado'].includes(estado) ? Math.round(precio_ofrecido * (Math.random()*0.15 + 0.95)) : null;
    events.push({ dj_id, user_id, tipo_evento: tipo, fecha_evento, precio_ofrecido, precio_final, estado, duracion_horas });
  }

  // Insertar por lotes para evitar payload grande
  const batchSize = 1000;
  let insertedEvents: any[] = [];
  for (let i = 0; i < events.length; i += batchSize) {
    const slice = events.slice(i, i + batchSize);
    const { data, error } = await supabase.from('events').insert(slice).select();
    if (error) throw error;
    insertedEvents = insertedEvents.concat(data!);
    console.log(`Eventos insertados acumulados: ${insertedEvents.length}`);
  }

  // 4. Proposals (~7000) generadas a partir de eventos y algunos usuarios/djs extra
  const proposalCount = 7000;
  const proposals: ProposalRow[] = [];
  for (let i = 0; i < proposalCount; i++) {
    const dj_id = sample(djIds);
    const user_id = sample(userIds);
    const linkEvento = Math.random() > 0.6 ? sample(insertedEvents).id : null;
    const precio_propuesto = rand(50,120) * 1000;
    const estado = sample(estadosPropuesta);
    proposals.push({ dj_id, user_id, evento_id: linkEvento, precio_propuesto, estado });
  }
  for (let i = 0; i < proposals.length; i += batchSize) {
    const slice = proposals.slice(i, i + batchSize);
    const { error } = await supabase.from('proposals').insert(slice);
    if (error) throw error;
    console.log(`Propuestas insertadas acumuladas: ${Math.min(i + batchSize, proposals.length)}`);
  }

  console.log('✔ Datos sintéticos generados. Totales:');
  console.log(`   DJs: ${djIds.length}`);
  console.log(`   Usuarios: ${userIds.length}`);
  console.log(`   Eventos: ${insertedEvents.length}`);
  console.log(`   Propuestas: ${proposals.length}`);
  console.timeEnd('TOTAL');
}

generate().catch(err => {
  console.error('Error generando datos:', err);
  process.exit(1);
});
