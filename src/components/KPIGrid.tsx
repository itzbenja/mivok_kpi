import { TrendingUp, TrendingDown } from 'lucide-react';
import type { KPIData } from '../types';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: number;
  trend?: 'increase' | 'decrease';
  prefix?: string;
  suffix?: string;
}

const KPICard = ({ title, value, delta, trend, prefix = '', suffix = '' }: KPICardProps) => {
  const cardType = trend === 'increase' ? 'success' : 'danger';
  const badgeType = trend === 'increase' ? 'success' : 'danger';
  
  return (
    <div className={`kpi-card ${cardType}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="kpi-title">{title}</div>
        {delta !== undefined && (
          <div className={`kpi-badge ${badgeType}`}>
            {trend === 'increase' ? '↑' : '↓'} {Math.abs(delta)}%
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <div className="kpi-value">
          {prefix}{typeof value === 'number' ? value.toLocaleString('es-CL') : value}{suffix}
        </div>
        {trend && (
          <div style={{marginBottom: '0.25rem'}}>
            {trend === 'increase' ? 
              <TrendingUp className="h-5 w-5" style={{color: '#10b981'}} /> :
              <TrendingDown className="h-5 w-5" style={{color: '#ef4444'}} />
            }
          </div>
        )}
      </div>
    </div>
  );
};

interface KPIGridProps {
  data: KPIData;
}

export const KPIGrid = ({ data }: KPIGridProps) => {
  return (
    <div className="kpi-grid">
      <KPICard
        title="Total Eventos"
        value={data.totalEventos}
        trend="increase"
      />
      <KPICard
        title="Eventos Completados"
        value={data.eventosCompletados}
        trend="increase"
        delta={data.tasaConversion}
      />
      <KPICard
        title="Ingresos Totales"
        value={data.ingresosTotales}
        prefix="$"
        trend="increase"
      />
      <KPICard
        title="Comisiones"
        value={data.comisionesTotales}
        prefix="$"
        trend="increase"
      />
      <KPICard
        title="DJs Activos"
        value={data.djsActivos}
      />
      <KPICard
        title="Clientes Activos"
        value={data.clientesActivos}
      />
      <KPICard
        title="Rating Promedio"
        value={data.ratingPromedioDJs.toFixed(2)}
        suffix="/5"
        trend={data.ratingPromedioDJs >= 4 ? 'increase' : 'decrease'}
      />
      <KPICard
        title="Precio Promedio"
        value={Math.round(data.precioPromedioEvento)}
        prefix="$"
      />
      <KPICard
        title="Tasa Conversión"
        value={data.tasaConversion.toFixed(1)}
        suffix="%"
        trend={data.tasaConversion >= 70 ? 'increase' : 'decrease'}
      />
      <KPICard
        title="Tasa Rechazo"
        value={data.tasaRechazo.toFixed(1)}
        suffix="%"
        trend={data.tasaRechazo <= 20 ? 'increase' : 'decrease'}
      />
      <KPICard
        title="Eventos Pendientes"
        value={data.eventosPendientes}
      />
      <KPICard
        title="Eventos Rechazados"
        value={data.eventosRechazados}
        trend="decrease"
      />
    </div>
  );
};
