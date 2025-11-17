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
        <DonutChart
          className="h-80 chart-tipo"
          data={eventosPorTipo}
          category="valor"
          index="fecha"
          colors={["slate", "violet", "indigo", "rose", "cyan", "amber", "emerald"]}
          showAnimation={true}
          showLabel={true}
        />
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
