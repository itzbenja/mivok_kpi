import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Iniciando migración a Supabase...\n');

// Crear tablas
const createTables = async () => {
  console.log('📦 Creando tablas...');
  
  // Nota: Las tablas deben crearse desde el panel de Supabase SQL Editor
  // Aquí solo verificamos que existan
  const { data, error } = await supabase.from('dj_profiles').select('count');
  
  if (error && error.code === '42P01') {
    console.log('⚠️  Las tablas no existen. Por favor, créalas primero en Supabase.');
    console.log('Ve a: https://supabase.com/dashboard/project/wykdqxqevjqdttaeulku/editor');
    return false;
  }
  
  console.log('✅ Tablas verificadas\n');
  return true;
};

// Generar datos
const generateData = async () => {
  console.log('📊 Generando datos...\n');
  
  // Generar 200 DJs
  console.log('👨‍🎤 Generando 200 DJs...');
  const djs = [];
  for (let i = 0; i < 200; i++) {
    djs.push({
      nombre: `DJ ${['Max', 'Luna', 'Alex', 'Nova', 'Zen', 'Kai'][Math.floor(Math.random() * 6)]} ${i}`,
      email: `dj${i}@mivok.com`,
      telefono: `+569${Math.floor(Math.random() * 100000000)}`,
      especialidad: ['House', 'Techno', 'Reggaeton', 'Pop', 'Rock', 'EDM'][Math.floor(Math.random() * 6)],
      rating: (Math.random() * 2 + 3).toFixed(2),
      activo: Math.random() > 0.2,
      created_at: new Date(2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
    });
  }
  
  const { error: djError } = await supabase.from('dj_profiles').insert(djs);
  if (djError) console.error('Error insertando DJs:', djError);
  else console.log('✅ 200 DJs creados\n');
  
  // Generar 500 Clientes
  console.log('👥 Generando 500 Clientes...');
  const clientes = [];
  for (let i = 0; i < 500; i++) {
    clientes.push({
      nombre: `Cliente ${i}`,
      email: `cliente${i}@empresa.com`,
      telefono: `+569${Math.floor(Math.random() * 100000000)}`,
      empresa: `Empresa ${['Tech', 'Corp', 'Group', 'Solutions', 'Partners'][Math.floor(Math.random() * 5)]} ${i}`,
      activo: Math.random() > 0.15,
      created_at: new Date(2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
    });
  }
  
  const { error: clienteError } = await supabase.from('user_profiles').insert(clientes);
  if (clienteError) console.error('Error insertando clientes:', clienteError);
  else console.log('✅ 500 Clientes creados\n');
  
  // Obtener IDs para relaciones
  const { data: djIds } = await supabase.from('dj_profiles').select('id').limit(200);
  const { data: clienteIds } = await supabase.from('user_profiles').select('id').limit(500);
  
  // Generar 3500 Eventos
  console.log('🎉 Generando 3500 Eventos...');
  const eventos = [];
  const tipos = ['Boda', 'Cumpleaños', 'Corporativo', 'Fiesta Temática', 'Graduación', 'Año Nuevo', 'Concierto'];
  const estados = ['completado', 'pendiente', 'aceptado', 'rechazado', 'cancelado'];
  
  for (let i = 0; i < 3500; i++) {
    const djId = djIds[Math.floor(Math.random() * djIds.length)].id;
    const clienteId = clienteIds[Math.floor(Math.random() * clienteIds.length)].id;
    const estado = estados[Math.floor(Math.random() * estados.length)];
    const precio = Math.floor(Math.random() * 1500000) + 200000;
    
    eventos.push({
      dj_id: djId,
      cliente_id: clienteId,
      tipo_evento: tipos[Math.floor(Math.random() * tipos.length)],
      fecha_evento: new Date(2021 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      ubicacion: `${['Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar'][Math.floor(Math.random() * 4)]}, Chile`,
      duracion_horas: Math.floor(Math.random() * 6) + 2,
      precio_final: estado === 'completado' ? precio : null,
      estado: estado,
      created_at: new Date(2021 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
    });
    
    // Insertar en lotes de 100
    if (eventos.length === 100) {
      await supabase.from('events').insert(eventos);
      eventos.length = 0;
    }
  }
  
  if (eventos.length > 0) {
    await supabase.from('events').insert(eventos);
  }
  console.log('✅ 3500 Eventos creados\n');
  
  // Generar 5000 Propuestas
  console.log('📋 Generando 5000 Propuestas...');
  const propuestas = [];
  
  for (let i = 0; i < 5000; i++) {
    const djId = djIds[Math.floor(Math.random() * djIds.length)].id;
    const clienteId = clienteIds[Math.floor(Math.random() * clienteIds.length)].id;
    const estado = estados[Math.floor(Math.random() * estados.length)];
    
    propuestas.push({
      dj_id: djId,
      cliente_id: clienteId,
      precio_propuesto: Math.floor(Math.random() * 1500000) + 200000,
      descripcion: `Propuesta para evento ${tipos[Math.floor(Math.random() * tipos.length)]}`,
      estado: estado,
      created_at: new Date(2023 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
    });
    
    // Insertar en lotes de 100
    if (propuestas.length === 100) {
      await supabase.from('proposals').insert(propuestas);
      propuestas.length = 0;
    }
  }
  
  if (propuestas.length > 0) {
    await supabase.from('proposals').insert(propuestas);
  }
  console.log('✅ 5000 Propuestas creadas\n');
};

// Ejecutar migración
(async () => {
  const tablesExist = await createTables();
  
  if (!tablesExist) {
    console.log('\n📝 SQL para crear las tablas:');
    console.log(`
CREATE TABLE dj_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  especialidad TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT,
  empresa TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dj_id UUID REFERENCES dj_profiles(id),
  cliente_id UUID REFERENCES user_profiles(id),
  tipo_evento TEXT NOT NULL,
  fecha_evento TIMESTAMPTZ NOT NULL,
  ubicacion TEXT,
  duracion_horas INTEGER,
  precio_final NUMERIC(10,2),
  estado TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dj_id UUID REFERENCES dj_profiles(id),
  cliente_id UUID REFERENCES user_profiles(id),
  precio_propuesto NUMERIC(10,2) NOT NULL,
  descripcion TEXT,
  estado TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
    `);
    return;
  }
  
  await generateData();
  
  console.log('\n🎉 ¡Migración completada exitosamente!');
  console.log('📊 Datos cargados en Supabase');
})();
