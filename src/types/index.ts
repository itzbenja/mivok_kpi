export interface DJ {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  generos_musicales: string[];
  precio_hora_min: number;
  precio_hora_max: number;
  ubicacion: string;
  rating: number;
  total_eventos: number;
  eventos_completados: number;
  eventos_rechazados: number;
  fecha_registro: string;
  activo: boolean;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  ubicacion: string;
  total_eventos: number;
  fecha_registro: string;
  activo: boolean;
}

export interface Evento {
  id: string;
  dj_id: string;
  cliente_id: string;
  tipo_evento: string;
  fecha_evento: string;
  hora_inicio: string;
  duracion_horas: number;
  ubicacion: string;
  precio_ofrecido: number;
  precio_final?: number;
  estado: 'pendiente' | 'aceptado' | 'rechazado' | 'completado' | 'cancelado';
  motivo_rechazo?: string;
  rating_dj?: number;
  rating_cliente?: number;
  comentario_cliente?: string;
  comentario_dj?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Transaccion {
  id: string;
  evento_id: string;
  monto: number;
  comision_plataforma: number;
  metodo_pago: string;
  estado: string;
  fecha_transaccion: string;
}

export interface KPIData {
  totalEventos: number;
  eventosCompletados: number;
  eventosRechazados: number;
  eventosPendientes: number;
  djsActivos: number;
  clientesActivos: number;
  ingresosTotales: number;
  comisionesTotales: number;
  ratingPromedioDJs: number;
  tasaConversion: number;
  tasaRechazo: number;
  precioPromedioEvento: number;
}

export interface ChartData extends Record<string, unknown> {
  fecha: string;
  valor: number;
  categoria?: string;
}

export interface Filtros {
  fechaInicio?: string;
  fechaFin?: string;
  anio?: number;
  mes?: number;
  tipoEvento?: string;
  estado?: string;
  djId?: string;
  clienteId?: string;
  ubicacion?: string;
  precioMin?: number;
  precioMax?: number;
}
