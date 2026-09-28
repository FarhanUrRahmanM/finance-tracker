import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';

const SummaryCard = ({ title, amount, icon: Icon, description, trend, variant = 'blue' }) => {
  const variantStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600',
    },
    emerald: {
      iconBg: 'bg-green-50 text-green-600',
    },
    rose: {
      iconBg: 'bg-red-50 text-red-600',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600',
    },
  };

  const style = variantStyles[variant] || variantStyles.blue;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-3 rounded-full ${style.iconBg}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(amount)}
        </h3>
        <div className="flex items-center space-x-2 pt-1">
          {trend !== undefined && trend !== null && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                trend >= 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(trend)}%
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
