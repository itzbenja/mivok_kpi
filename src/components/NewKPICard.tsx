import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface NewKPICardProps {
  title: string;
  value: string | number;
  delta?: number; // variación porcentual
  sparkData?: number[]; // datos para sparkline
  variant?: 'default' | 'cyan' | 'emerald' | 'amber'; // variante de color
}

const buildSparkPath = (data: number[] = [], width = 100, height = 32) => {
  if (!data.length) return '';
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  return data
    .map((v, i) => {
      const x = i * stepX;
      const norm = (v - min) / range;
      const y = height - norm * height;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
};

export const NewKPICard: React.FC<NewKPICardProps> = ({ title, value, delta = 0, sparkData, variant = 'default' }) => {
  const trendIcon = delta < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />;
  const deltaClass = delta === 0 ? 'neutral' : delta < 0 ? 'neg' : 'pos';
  const formattedValue = typeof value === 'number' ? value.toString() : value;
  const path = buildSparkPath(sparkData || [], 100, 40);

  // Colores según variante
  const strokeColors = {
    default: 'rgba(99,102,241,0.9)',
    cyan: 'rgba(6,182,212,0.9)',
    emerald: 'rgba(16,185,129,0.9)',
    amber: 'rgba(245,158,11,0.9)'
  };

  return (
    <div className={`kpi-card-new kpi-card-${variant}`} data-variant={variant}>
      <div className="kpi-card-head">
        <span className="kpi-label">{title}</span>
        <span className={`kpi-delta ${deltaClass}`}>{trendIcon}{delta}%</span>
      </div>
      <div className="kpi-value-primary">{formattedValue}</div>
      <div className="sparkline-placeholder" aria-hidden="true">
        {path && (
          <svg width={100} height={40} style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id={`gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: strokeColors[variant], stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: strokeColors[variant], stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <path 
              d={path} 
              fill="none" 
              stroke={`url(#gradient-${variant})`} 
              strokeWidth={2.5} 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
