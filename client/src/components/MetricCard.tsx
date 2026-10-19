import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'teal' | 'navy' | 'amber' | 'emerald' | 'rose' | 'indigo';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  accentColor = 'teal',
  onClick,
}) => {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'hover:border-teal-300',
      ring: 'group-hover:ring-teal-100',
    },
    navy: {
      bg: 'bg-navy-50',
      text: 'text-navy-800',
      border: 'hover:border-navy-300',
      ring: 'group-hover:ring-navy-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'hover:border-amber-300',
      ring: 'group-hover:ring-amber-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'hover:border-emerald-300',
      ring: 'group-hover:ring-emerald-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'hover:border-rose-300',
      ring: 'group-hover:ring-rose-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'hover:border-indigo-300',
      ring: 'group-hover:ring-indigo-100',
    },
  };

  const scheme = colorMap[accentColor] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl bg-white p-5 border border-slate-200/80 shadow-soft transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-card hover:-translate-y-0.5' : ''
      } ${scheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">{value}</h3>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
          {trend && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium">
              <span className={trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                {trend.value}
              </span>
              <span className="text-slate-400">vs last month</span>
            </p>
          )}
        </div>

        <div className={`rounded-xl p-3 ${scheme.bg} ${scheme.text} transition-all duration-200 group-hover:scale-105`}>
          <Icon className="h-6 w-6 stroke-[1.8]" />
        </div>
      </div>
      
      {/* Subtle bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${scheme.bg}`} />
    </div>
  );
};
