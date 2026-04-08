import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const KPICard: React.FC<CardProps> = ({ title, value, subtitle, trend, icon, className }) => {
  return (
    <div className={cn("kpi-card", className)}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-brand-500">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-1.5 py-0.5 rounded-full",
            trend.isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};

export const SectionHeader: React.FC<{ title: string; description?: string }> = ({ title, description }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    {description && <p className="text-sm text-slate-500">{description}</p>}
  </div>
);

export const InsightPanel: React.FC<{ insights: string[] }> = ({ insights }) => (
  <div className="glass-card p-6 bg-brand-50 border-brand-100">
    <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest mb-4 flex items-center gap-2">
      <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
      Business Insights
    </h3>
    <ul className="space-y-3">
      {insights.map((insight, i) => (
        <li key={i} className="text-sm text-brand-800 flex gap-3">
          <span className="text-brand-400 font-bold">•</span>
          {insight}
        </li>
      ))}
    </ul>
  </div>
);
