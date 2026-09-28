import React from 'react';
import { Sparkles, PieChart, AlertTriangle, AlertCircle, CheckCircle, TrendingUp, TrendingDown, DollarSign, Sliders } from 'lucide-react';

const iconMap = {
  PieChart,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Sliders,
};

const FinancialInsights = ({ insights = [] }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="p-5 bg-white border border-slate-200 rounded-2xl text-slate-500 text-sm">
        No insights available yet. Add transactions to see smart financial analysis.
      </div>
    );
  }

  const getTypeStyles = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Smart Financial Insights</h3>
          <p className="text-xs text-slate-500">Automated real-time analysis from your activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((item) => {
          const IconComponent = iconMap[item.icon] || Sparkles;
          const styleClass = getTypeStyles(item.type);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${styleClass}`}
            >
              <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-xs shrink-0">
                <IconComponent className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialInsights;
