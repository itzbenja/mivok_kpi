import { BarChart, DonutChart, AreaChart, LineChart } from '@tremor/react';
import { Download, Clock } from 'lucide-react';
import { exportToCSV } from '../utils/exportCsv';
import type { ChartData } from '../types';

interface ChartsGridProps {
  ingresosPorMes: ChartData[];
  eventosPorTipo: ChartData[];
  tendenciaEventos: ChartData[];
  eventosPorEstado: ChartData[];
}

export const ChartsGrid = ({ ingresosPorMes, eventosPorTipo, tendenciaEventos, eventosPorEstado }: ChartsGridProps) => {
  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const totalEventosPorTipo = eventosPorTipo.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-meta">
            <div className="chart-icon-circle" aria-hidden="true">💰</div>
            <div className="chart-titles">
              <div className="chart-title">Ingresos Mensuales</div>
              <div className="chart-subtitle">Flujo de caja</div>
            </div>
          </div>
          <div className="chart-actions">
            <button className="chart-action-btn" type="button"><Clock size={12} />&nbsp;Último año</button>
            <button 
              className="chart-action-btn" 
              type="button"
              onClick={() => exportToCSV('ingresos_mensuales.csv', ingresosPorMes, [
                { key: 'fecha', header: 'Mes' },
                { key: 'valor', header: 'Ingresos', format: (v) => Number(v) }
              ])}
            ><Download size={12} />&nbsp;CSV</button>
          </div>
        </div>
        <AreaChart
          className="h-80"
          data={ingresosPorMes}
          index="fecha"
          categories={["valor"]}
          colors={["emerald"]}
          valueFormatter={formatCurrency}
          yAxisWidth={60}
          showAnimation={true}
          showLegend={false}
          curveType="natural"
        />
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-meta">
            <div className="chart-icon-circle" aria-hidden="true">📊</div>
            <div className="chart-titles">
              <div className="chart-title">Distribución por Tipo</div>
              <div className="chart-subtitle">Categorías</div>
            </div>
          </div>
          <div className="chart-actions">
            <button 
              className="chart-action-btn" 
              type="button"
              onClick={() => exportToCSV('eventos_por_tipo.csv', eventosPorTipo, [
                { key: 'fecha', header: 'Tipo' },
                { key: 'valor', header: 'Cantidad' }
              ])}
            ><Download size={12} />&nbsp;CSV</button>
          </div>
        </div>
        {eventosPorTipo.length > 0 ? (
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ width: 360, minWidth: 260 }}>
              <DonutChart
                className="chart-tipo h-80"
                data={eventosPorTipo}
                index="fecha"
                category="valor"
                variant="donut"
                valueFormatter={(number: number) => totalEventosPorTipo > 0 ? `${(number / totalEventosPorTipo * 100).toFixed(1)}%` : '0%'}
                showAnimation={true}
                showTooltip={true}
                showLabel={false}
              />
            </div>
            <div style={{ minWidth: 220, maxWidth: 320 }}>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>Tipos y porcentajes</div>
              {eventosPorTipo.map((item, idx) => {
                const percentage = totalEventosPorTipo > 0 ? ((item.valor / totalEventosPorTipo) * 100).toFixed(1) : '0.0';
                const colors = ["#8b5cf6", "#3b82f6", "#06b6d4", "#ec4899", "#f59e0b", "#10b981", "#ef4444", "#6366f1", "#f97316", "#14b8a6", "#a78bfa", "#fb7185"];
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: 6, background: colors[idx % colors.length] }} />
                      <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{item.fecha}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{item.valor.toLocaleString()}</div>
                      <div style={{ color: 'var(--color-brand)', fontWeight: 700 }}>{percentage}%</div>
                    </div>
                  </div>
                );
              })}
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <div style={{ color: 'var(--color-text-secondary)' }}>Total</div>
                <div style={{ color: 'var(--color-brand)' }}>{totalEventosPorTipo.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No hay datos para mostrar.
          </div>
        )}
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-meta">
            <div className="chart-icon-circle" aria-hidden="true">📈</div>
            <div className="chart-titles">
              <div className="chart-title">Tendencia de Eventos</div>
              <div className="chart-subtitle">Evolución</div>
            </div>
          </div>
          <div className="chart-actions">
            <button className="chart-action-btn" type="button"><Clock size={12} />&nbsp;Último año</button>
            <button 
              className="chart-action-btn" 
              type="button"
              onClick={() => exportToCSV('tendencia_eventos.csv', tendenciaEventos, [
                { key: 'fecha', header: 'Mes' },
                { key: 'valor', header: 'Eventos' }
              ])}
            ><Download size={12} />&nbsp;CSV</button>
          </div>
        </div>
        <LineChart
          className="h-80 chart-tendencia"
          data={tendenciaEventos}
          index="fecha"
          categories={["valor"]}
          colors={["indigo"]}
          valueFormatter={(number: number) => `${number.toLocaleString('es-CL')} eventos`}
          yAxisWidth={80}
          showAnimation={true}
          showLegend={false}
          curveType="natural"
        />
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <div className="chart-card-meta">
            <div className="chart-icon-circle" aria-hidden="true">🧮</div>
            <div className="chart-titles">
              <div className="chart-title">Eventos por Estado</div>
              <div className="chart-subtitle">Comparación</div>
            </div>
          </div>
          <div className="chart-actions">
            <button 
              className="chart-action-btn" 
              type="button"
              onClick={() => exportToCSV('eventos_por_estado.csv', eventosPorEstado, [
                { key: 'fecha', header: 'Estado' },
                { key: 'valor', header: 'Cantidad' }
              ])}
            ><Download size={12} />&nbsp;CSV</button>
          </div>
        </div>
        <BarChart
          className="h-80 chart-estado"
          data={eventosPorEstado}
          index="fecha"
          categories={["valor"]}
          colors={["violet"]}
          valueFormatter={(number: number) => number.toLocaleString('es-CL')}
          yAxisWidth={48}
          showAnimation={true}
          showLegend={false}
        />
      </div>
    </div>
  );
};
