
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, isPositive, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {isPositive ? '+' : ''}{trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
