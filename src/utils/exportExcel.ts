import * as XLSX from 'xlsx';
import type { KPIData, ChartData } from '../types';

interface DashboardExportPayload {
  kpis: KPIData | null;
  ingresosPorMes: ChartData[];
  eventosPorTipo: ChartData[];
  tendenciaEventos: ChartData[];
  eventosPorEstado: ChartData[];
}

// Genera un libro Excel con varias hojas y totales básicos
export function exportDashboardExcel(payload: DashboardExportPayload) {
  const { kpis, ingresosPorMes, eventosPorTipo, tendenciaEventos, eventosPorEstado } = payload;
  const wb = XLSX.utils.book_new();

  // Hoja KPIs
  if (kpis) {
    const kpiRows: (string | number)[][] = [ ['Métrica','Valor'] ];
    const entries: [string, string | number][] = [
      ['Total Eventos', kpis.totalEventos],
      ['Eventos Completados', kpis.eventosCompletados],
      ['Eventos Pendientes', kpis.eventosPendientes],
      ['Eventos Rechazados', kpis.eventosRechazados],
      ['DJs Activos', kpis.djsActivos],
      ['Clientes Activos', kpis.clientesActivos],
      ['Ingresos Totales', kpis.ingresosTotales],
      ['Comisiones Totales', kpis.comisionesTotales],
      ['Tasa Conversión %', kpis.tasaConversion],
      ['Tasa Rechazo %', kpis.tasaRechazo],
      ['Precio Promedio Evento', kpis.precioPromedioEvento],
      ['Rating Promedio DJs', kpis.ratingPromedioDJs]
    ];
    entries.forEach(([label,value]) => kpiRows.push([label,value]));
    const kpiSheet = XLSX.utils.aoa_to_sheet(kpiRows);
    applyColumnAutoWidth(kpiSheet, kpiRows);
    applyNumberFormats(kpiSheet, { currencyCols: ['B'], percentMatch: /%/ });
    XLSX.utils.book_append_sheet(wb, kpiSheet, 'KPIs');
  }

  // Hoja Ingresos Mensuales
  const ingresosRows: (string | number)[][] = [['Mes','Ingresos']];
  ingresosPorMes.forEach(r => ingresosRows.push([r.fecha, r.valor]));
  ingresosRows.push(['TOTAL', ingresosPorMes.reduce((s,r)=>s+r.valor,0)]);
  const ingresosSheet = XLSX.utils.aoa_to_sheet(ingresosRows);
  applyColumnAutoWidth(ingresosSheet, ingresosRows);
  applyNumberFormats(ingresosSheet, { currencyCols: ['B'] });
  XLSX.utils.book_append_sheet(wb, ingresosSheet, 'Ingresos');

  // Hoja Eventos por Tipo
  const tipoRows: (string | number)[][] = [['Tipo','Cantidad']];
  eventosPorTipo.forEach(r => tipoRows.push([r.fecha, r.valor]));
  tipoRows.push(['TOTAL', eventosPorTipo.reduce((s,r)=>s+r.valor,0)]);
  const tipoSheet = XLSX.utils.aoa_to_sheet(tipoRows);
  applyColumnAutoWidth(tipoSheet, tipoRows);
  XLSX.utils.book_append_sheet(wb, tipoSheet, 'EventosTipo');

  // Hoja Eventos por Estado
  const estadoRows: (string | number)[][] = [['Estado','Cantidad']];
  eventosPorEstado.forEach(r => estadoRows.push([r.fecha, r.valor]));
  estadoRows.push(['TOTAL', eventosPorEstado.reduce((s,r)=>s+r.valor,0)]);
  const estadoSheet = XLSX.utils.aoa_to_sheet(estadoRows);
  applyColumnAutoWidth(estadoSheet, estadoRows);
  XLSX.utils.book_append_sheet(wb, estadoSheet, 'EventosEstado');

  // Hoja Tendencia
  const tendenciaRows: (string | number)[][] = [['Mes','Eventos']];
  tendenciaEventos.forEach(r => tendenciaRows.push([r.fecha, r.valor]));
  tendenciaRows.push(['TOTAL', tendenciaEventos.reduce((s,r)=>s+r.valor,0)]);
  const tendenciaSheet = XLSX.utils.aoa_to_sheet(tendenciaRows);
  applyColumnAutoWidth(tendenciaSheet, tendenciaRows);
  XLSX.utils.book_append_sheet(wb, tendenciaSheet, 'Tendencia');

  const stamp = new Date().toISOString().substring(0,19).replace(/[:T]/g,'-');
  XLSX.writeFile(wb, `dashboard-mivok-${stamp}.xlsx`);
}

// Ajuste automático ancho columnas basado en longitud máxima
function applyColumnAutoWidth(sheet: XLSX.WorkSheet, rows: (string | number)[][]) {
  const widths: number[] = [];
  rows.forEach(r => r.forEach((cell,i)=> {
    const len = cell == null ? 0 : String(cell).length;
    widths[i] = Math.max(widths[i] || 8, len + 2);
  }));
  sheet['!cols'] = widths.map(w => ({ wch: w }));
}

// Aplicar formatos numéricos simples (SheetJS CE permite 'z')
function applyNumberFormats(sheet: XLSX.WorkSheet, opts: { currencyCols?: string[]; percentMatch?: RegExp }) {
  const range = XLSX.utils.decode_range(sheet['!ref']!);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const colLetter = XLSX.utils.encode_col(C);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) { // saltar encabezado
      const addr = colLetter + (R+1);
      const cell = sheet[addr];
      if (!cell) continue;
      if (opts.currencyCols?.includes(colLetter)) {
        cell.z = '$#,##0';
      }
      if (opts.percentMatch && typeof cell.v === 'number' && /%/.test(sheet['A1'].v)) {
        // simplificado: si encabezado contiene %
        cell.z = '0.00';
      }
    }
  }
}
