import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';
import type { KPIData, Filtros } from '../types';

export const analyticsService = {
  // Track cuando se carga el dashboard
  trackDashboardView() {
    if (!analytics) return;
    logEvent(analytics, 'dashboard_view', {
      timestamp: new Date().toISOString(),
      page: 'dashboard'
    });
  },

  // Track cuando se aplican filtros
  trackFilterApplied(filtros: Filtros) {
    if (!analytics) return;
    logEvent(analytics, 'filter_applied', {
      year: filtros.anio,
      event_type: filtros.tipoEvento,
      status: filtros.estado,
      has_date_range: !!(filtros.fechaInicio && filtros.fechaFin)
    });
  },

  // Track cuando se refrescan los datos
  trackDataRefresh() {
    if (!analytics) return;
    logEvent(analytics, 'data_refresh', {
      timestamp: new Date().toISOString()
    });
  },

  // Track KPIs principales (para análisis)
  trackKPIMetrics(kpis: KPIData) {
    if (!analytics) return;
    
    // Eventos totales
    logEvent(analytics, 'kpi_total_events', {
      value: kpis.totalEventos,
      metric_type: 'count'
    });

    // Tasa de conversión
    logEvent(analytics, 'kpi_conversion_rate', {
      value: kpis.tasaConversion,
      metric_type: 'percentage'
    });

    // Ingresos totales
    logEvent(analytics, 'kpi_total_revenue', {
      value: kpis.ingresosTotales,
      currency: 'CLP',
      metric_type: 'revenue'
    });

    // Rating promedio
    logEvent(analytics, 'kpi_average_rating', {
      value: kpis.ratingPromedioDJs,
      metric_type: 'rating'
    });

    // DJs activos
    logEvent(analytics, 'kpi_active_djs', {
      value: kpis.djsActivos,
      metric_type: 'count'
    });

    // Tasa de rechazo
    logEvent(analytics, 'kpi_rejection_rate', {
      value: kpis.tasaRechazo,
      metric_type: 'percentage'
    });
  },

  // Track eventos completados vs rechazados
  trackEventStatusMetrics(completed: number, rejected: number, pending: number) {
    if (!analytics) return;
    
    logEvent(analytics, 'event_status_breakdown', {
      completed,
      rejected,
      pending,
      total: completed + rejected + pending
    });
  },

  // Track interacción con gráficos
  trackChartInteraction(chartType: string) {
    if (!analytics) return;
    logEvent(analytics, 'chart_interaction', {
      chart_type: chartType,
      timestamp: new Date().toISOString()
    });
  },

  // Track errores
  trackError(error: string, context: string) {
    if (!analytics) return;
    logEvent(analytics, 'dashboard_error', {
      error_message: error,
      context,
      timestamp: new Date().toISOString()
    });
  },

  // Custom event para métricas de negocio
  trackBusinessMetric(metricName: string, value: number, metadata?: Record<string, unknown>) {
    if (!analytics) return;
    logEvent(analytics, `business_metric_${metricName}`, {
      value,
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }
};
