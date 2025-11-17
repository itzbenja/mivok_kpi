import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Datos realistas Chile
const nombresChile = ['Matías','Benjamín','Sebastián','Vicente','Diego','Martín','Lucas','Nicolás','Gabriel','Felipe','Catalina','Sofía','Martina','Isidora','Florencia','Valentina','Emilia','Josefa','Amanda','Isabella'];
const apellidosChile = ['González','Muñoz','Rodríguez','García','Fernández','López','Martínez','Sánchez','Pérez','Rojas','Díaz','Torres','Silva','Contreras','Sepúlveda','Valenzuela','Morales','Navarro','Vásquez','Reyes'];
const comunasRM = ['Las Condes','Providencia','Santiago Centro','Ñuñoa','La Reina','Vitacura','Maipú','Puente Alto','La Florida','San Miguel','Quilicura','Independencia','Recoleta','Estación Central','Cerrillos','Pudahuel','Lo Barnechea'];
const generosMusicales = [['Reggaeton','Trap'],['House','Techno'],['Pop','Rock'],['Cumbia','Salsa'],['Electro','EDM'],['Hip Hop','R&B'],['Indie','Alternative'],['Clásica','Jazz']];
const tiposEvento = ['boda','cumpleaños','corporativo','fiesta','concierto','reunion','bar mitzvah','aniversario'];
const estados = ['pendiente','aceptado','rechazado','completado','cancelado'];
const motivosRechazo = ['Precio muy bajo','Fecha no disponible','Tipo de música no coincide','Lejos de mi zona','Evento muy largo','Cliente sin referencias','Ya tengo evento ese día','No trabajo ese tipo de eventos'];
const empresas = ['StartupTech','EventosPro','CreativosCL','MarketingPlus','ConsultoraCL','EmpresaSA','GrupoComercial','DesarrolloWeb','AgenciaDigital','ServiciosIntegrales'];
const comentariosPositivos = ['Excelente DJ, muy profesional','Música perfecta para el evento','Súper recomendado','Gran ambiente, todos bailaron','Puntual y atento','Equipos de calidad','Muy buen gusto musical','Animó todo el evento'];
const comentariosNegativos = ['Llegó tarde','Volumen muy alto','No respetó playlist','Poco profesional','Equipos con fallas','No cumplió expectativas'];

// Helpers
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 2) => (Math.random() * (max - min) + min).toFixed(decimals);
const randomItem = (arr) => arr[randomInt(0, arr.length - 1)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const formatDate = (date) => date.toISOString().split('T')[0];
const formatTime = (date) => date.toTimeString().split(' ')[0].substring(0,5);

// Generadores
function generarDJ(index) {
  const nombre = `${randomItem(nombresChile)} ${randomItem(apellidosChile)}`;
  const email = `dj${index}_${Date.now()}_${Math.random().toString(36).slice(2,7)}@mivok.cl`;
  const rating = randomFloat(3.5, 5.0, 2);
  return {
    nombre,
    email,
    rating: parseFloat(rating),
    activo: Math.random() > 0.1
  };
}

function generarCliente(index) {
  const nombre = `${randomItem(nombresChile)} ${randomItem(apellidosChile)}`;
  const email = `cliente${index}_${Date.now()}_${Math.random().toString(36).slice(2,7)}@gmail.com`;
  return {
    nombre,
    email,
    activo: Math.random() > 0.05
  };
}

function generarEvento(djId, clienteId, baseDate) {
  const tipo = randomItem(tiposEvento);
  const fechaEvento = randomDate(baseDate || new Date('2021-01-01'), new Date('2025-11-16'));
  const estado = randomItem(estados);
  const duracion = randomFloat(2, 8, 1);
  const precioOfrecido = randomInt(50, 400) * 1000;
  const precioFinal = estado === 'completado' ? precioOfrecido + randomInt(-20, 50) * 1000 : precioOfrecido;
  const ratingDJ = estado === 'completado' ? randomInt(3, 5) : null;
  const ratingCliente = estado === 'completado' ? randomInt(3, 5) : null;
  const comentarioCliente = estado === 'completado' ? (Math.random() > 0.3 ? randomItem(comentariosPositivos) : randomItem(comentariosNegativos)) : null;
  const motivoRechazo = estado === 'rechazado' ? randomItem(motivosRechazo) : null;
  
  return {
    dj_id: djId,
    cliente_id: clienteId,
    tipo_evento: tipo,
    fecha_evento: formatDate(fechaEvento),
    estado
  };
}

function generarPropuesta(eventoId, djId, precioBase) {
  const estados = ['pendiente','aceptado','rechazado'];
  const estado = randomItem(estados);
  return {
    evento_id: eventoId,
    dj_id: djId,
    estado
  };
}

// Main
async function main() {
  console.log('🚀 Iniciando generación masiva de datos...\n');
  
  const NUM_DJS = 300;
  const NUM_CLIENTES = 500;
  const NUM_EVENTOS = 5000;
  const BATCH_SIZE = 500;
  
  // 1. DJs
  console.log(`📀 Generando ${NUM_DJS} DJs...`);
  const djs = Array.from({ length: NUM_DJS }, (_, i) => generarDJ(i + 1));
  const { data: insertedDJs, error: djError } = await supabase.from('dj_profiles').insert(djs).select('id');
  if (djError) {
    console.error('❌ Error insertando DJs:', djError.message);
    return;
  }
  console.log(`✅ ${insertedDJs.length} DJs insertados\n`);
  
  // 2. Clientes
  console.log(`👥 Generando ${NUM_CLIENTES} clientes...`);
  const clientes = Array.from({ length: NUM_CLIENTES }, (_, i) => generarCliente(i + 1));
  const { data: insertedClientes, error: clienteError } = await supabase.from('user_profiles').insert(clientes).select('id');
  if (clienteError) {
    console.error('❌ Error insertando clientes:', clienteError.message);
    return;
  }
  console.log(`✅ ${insertedClientes.length} clientes insertados\n`);
  
  // 3. Eventos (en lotes)
  console.log(`🎉 Generando ${NUM_EVENTOS} eventos en lotes de ${BATCH_SIZE}...`);
  const djIds = insertedDJs.map(dj => dj.id);
  const clienteIds = insertedClientes.map(c => c.id);
  
  let totalEventosInsertados = 0;
  const allEventIds = [];
  
  for (let i = 0; i < NUM_EVENTOS; i += BATCH_SIZE) {
    const batch = Array.from({ length: Math.min(BATCH_SIZE, NUM_EVENTOS - i) }, () => 
      generarEvento(randomItem(djIds), randomItem(clienteIds))
    );
    
    const { data: insertedEvents, error: eventError } = await supabase.from('events').insert(batch).select('id,dj_id');
    if (eventError) {
      console.error(`❌ Error insertando lote ${Math.floor(i/BATCH_SIZE) + 1}:`, eventError.message);
      continue;
    }
    
    totalEventosInsertados += insertedEvents.length;
    allEventIds.push(...insertedEvents);
    console.log(`   Lote ${Math.floor(i/BATCH_SIZE) + 1}: ${insertedEvents.length} eventos insertados`);
  }
  console.log(`✅ Total ${totalEventosInsertados} eventos insertados\n`);
  
  // 4. Propuestas (1-3 por evento)
  console.log(`💼 Generando propuestas (1-3 por evento)...`);
  const propuestas = [];
  for (const event of allEventIds) {
    const numPropuestas = randomInt(1, 3);
    for (let i = 0; i < numPropuestas; i++) {
      propuestas.push(generarPropuesta(event.id, randomItem(djIds), randomInt(50, 400) * 1000));
    }
  }
  
  let totalPropuestasInsertadas = 0;
  for (let i = 0; i < propuestas.length; i += BATCH_SIZE) {
    const batch = propuestas.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.from('proposals').insert(batch);
    if (error) {
      console.error(`❌ Error insertando propuestas lote ${Math.floor(i/BATCH_SIZE) + 1}:`, error.message);
      continue;
    }
    totalPropuestasInsertadas += batch.length;
    console.log(`   Lote ${Math.floor(i/BATCH_SIZE) + 1}: ${batch.length} propuestas insertadas`);
  }
  console.log(`✅ Total ${totalPropuestasInsertadas} propuestas insertadas\n`);
  
  console.log('🎊 ¡Generación masiva completada!');
  console.log(`📊 Resumen:`);
  console.log(`   - DJs: ${insertedDJs.length}`);
  console.log(`   - Clientes: ${insertedClientes.length}`);
  console.log(`   - Eventos: ${totalEventosInsertados}`);
  console.log(`   - Propuestas: ${totalPropuestasInsertadas}`);
}

main().catch(console.error);
