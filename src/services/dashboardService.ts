/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  onSnapshot,
  query,
  limit
} from 'firebase/firestore';
import type { KPIData, Filtros, ChartData } from '../types';

export const dashboardService = {
  // Obtener KPIs principales
  async getKPIs(filtros?: Filtros): Promise<KPIData> {
    try {
      console.log('🔍 Obteniendo datos de Firebase con filtros:', filtros);
      console.time('⏱️ Tiempo de carga');
      
      // SOLUCIÓN: Cargar solo una muestra limitada (500 documentos máximo por colección)
      const eventsQuery = query(collection(db, 'events'), limit(500));
      const proposalsQuery = query(collection(db, 'proposals'), limit(500));
      const djsQuery = query(collection(db, 'dj_profiles'), limit(200));
      const clientesQuery = query(collection(db, 'user_profiles'), limit(200));

      const [eventosSnap, proposalsSnap, djsSnap, clientesSnap] = await Promise.all([
        getDocs(eventsQuery),
        getDocs(proposalsQuery),  
        getDocs(djsQuery),
        getDocs(clientesQuery)
      ]);

      let eventos: any[] = eventosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const proposals: any[] = proposalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const djs: any[] = djsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const clientes: any[] = clientesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('📊 Datos obtenidos de Firebase:');
      console.log('  - Eventos:', eventos.length);
      console.log('  - Propuestas:', proposals.length);
      console.log('  - DJs:', djs.length);
      console.log('  - Clientes:', clientes.length);

      // Mostrar ejemplo de un evento
      if (eventos.length > 0) {
        console.log('📝 Ejemplo de evento:', eventos[0]);
      }

      const eventosOriginales = eventos.length;

      // Aplicar filtros en memoria
      if (filtros?.fechaInicio) {
        console.log('⏰ Aplicando filtro fechaInicio:', filtros.fechaInicio);
        eventos = eventos.filter(e => {
          const fecha = e.fecha_evento?.toDate?.() || new Date(e.fecha_evento);
          return fecha >= new Date(filtros.fechaInicio!);
        });
        console.log(`   Eventos después del filtro: ${eventos.length}`);
      }
      if (filtros?.fechaFin) {
        console.log('⏰ Aplicando filtro fechaFin:', filtros.fechaFin);
        eventos = eventos.filter(e => {
          const fecha = e.fecha_evento?.toDate?.() || new Date(e.fecha_evento);
          return fecha <= new Date(filtros.fechaFin!);
        });
        console.log(`   Eventos después del filtro: ${eventos.length}`);
      }
      if (filtros?.anio) {
        console.log('📅 Aplicando filtro año:', filtros.anio);
        eventos = eventos.filter(e => {
          const fecha = e.fecha_evento?.toDate?.() || new Date(e.fecha_evento);
          return fecha.getFullYear() === filtros.anio;
        });
        console.log(`   Eventos después del filtro: ${eventos.length}`);
      }
      if (filtros?.tipoEvento) {
        console.log('🎉 Aplicando filtro tipo evento:', filtros.tipoEvento);
        eventos = eventos.filter(e => e.tipo_evento === filtros.tipoEvento);
        console.log(`   Eventos después del filtro: ${eventos.length}`);
      }
      if (filtros?.estado) {
        console.log('📊 Aplicando filtro estado:', filtros.estado);
        eventos = eventos.filter(e => e.estado === filtros.estado);
        console.log(`   Eventos después del filtro: ${eventos.length}`);
      }

      console.log(`🎯 Eventos finales: ${eventos.length} (de ${eventosOriginales} originales)`);
      if (filtros?.djId) {
        eventos = eventos.filter(e => e.dj_id === filtros.djId);
      }
      if (filtros?.ubicacion) {
        eventos = eventos.filter(e => 
          e.ubicacion?.toLowerCase().includes(filtros.ubicacion!.toLowerCase())
        );
      }

      // Calcular KPIs
      const eventosCompletados = eventos.filter(e => e.estado === 'completado').length;
      const eventosRechazados = eventos.filter(e => e.estado === 'rechazado').length;
      const eventosPendientes = eventos.filter(e => e.estado === 'pendiente').length;
      const totalEventos = eventos.length;

      const ingresosTotales = eventos
        .filter(e => e.estado === 'completado' && e.precio_final)
        .reduce((sum, e) => sum + (e.precio_final || 0), 0);

      // Calcular comisiones desde proposals aceptados (10% del precio)
      const comisionesTotales = proposals
        .filter(p => p.estado === 'aceptado' && p.precio_propuesto)
        .reduce((sum: number, p: any) => sum + ((p.precio_propuesto || 0) * 0.1), 0);

      const ratingPromedioDJs = djs.length > 0
        ? djs.reduce((sum, dj) => sum + (dj.rating || 0), 0) / djs.length
        : 0;

      const tasaConversion = totalEventos > 0 
        ? (eventosCompletados / totalEventos) * 100 
        : 0;

      const tasaRechazo = totalEventos > 0 
        ? (eventosRechazados / totalEventos) * 100 
        : 0;

      const precioPromedioEvento = eventosCompletados > 0
        ? ingresosTotales / eventosCompletados
        : 0;

      const kpiData = {
        totalEventos,
        eventosCompletados,
        eventosRechazados,
        eventosPendientes,
        djsActivos: djs.filter(dj => dj.activo).length,
        clientesActivos: clientes.filter(c => c.activo).length,
        ingresosTotales,
        comisionesTotales,
        ratingPromedioDJs,
        tasaConversion,
        tasaRechazo,
        precioPromedioEvento
      };

      console.log('✅ KPIs calculados:', kpiData);
      console.timeEnd('⏱️ Tiempo de carga');
      
      return kpiData;
    } catch (error) {
      console.error('❌ Error obteniendo KPIs:', error);
      console.timeEnd('⏱️ Tiempo de carga');
      throw error;
    }
  },

  // Obtener datos para gráfico de ingresos por mes
  async getIngresosPorMes(anio?: number): Promise<ChartData[]> {
    try {
      const year = anio || new Date().getFullYear();
      
      const snapshot = await getDocs(collection(db, 'events'));
      const eventos = snapshot.docs.map(doc => doc.data());

      // Agrupar por mes
      const ingresosPorMes = new Map<string, number>();
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      meses.forEach((mes) => {
        ingresosPorMes.set(mes, 0);
      });

      eventos.forEach(evento => {
        const fecha = evento.fecha_evento?.toDate?.() || new Date(evento.fecha_evento);
        if (fecha.getFullYear() === year && evento.estado === 'completado' && evento.precio_final) {
          const mes = meses[fecha.getMonth()];
          ingresosPorMes.set(mes, (ingresosPorMes.get(mes) || 0) + (evento.precio_final || 0));
        }
      });

      return Array.from(ingresosPorMes.entries()).map(([fecha, valor]) => ({
        fecha,
        valor: Math.round(valor)
      }));
    } catch (error) {
      console.error('Error obteniendo ingresos por mes:', error);
      throw error;
    }
  },

  // Obtener eventos por tipo
  async getEventosPorTipo(filtros?: Filtros): Promise<ChartData[]> {
    try {
      const snapshot = await getDocs(collection(db, 'events'));
      let eventos: any[] = snapshot.docs.map(doc => doc.data());

      // Filtrar
      if (filtros?.anio) {
        eventos = eventos.filter(evento => {
          const fecha = evento.fecha_evento?.toDate?.() || new Date(evento.fecha_evento);
          return fecha.getFullYear() === filtros.anio;
        });
      }
      if (filtros?.estado) {
        eventos = eventos.filter(evento => evento.estado === filtros.estado);
      }

      const conteo = new Map<string, number>();
      eventos.forEach(evento => {
        const tipo = evento.tipo_evento;
        conteo.set(tipo, (conteo.get(tipo) || 0) + 1);
      });

      return Array.from(conteo.entries()).map(([categoria, valor]) => ({
        fecha: categoria,
        categoria,
        valor
      }));
    } catch (error) {
      console.error('Error obteniendo eventos por tipo:', error);
      throw error;
    }
  },

  // Suscribirse a cambios en tiempo real
  subscribeToEventos(callback: (payload: unknown) => void) {
    const eventosRef = collection(db, 'events');
    
    return onSnapshot(eventosRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        callback({
          type: change.type,
          data: change.doc.data(),
          id: change.doc.id
        });
      });
    });
  }
};
