import { useState, useEffect } from 'react';
import { RefreshCw, Activity, FileSpreadsheet } from 'lucide-react';
import { BarChart, LineChart } from '@tremor/react';
import { NewKPICard } from './components/NewKPICard';
import { ChartsGrid } from './components/ChartsGrid';
import { FilterPanel } from './components/FilterPanel';
import { exportDashboardExcel } from './utils/exportExcel';
import { supabaseService } from './services/supabaseService';
import type { KPIData, Filtros, ChartData } from './types';

function App() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [ingresosPorMes, setIngresosPorMes] = useState<ChartData[]>([]);
  const [eventosPorTipo, setEventosPorTipo] = useState<ChartData[]>([]);
  const [tendenciaEventos, setTendenciaEventos] = useState<ChartData[]>([]);
  const [eventosPorEstado, setEventosPorEstado] = useState<ChartData[]>([]);
  const [topDJs, setTopDJs] = useState<ChartData[]>([]);
  const [tasaAceptacion, setTasaAceptacion] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>({});
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('mivok-theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  const loadData = async (newFiltros?: Filtros) => {
    try {
      setLoading(true);
      const filters = newFiltros || filtros;
      const timeout = 30000;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: 30 segundos')), timeout)
      );
      const dataPromise = Promise.all([
        supabaseService.getKPIs(filters),
        supabaseService.getIngresosPorMes(filters.anio),
        supabaseService.getEventosPorTipo(filters),
        supabaseService.getTendenciaEventos(filters.anio),
        supabaseService.getEventosPorEstado(filters),
        supabaseService.getTopDJsContratados(filters),
        supabaseService.getTasaAceptacionMensual(filters)
      ]);
      const [kpis, ingresos, eventosTipo, tendencia, porEstado, topDj, tasaAcept] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]) as any;
      setKpiData(kpis);
      setIngresosPorMes(ingresos);
      setEventosPorTipo(eventosTipo);
      setTendenciaEventos(tendencia);
      setEventosPorEstado(porEstado);
      setTopDJs(topDj);
      setTasaAceptacion(tasaAcept);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error cargando datos:', error);
      setKpiData({
        totalEventos: 0,
        eventosCompletados: 0,
        eventosRechazados: 0,
        eventosPendientes: 0,
        djsActivos: 0,
        clientesActivos: 0,
        ingresosTotales: 0,
        comisionesTotales: 0,
        ratingPromedioDJs: 0,
        tasaConversion: 0,
        tasaRechazo: 0,
        precioPromedioEvento: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFiltros: Filtros) => {
    setFiltros(newFiltros);
    loadData(newFiltros);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('mivok-theme', next);
      return next;
    });
  };

  const handleExportExcel = () => {
    if (!kpiData) return;
    exportDashboardExcel({
      kpis: kpiData,
      ingresosPorMes,
      eventosPorTipo,
      tendenciaEventos,
      eventosPorEstado
    });
  };

  const kpis = kpiData ? [
    { id: 'totalEventos', title: 'Eventos Totales', value: kpiData.totalEventos, delta: 0, variant: 'default' as const },
    { id: 'eventosCompletados', title: 'Completados', value: kpiData.eventosCompletados, delta: 0, variant: 'emerald' as const },
    { id: 'eventosPendientes', title: 'Pendientes', value: kpiData.eventosPendientes, delta: 0, variant: 'amber' as const },
    { id: 'djsActivos', title: 'DJs Activos', value: kpiData.djsActivos, delta: 0, variant: 'cyan' as const },
    { id: 'clientesActivos', title: 'Clientes Activos', value: kpiData.clientesActivos, delta: 0, variant: 'default' as const },
    { id: 'ingresosTotales', title: 'Ingresos Totales', value: `$${Math.round(kpiData.ingresosTotales).toLocaleString('es-CL')}` , delta: 0, variant: 'emerald' as const },
    { id: 'comisionesTotales', title: 'Comisiones', value: `$${Math.round(kpiData.comisionesTotales).toLocaleString('es-CL')}`, delta: 0, variant: 'cyan' as const },
    { id: 'tasaConversion', title: 'Conversión', value: `${kpiData.tasaConversion.toFixed(1)}%`, delta: 0, variant: 'amber' as const },
    { id: 'precioPromedioEvento', title: 'Precio Promedio', value: `$${Math.round(kpiData.precioPromedioEvento).toLocaleString('es-CL')}`, delta: 0, variant: 'default' as const },
    { id: 'ratingPromedioDJs', title: 'Rating DJs', value: kpiData.ratingPromedioDJs.toFixed(2), delta: 0, variant: 'emerald' as const }
  ] : [];

  return (
    <div className="app-shell" data-theme={theme}>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand-block">
            <div className="brand-icon">
              <Activity size={26} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 className="brand-title">Panel General</h1>
                <div className="live-pill">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.8s infinite' }} />
                  LIVE
                </div>
              </div>
              <p className="brand-sub">Analítica consolidada Mivok (DJ · Clientes · Eventos · Propuestas)</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema">
              {theme === 'light' ? 'Oscuro' : 'Claro'}
            </button>
          </div>
        </div>
      </header>
      <main className="main-container">
        <FilterPanel onFilterChange={handleFilterChange} />
        {loading && !kpiData ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 1.75rem', background: 'linear-gradient(135deg,var(--gradient-brand))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)', animation: 'floatY 4.8s ease-in-out infinite' }}>
              <RefreshCw size={34} color='#fff' className='spin-slow' />
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Cargando Analítica Consolidada...</h2>
            <p style={{ fontSize: '0.8rem', marginTop: '0.85rem', color: 'var(--color-text-muted)' }}>Esto puede tardar unos segundos.</p>
          </div>
        ) : (
          <>
            <div className="kpi-board">
              {kpis.map(k => (
                <NewKPICard 
                  key={k.id} 
                  title={k.title} 
                  value={k.value} 
                  delta={k.delta} 
                  sparkData={[5,7,6,9,11,10,12]} 
                  variant={k.variant}
                />
              ))}
            </div>
            <div className="panel" style={{ marginBottom: 'var(--space-7)' }}>
              <div className="panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.5px', margin: 0 }}>Distribuciones y Tendencias</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      padding: '0.45rem 0.75rem',
                      background: 'var(--color-brand)',
                      color: '#fff',
                      border: '1px solid var(--color-brand)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >Exportar Excel</button>
                </div>
              </div>
              <ChartsGrid 
                ingresosPorMes={ingresosPorMes} 
                eventosPorTipo={eventosPorTipo} 
                tendenciaEventos={tendenciaEventos}
                eventosPorEstado={eventosPorEstado}
              />
            </div>

            {/* Nuevos gráficos adicionales */}
            <div className="panel" style={{ marginBottom: 'var(--space-7)' }}>
              <div className="panel-header">
                <h2 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.5px' }}>📊 Métricas Adicionales</h2>
              </div>
              <div className="charts-grid">
                {/* Top DJs más contratados */}
                <div className="chart-card">
                  <div className="chart-card-header">
                    <div className="chart-card-meta">
                      <div className="chart-icon-circle">🏆</div>
                      <div className="chart-titles">
                        <div className="chart-title">Top 10 DJs Más Contratados</div>
                        <div className="chart-subtitle">Eventos completados</div>
                      </div>
                    </div>
                  </div>
                  <BarChart
                    className="h-80 chart-topdjs"
                    data={topDJs}
                    index="fecha"
                    categories={["valor"]}
                    colors={["rose"]}
                    valueFormatter={(n: number) => `${n} eventos`}
                    yAxisWidth={120}
                    showAnimation={false}
                    showLegend={false}
                    layout="vertical"
                  />
                </div>

                {/* Tasa de aceptación mensual */}
                <div className="chart-card">
                  <div className="chart-card-header">
                    <div className="chart-card-meta">
                      <div className="chart-icon-circle">✅</div>
                      <div className="chart-titles">
                        <div className="chart-title">Tasa de Aceptación Mensual</div>
                        <div className="chart-subtitle">% aceptados/completados ({tasaAceptacion.length} meses)</div>
                      </div>
                    </div>
                  </div>
                  <LineChart
                    className="h-80 chart-aceptacion"
                    data={tasaAceptacion}
                    index="fecha"
                    categories={["valor"]}
                    colors={["cyan"]}
                    valueFormatter={(n: number) => `${n.toFixed(1)}%`}
                    yAxisWidth={60}
                    showAnimation={false}
                    showLegend={false}
                    showGridLines={true}
                    connectNulls={true}
                  />
                </div>
              </div>
            </div>

            <section className="panel">
              <div className="panel-header">
                <h2 style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.5px' }}>Insights Rápidos</h2>
              </div>
              <div style={{ display: 'grid', gap: 'var(--space-4)', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
                {[
                  { t: 'Ingresos', d: 'Ingresos acumulados muestran crecimiento sostenido con picos estacionales.' },
                  { t: 'Eventos', d: 'Distribución equilibrada por tipo reduce riesgo en categorías.' },
                  { t: 'Clientes', d: 'Mezcla de clientes saludable mantiene pipeline diversificado.' },
                  { t: 'Propuestas', d: 'Conversión aceptable con margen para optimizar eficiencia.' },
                ].map(card => (
                  <div key={card.t} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 20%, rgba(99,102,241,0.12), transparent 60%)' }} />
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', margin: '0 0 var(--space-2)', color: 'var(--color-brand)' }}>{card.t}</h3>
                    <p style={{ fontSize: '0.7rem', lineHeight: 1.5, margin: 0, fontWeight: 500, color: 'var(--color-text-secondary)' }}>{card.d}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-copy">&copy; {new Date().getFullYear()} Mivok Analytics Dashboard.</div>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Última actualización: {lastUpdate.toLocaleString('es-CL', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
