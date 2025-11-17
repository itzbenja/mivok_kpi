import { useState, useMemo } from 'react';
import { Filter, Calendar } from 'lucide-react';
import type { Filtros } from '../types';

interface FilterPanelProps {
  onFilterChange: (filtros: Filtros) => void;
}

const EVENT_TYPES = ['Boda','Cumpleaños','Corporativo','Fiesta Temática','Graduación','Año Nuevo','Concierto','Bar Mitzvah','Fiesta','Aniversario','Quinceañera','Bautizo','Baby Shower'];
const ESTADOS = ['completado','pendiente','aceptado','rechazado','cancelado'];

export const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [filtros, setFiltros] = useState<Filtros>({});
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Conteo de filtros activos para mostrar badge
  const activeCount = useMemo(() => {
    return [
      filtros.anio,
      filtros.tipoEvento,
      filtros.estado,
      filtros.fechaInicio,
      filtros.fechaFin
    ].filter(Boolean).length;
  }, [filtros]);

  const update = (patch: Partial<Filtros>) => {
    const newFiltros = { ...filtros, ...patch };
    // limpiar claves vacías
    Object.keys(newFiltros).forEach(k => { if ((newFiltros as any)[k] === '' || (newFiltros as any)[k] == null) delete (newFiltros as any)[k]; });
    setFiltros(newFiltros);
    onFilterChange(newFiltros);
  };

  const limpiarFiltros = () => {
    setFiltros({});
    onFilterChange({});
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <div className="filter-icon-header">
          <Filter size={18} className="text-white" />
        </div>
        <div className="filter-titles">
          <span className="filter-title">Filtros</span>
          <span className="filter-sub">Personaliza tu búsqueda</span>
        </div>
        <div className="filter-actions">
          {activeCount > 0 && (
            <span className="filter-badge" aria-label={`${activeCount} filtros activos`}>{activeCount}</span>
          )}
          <button onClick={limpiarFiltros} className="btn-clear-filters" aria-label="Limpiar filtros">Limpiar</button>
        </div>
      </div>

      <div className="filter-groups">
        <div className="filter-group">
          <div className="filter-subtitle">AÑO</div>
          <div className="segmented-group" role="group" aria-label="Seleccionar año">
            <button
              type="button"
              className={`segmented-option ${!filtros.anio ? 'active' : ''}`}
              onClick={() => update({ anio: undefined })}
            >Todos</button>
            {years.map(y => (
              <button
                key={y}
                type="button"
                className={`segmented-option ${filtros.anio === y ? 'active' : ''}`}
                onClick={() => update({ anio: y })}
              >{y}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-subtitle">TIPO</div>
          <div className="chip-row" role="group" aria-label="Tipo de evento">
            <button
              type="button"
              className={`chip-filter ${!filtros.tipoEvento ? 'active' : ''}`}
              onClick={() => update({ tipoEvento: undefined })}
            >Todos</button>
            {EVENT_TYPES.map(tipo => (
              <button
                key={tipo}
                type="button"
                className={`chip-filter ${filtros.tipoEvento === tipo ? 'active' : ''}`}
                onClick={() => update({ tipoEvento: tipo })}
              >{tipo}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-subtitle">ESTADO</div>
          <div className="chip-row" role="group" aria-label="Estado de evento">
            <button
              type="button"
              className={`chip-filter ${!filtros.estado ? 'active' : ''}`}
              onClick={() => update({ estado: undefined })}
            >Todos</button>
            {ESTADOS.map(est => (
              <button
                key={est}
                type="button"
                className={`chip-filter ${filtros.estado === est ? 'active' : ''}`}
                onClick={() => update({ estado: est })}
              >{est.charAt(0).toUpperCase()+est.slice(1)}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-subtitle">FECHAS</div>
          <div className="date-range-row">
            <div className="date-input-wrapper">
              <Calendar size={14} className="date-icon" />
              <input
                type="date"
                value={filtros.fechaInicio || ''}
                onChange={e => update({ fechaInicio: e.target.value || undefined })}
                className="filter-date-input"
                placeholder="Desde"
              />
            </div>
            <div className="date-input-wrapper">
              <Calendar size={14} className="date-icon" />
              <input
                type="date"
                value={filtros.fechaFin || ''}
                onChange={e => update({ fechaFin: e.target.value || undefined })}
                className="filter-date-input"
                placeholder="Hasta"
              />
            </div>
          </div>
        </div>

        {/* Filtros de DJ/Cliente específicos removidos a pedido */}
      </div>
    </div>
  );
};
