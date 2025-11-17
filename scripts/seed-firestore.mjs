// Script para generar y subir 5000 registros a Firestore
// Adaptado de tu estructura de Supabase

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7CKe0jGCmZLJd-Apb2nFmcEmnOrp1Mk",
  authDomain: "viewpoint-b147f.firebaseapp.com",
  projectId: "viewpoint-b147f",
  storageBucket: "viewpoint-b147f.firebasestorage.app",
  messagingSenderId: "440223022023",
  appId: "1:440223022023:web:4e47fe8345b1f64e3e7762",
  measurementId: "G-1MVGRJEM54"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helpers
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Datos base
const nombres = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Diego', 'Sofía', 'Miguel', 'Valentina'];
const apellidos = ['Martínez', 'Rodríguez', 'González', 'López', 'Hernández', 'García', 'Pérez', 'Sánchez'];
const djNames = ['DJ Pulse', 'DJ Vibe', 'DJ Nova', 'DJ Storm', 'DJ Echo', 'DJ Remix', 'DJ Bass', 'DJ Flow'];
const generos = ['House', 'Techno', 'Reggaeton', 'Latin', 'Rock', 'Pop', 'Hip Hop', 'R&B', 'Electronic', 'Trap'];
const ciudades = ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Viña del Mar', 'Antofagasta', 'Temuco'];
const tiposEvento = ['Boda', 'Cumpleaños', 'Corporativo', 'Fiesta Temática', 'Graduación', 'Año Nuevo', 'Concierto'];
const estados = ['pendiente', 'aceptada', 'rechazada', 'completada', 'cancelada'];

console.log('🔥 Iniciando migración a Firestore...\n');

async function generateData() {
  const djIds = [];
  const clienteIds = [];
  const proposalIds = [];

  // 1. Generar 200 DJs
  console.log('📀 Generando 200 DJs...');
  for (let i = 0; i < 200; i++) {
    const userId = `dj_${i}_${Date.now()}`;
    const generosSeleccionados = [randomItem(generos), randomItem(generos)];
    
    const djProfile = {
      user_id: userId,
      tarifa_por_hora: randomInt(50000, 250000),
      generos: generosSeleccionados,
      ubicacion: randomItem(ciudades),
      anos_en_app: randomInt(0, 5),
      eventos_realizados: randomInt(0, 100),
      calificacion: parseFloat((3 + Math.random() * 2).toFixed(2)),
      resenas_count: randomInt(0, 50),
      imagen_url: `https://i.pravatar.cc/150?img=${i}`,
      descripcion_largo: `DJ especializado en ${generosSeleccionados.join(' y ')}`,
      disponibilidad: { lunes: true, viernes: true, sabado: true, domingo: true },
      is_activo: Math.random() > 0.1,
      cuenta_con_equipamiento: randomItem(['Sí', 'No']),
      equipamiento: ['Tornamesas', 'Mixer', 'Luces LED'],
      created_at: Timestamp.fromDate(randomDate(new Date(2023, 0, 1), new Date())),
      updated_at: Timestamp.now()
    };

    const userProfile = {
      user_id: userId,
      first_name: randomItem(djNames),
      last_name: randomItem(apellidos),
      email: `dj${i}@mivok.com`,
      provider: 'email',
      is_dj: true,
      foto_url: djProfile.imagen_url,
      descripcion: djProfile.descripcion_largo,
      telefono: `+569${randomInt(10000000, 99999999)}`,
      ciudad: djProfile.ubicacion,
      created_at: djProfile.created_at,
      updated_at: djProfile.updated_at
    };

    await addDoc(collection(db, 'dj_profiles'), djProfile);
    await addDoc(collection(db, 'user_profiles'), userProfile);
    djIds.push(userId);

    if ((i + 1) % 50 === 0) console.log(`   ${i + 1}/200 DJs creados`);
  }
  console.log('✅ 200 DJs creados\n');

  // 2. Generar 500 Clientes
  console.log('👥 Generando 500 Clientes...');
  for (let i = 0; i < 500; i++) {
    const userId = `cliente_${i}_${Date.now()}`;
    
    const userProfile = {
      user_id: userId,
      first_name: randomItem(nombres),
      last_name: randomItem(apellidos),
      email: `cliente${i}@email.com`,
      provider: 'email',
      is_dj: false,
      foto_url: `https://i.pravatar.cc/150?img=${200 + i}`,
      descripcion: 'Cliente de Mivok',
      telefono: `+569${randomInt(10000000, 99999999)}`,
      ciudad: randomItem(ciudades),
      created_at: Timestamp.fromDate(randomDate(new Date(2023, 0, 1), new Date())),
      updated_at: Timestamp.now()
    };

    await addDoc(collection(db, 'user_profiles'), userProfile);
    clienteIds.push(userId);

    if ((i + 1) % 100 === 0) console.log(`   ${i + 1}/500 Clientes creados`);
  }
  console.log('✅ 500 Clientes creados\n');

  // 3. Generar 5000 Propuestas
  console.log('📋 Generando 5000 Propuestas...');
  for (let i = 0; i < 5000; i++) {
    const proposalId = `proposal_${i}_${Date.now()}`;
    const clienteId = randomItem(clienteIds);
    const djId = randomItem(djIds);
    const monto = randomInt(80000, 300000);
    const estado = randomItem(estados);
    const fechaEvento = randomDate(new Date(2023, 0, 1), new Date(2025, 11, 31));
    
    const proposal = {
      id: proposalId,
      client_id: clienteId,
      dj_id: djId,
      monto: monto,
      monto_contraoferta: estado === 'aceptada' ? monto + randomInt(-10000, 10000) : null,
      horas_duracion: randomInt(2, 8),
      detalles: `Evento de ${randomItem(tiposEvento)}`,
      estado: estado,
      estado_respuesta: estado === 'aceptada' ? 'aceptada' : estado === 'rechazada' ? 'rechazada' : null,
      fecha_evento: Timestamp.fromDate(fechaEvento),
      ubicacion_evento: randomItem(ciudades),
      generos_solicitados: [randomItem(generos), randomItem(generos)],
      ronda_contrapropuesta: randomInt(0, 2),
      created_at: Timestamp.fromDate(randomDate(new Date(2023, 0, 1), fechaEvento)),
      updated_at: Timestamp.now(),
      aceptada_at: estado === 'aceptada' ? Timestamp.now() : null,
      completada_at: estado === 'completada' ? Timestamp.now() : null
    };

    await addDoc(collection(db, 'proposals'), proposal);
    
    if (estado === 'completada' || estado === 'aceptada') {
      proposalIds.push({ proposalId, clienteId, djId, monto, fechaEvento });
    }

    if ((i + 1) % 500 === 0) console.log(`   ${i + 1}/5000 Propuestas creadas`);
  }
  console.log('✅ 5000 Propuestas creadas\n');

  // 4. Generar Eventos (para propuestas completadas/aceptadas)
  console.log('🎉 Generando Eventos...');
  let eventCount = 0;
  for (const prop of proposalIds.slice(0, 3500)) {
    const event = {
      proposal_id: prop.proposalId,
      client_id: prop.clienteId,
      dj_id: prop.djId,
      monto_final: prop.monto,
      fecha: Timestamp.fromDate(prop.fechaEvento),
      hora_inicio: `${randomInt(15, 23)}:00`,
      hora_fin: `${randomInt(23, 4)}:00`,
      ubicacion: randomItem(ciudades),
      generos_confirmados: [randomItem(generos), randomItem(generos)],
      descripcion: `Evento ${randomItem(tiposEvento)}`,
      estado: 'completado',
      calificacion_cliente: randomInt(3, 5),
      resena_cliente: randomItem(['Excelente', 'Muy bueno', 'Buena música', 'Cumplió expectativas']),
      calificacion_dj: randomInt(3, 5),
      resena_dj: randomItem(['Cliente puntual', 'Buen ambiente', 'Todo en orden']),
      comprobante_url: null,
      created_at: Timestamp.fromDate(prop.fechaEvento),
      updated_at: Timestamp.now(),
      cancelada_at: null
    };

    await addDoc(collection(db, 'events'), event);
    eventCount++;

    if (eventCount % 500 === 0) console.log(`   ${eventCount}/3500 Eventos creados`);
  }
  console.log(`✅ ${eventCount} Eventos creados\n`);

  console.log('🎊 ¡Migración completada exitosamente!');
  console.log('\nResumen:');
  console.log(`  - 200 DJs`);
  console.log(`  - 500 Clientes`);
  console.log(`  - 5000 Propuestas`);
  console.log(`  - ${eventCount} Eventos`);
  console.log('\n✅ Datos listos para el dashboard');
}

generateData().catch(console.error);
