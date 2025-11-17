import { supabase } from '../lib/supabase';
import type { KPIData, Filtros, ChartData, Evento } from '../types';

export const supabaseService = {
  // Obtener KPIs principales
  async getKPIs(filtros?: Filtros): Promise<KPIData> {
    try {
      console.log('🔍 Obteniendo datos de Supabase con filtros:', filtros);
      console.time('⏱️ Tiempo de carga');

      // Consultas base
      let eventsQuery = supabase.from('events').select('*');
      const proposalsQuery = supabase.from('proposals').select('*');
      
      // Aplicar filtros
      if (filtros?.anio) {
        eventsQuery = eventsQuery.gte('fecha_evento', `${filtros.anio}-01-01`).lte('fecha_evento', `${filtros.anio}-12-31`);
      }
      if (filtros?.fechaInicio) {
        eventsQuery = eventsQuery.gte('fecha_evento', filtros.fechaInicio);
      }
      if (filtros?.fechaFin) {
        eventsQuery = eventsQuery.lte('fecha_evento', filtros.fechaFin);
      }
      if (filtros?.tipoEvento) {
        eventsQuery = eventsQuery.eq('tipo_evento', filtros.tipoEvento);
      }
      if (filtros?.estado) {
        eventsQuery = eventsQuery.eq('estado', filtros.estado);
      }
      if (filtros?.djId) {
        eventsQuery = eventsQuery.eq('dj_id', filtros.djId);
      }
      if (filtros?.clienteId) {
        eventsQuery = eventsQuery.eq('cliente_id', filtros.clienteId);
      }

      const [
        { data: eventos, error: eventsError },
        { data: proposals, error: proposalsError },
        { data: djs, error: djsError },
        { data: clientes, error: clientesError }
      ] = await Promise.all([
        eventsQuery,
        proposalsQuery,
        supabase.from('dj_profiles').select('*'),
        supabase.from('user_profiles').select('*')
      ]);

      if (eventsError || proposalsError || djsError || clientesError) {
        throw new Error('Error al cargar datos de Supabase');
      }

      console.log('📊 Datos obtenidos de Supabase:');
      console.log('  - Eventos:', eventos?.length || 0);
      console.log('  - Propuestas:', proposals?.length || 0);
      console.log('  - DJs:', djs?.length || 0);
      console.log('  - Clientes:', clientes?.length || 0);

      // Calcular KPIs
      const eventosCompletados = eventos?.filter(e => e.estado === 'completado').length || 0;
      const eventosRechazados = eventos?.filter(e => e.estado === 'rechazado').length || 0;
      const eventosPendientes = eventos?.filter(e => e.estado === 'pendiente').length || 0;
      const totalEventos = eventos?.length || 0;

      const ingresosTotales = eventos
        ?.filter((e: Evento) => e.estado === 'completado' && e.precio_final)
        .reduce((sum: number, e: Evento) => sum + (Number(e.precio_final) || 0), 0) || 0;

      const comisionesTotales = proposals
        ?.filter((p: { estado: string; precio_propuesto?: number }) => p.estado === 'aceptado' && p.precio_propuesto)
        .reduce((sum: number, p: { precio_propuesto?: number }) => sum + ((Number(p.precio_propuesto) || 0) * 0.1), 0) || 0;

      const ratingPromedioDJs = djs && djs.length > 0
        ? djs.reduce((sum: number, dj: { rating: number }) => sum + (Number(dj.rating) || 0), 0) / djs.length
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

      const kpiData: KPIData = {
        totalEventos,
        eventosCompletados,
        eventosRechazados,
        eventosPendientes,
        djsActivos: djs?.filter((dj: { activo: boolean }) => dj.activo).length || 0,
        clientesActivos: clientes?.filter((c: { activo: boolean }) => c.activo).length || 0,
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

  // Obtener ingresos por mes
  async getIngresosPorMes(anio?: number): Promise<ChartData[]> {
    try {
      const year = anio || new Date().getFullYear();
      
      const { data: eventos } = await supabase
        .from('events')
        .select('*')
        .eq('estado', 'completado')
        .gte('fecha_evento', `${year}-01-01`)
        .lte('fecha_evento', `${year}-12-31`);

      const ingresosPorMes = new Array(12).fill(0);
      
      eventos?.forEach((evento: Evento) => {
        if (evento.precio_final) {
          const mes = new Date(evento.fecha_evento).getMonth();
          ingresosPorMes[mes] += Number(evento.precio_final);
        }
      });

      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      return meses.map((mes, index) => ({
        fecha: mes,
        valor: ingresosPorMes[index]
      }));
    } catch (error) {
      console.error('Error obteniendo ingresos por mes:', error);
      return [];
    }
  },

  // Tendencia de eventos por mes (conteo)
  async getTendenciaEventos(anio?: number): Promise<ChartData[]> {
    try {
      const year = anio || new Date().getFullYear();
      const { data: eventos } = await supabase
        .from('events')
        .select('fecha_evento')
        .gte('fecha_evento', `${year}-01-01`)
        .lte('fecha_evento', `${year}-12-31`);

      const countPorMes = new Array(12).fill(0);
      eventos?.forEach((e: { fecha_evento: string }) => {
        const mes = new Date(e.fecha_evento).getMonth();
        countPorMes[mes] += 1;
      });
      const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      return meses.map((m, i) => ({ fecha: m, valor: countPorMes[i] }));
    } catch (error) {
      console.error('Error obteniendo tendencia de eventos:', error);
      return [];
    }
  },

  // Eventos por estado (completado/pendiente/aceptado/rechazado/cancelado)
  async getEventosPorEstado(filtros?: Filtros): Promise<ChartData[]> {
    try {
      let query = supabase.from('events').select('estado');
      if (filtros?.anio) {
        query = query.gte('fecha_evento', `${filtros.anio}-01-01`).lte('fecha_evento', `${filtros.anio}-12-31`);
      }
      const { data: eventos } = await query;
      const estados: Record<string, number> = {};
      eventos?.forEach((e: { estado: string }) => { estados[e.estado] = (estados[e.estado] || 0) + 1; });
      return Object.entries(estados).map(([estado, cantidad]) => ({ fecha: estado.charAt(0).toUpperCase()+estado.slice(1), valor: cantidad }));
    } catch (error) {
      console.error('Error obteniendo eventos por estado:', error);
      return [];
    }
  },

  // Obtener eventos por tipo
  async getEventosPorTipo(filtros?: Filtros): Promise<ChartData[]> {
    try {
      console.log('getEventosPorTipo - filtros recibidos:', filtros);
      let query = supabase.from('events').select('tipo_evento');
      
      if (filtros?.anio) {
        console.log(`Filtrando por año: ${filtros.anio}`);
        query = query.gte('fecha_evento', `${filtros.anio}-01-01`).lte('fecha_evento', `${filtros.anio}-12-31`);
      }

      const { data: eventos } = await query;
      console.log(`Eventos encontrados para tipo: ${eventos?.length}`);

      const eventosPorTipo: Record<string, number> = {};
      
      eventos?.forEach((evento: { tipo_evento: string }) => {
        eventosPorTipo[evento.tipo_evento] = (eventosPorTipo[evento.tipo_evento] || 0) + 1;
      });

      return Object.entries(eventosPorTipo).map(([tipo, cantidad]) => ({
        fecha: tipo, // se reutiliza propiedad 'fecha' como etiqueta categórica
        valor: cantidad
      }));
    } catch (error) {
      console.error('Error obteniendo eventos por tipo:', error);
      return [];
    }
  },

  // KPI Avanzado: Rechazos por DJ (Top 10)
  async getRechazosPorDJ(filtros?: Filtros): Promise<ChartData[]> {
    try {
      let query = supabase
        .from('events')
        .select('dj_id, dj_profiles(nombre)')
        .eq('estado', 'rechazado');
      
      if (filtros?.anio) {
        query = query.gte('fecha_evento', `${filtros.anio}-01-01`).lte('fecha_evento', `${filtros.anio}-12-31`);
      }

      const { data: eventos } = await query;
      const rechazos: Record<string, { nombre: string; count: number }> = {};
      
      eventos?.forEach((e) => {
        const djProfile = Array.isArray(e.dj_profiles) ? e.dj_profiles[0] : e.dj_profiles;
        if (e.dj_id && djProfile && typeof djProfile === 'object' && 'nombre' in djProfile) {
          if (!rechazos[e.dj_id]) {
            rechazos[e.dj_id] = { nombre: String(djProfile.nombre), count: 0 };
          }
          rechazos[e.dj_id].count++;
        }
      });

      return Object.values(rechazos)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(r => ({ fecha: r.nombre, valor: r.count }));
    } catch (error) {
      console.error('Error obteniendo rechazos por DJ:', error);
      return [];
    }
  },

  // KPI Avanzado: Precio promedio por hora de cada DJ
  async getPrecioPromedioPorDJ(): Promise<ChartData[]> {
    try {
      const { data: djs } = await supabase
        .from('dj_profiles')
        .select('nombre, precio_hora_min, precio_hora_max')
        .eq('activo', true)
        .order('precio_hora_min', { ascending: false })
        .limit(15);

      return djs?.map(dj => ({
        fecha: dj.nombre,
        valor: ((dj.precio_hora_min + dj.precio_hora_max) / 2)
      })) || [];
    } catch (error) {
      console.error('Error obteniendo precio promedio por DJ:', error);
      return [];
    }
  },

  // KPI Avanzado: Diferencia precio ofrecido vs precio final
  async getVariacionPrecio(filtros?: Filtros): Promise<ChartData[]> {
    try {
      let query = supabase
        .from('events')
        .select('precio_ofrecido, precio_final, fecha_evento')
        .eq('estado', 'completado')
        .not('precio_final', 'is', null);
      
      if (filtros?.anio) {
        query = query.gte('fecha_evento', `${filtros.anio}-01-01`).lte('fecha_evento', `${filtros.anio}-12-31`);
      }

      const { data: eventos } = await query;
      const variaciones = eventos?.map((e: { precio_ofrecido: number; precio_final: number; fecha_evento: string }) => ({
        fecha: new Date(e.fecha_evento).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' }),
        valor: Number(e.precio_final) - Number(e.precio_ofrecido)
      })) || [];

      // Agrupar por mes
      const grouped: Record<string, number[]> = {};
      variaciones.forEach((v: { fecha: string; valor: number }) => {
        if (!grouped[v.fecha]) grouped[v.fecha] = [];
        grouped[v.fecha].push(v.valor);
      });

      return Object.entries(grouped).map(([mes, valores]: [string, number[]]) => ({
        fecha: mes,
        valor: valores.reduce((a: number, b: number) => a + b, 0) / valores.length
      }));
    } catch (error) {
      console.error('Error obteniendo variación de precio:', error);
      return [];
    }
  },

  // KPI Avanzado: Clientes únicos que han contratado
  async getClientesQueContratan(filtros?: Filtros): Promise<{ total: number; nuevos: number; recurrentes: number }> {
    try {
      let query = supabase
        .from('events')
        .select('cliente_id, fecha_evento')
        .eq('estado', 'completado');
      
      if (filtros?.anio) {
        query = query.gte('fecha_evento', `${filtros.anio}-01-01`).lte('fecha_evento', `${filtros.anio}-12-31`);
      }

      const { data: eventos } = await query;
      const clientesCount: Record<string, number> = {};
      
      eventos?.forEach((e: { cliente_id: string }) => {
        clientesCount[e.cliente_id] = (clientesCount[e.cliente_id] || 0) + 1;
      });

      const total = Object.keys(clientesCount).length;
      const nuevos = Object.values(clientesCount).filter((c: number) => c === 1).length;
      const recurrentes = total - nuevos;

      return { total, nuevos, recurrentes };
    } catch (error) {
      console.error('Error obteniendo clientes que contratan:', error);
      return { total: 0, nuevos: 0, recurrentes: 0 };
    }
  },

  // Nuevo: Top DJs más contratados
  async getTopDJsContratados(filtros?: Filtros): Promise<ChartData[]> {
    try {
      // Primero obtener eventos
      let query = supabase
        .from('events')
        .select('dj_id')
        .eq('estado', 'completado');
      
      if (filtros?.anio) {
        query = query.gte('fecha_evento', `${filtros.anio}-01-01`).lte('fecha_evento', `${filtros.anio}-12-31`);
      }

      const { data: eventos } = await query;
      
      // Contar eventos por DJ
      const conteos: Record<string, number> = {};
      eventos?.forEach((e) => {
        if (e.dj_id) {
          conteos[e.dj_id] = (conteos[e.dj_id] || 0) + 1;
        }
      });

      // Obtener nombres de los DJs
      const djIds = Object.keys(conteos);
      if (djIds.length === 0) return [];

      const { data: djs } = await supabase
        .from('dj_profiles')
        .select('id, nombre')
        .in('id', djIds);

      // Combinar conteos con nombres
      const resultado = djs?.map((dj: { id: string; nombre: string }) => ({
        fecha: dj.nombre,
        valor: conteos[dj.id]
      })) || [];

      return resultado
        .sort((a, b) => b.valor - a.valor)
        .slice(0, 10);
    } catch (error) {
      console.error('Error obteniendo top DJs:', error);
      return [];
    }
  },

  // Nuevo: Tasa de aceptación por mes
  async getTasaAceptacionMensual(filtros?: Filtros): Promise<ChartData[]> {
    try {
      const year = filtros?.anio || new Date().getFullYear();
      const { data: eventos } = await supabase
        .from('events')
        .select('fecha_evento, estado')
        .gte('fecha_evento', `${year}-01-01`)
        .lte('fecha_evento', `${year}-12-31`);

      console.log(`Eventos para tasa aceptación (${year}):`, eventos?.length);

      const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      const datosMes: Record<number, { total: number; aceptados: number }> = {};
      
      for (let i = 0; i < 12; i++) {
        datosMes[i] = { total: 0, aceptados: 0 };
      }

      eventos?.forEach((e: { fecha_evento: string; estado: string }) => {
        const mes = new Date(e.fecha_evento).getMonth();
        datosMes[mes].total++;
        if (e.estado === 'aceptado' || e.estado === 'completado') {
          datosMes[mes].aceptados++;
        }
      });

      const resultado = meses.map((m, i) => ({
        fecha: m,
        valor: datosMes[i].total > 0 ? (datosMes[i].aceptados / datosMes[i].total) * 100 : 0
      }));

      console.log('Tasa aceptación resultado:', resultado);
      return resultado;
    } catch (error) {
      console.error('Error obteniendo tasa aceptación:', error);
      return [];
    }
  },

  // Nuevo: Lista de DJs para filtro
  async getListaDJs(): Promise<Array<{ id: string; nombre: string }>> {
    try {
      const { data } = await supabase
        .from('dj_profiles')
        .select('id, nombre')
        .eq('activo', true)
        .order('nombre');
      return data || [];
    } catch (error) {
      console.error('Error obteniendo lista DJs:', error);
      return [];
    }
  },

  // Nuevo: Lista de Clientes para filtro
  async getListaClientes(): Promise<Array<{ id: string; nombre: string }>> {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('id, nombre')
        .eq('activo', true)
        .order('nombre')
        .limit(100);
      return data || [];
    } catch (error) {
      console.error('Error obteniendo lista clientes:', error);
      return [];
    }
  }
};
