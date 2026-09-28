import React from 'react';
import { Sliders, AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';

const BudgetProgress = ({ budget, onEditBudget }) => {
  const { amount = 0, spent = 0, remaining = 0, percentage = 0, status = 'normal' } = budget || {};

  const getStatusBadge = () => {
    switch (status) {
      case 'normal':
        return {
          label: 'On Track',
          bg: 'bg-green-50 text-green-700 border border-green-200',
          barBg: 'bg-green-600',
          icon: CheckCircle2,
        };
      case 'warning':
        return {
          label: 'Moderate',
          bg: 'bg-amber-50 text-amber-700 border border-amber-200',
          barBg: 'bg-amber-500',
          icon: AlertCircle,
        };
      case 'high':
        return {
          label: 'High Spending',
          bg: 'bg-orange-50 text-orange-700 border border-orange-200',
          barBg: 'bg-orange-500',
          icon: AlertTriangle,
        };
      case 'exceeded':
        return {
          label: 'Budget Exceeded',
          bg: 'bg-red-50 text-red-700 border border-red-200',
          barBg: 'bg-red-600',
          icon: ShieldAlert,
        };
      default:
        return {
          label: 'Normal',
          bg: 'bg-slate-100 text-slate-700 border border-slate-200',
          barBg: 'bg-blue-600',
          icon: CheckCircle2,
        };
    }
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;
  const cappedPct = Math.min(percentage, 100);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Budget Status</h3>
            <p className="text-xs text-slate-500">Track spending against your monthly target</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg}`}>
            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
            {statusInfo.label}
          </span>
          {onEditBudget && (
            <button
              onClick={onEditBudget}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline ml-2"
            >
              Set Budget
            </button>
          )}
        </div>
      </div>

      {amount <= 0 ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
          <p className="text-sm text-slate-600">No monthly budget set for this period.</p>
          {onEditBudget && (
            <button
              onClick={onEditBudget}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Set Monthly Budget
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>Used: {percentage}%</span>
              <span>{formatCurrency(spent)} of {formatCurrency(amount)}</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusInfo.barBg}`}
                style={{ width: `${cappedPct}%` }}
              ></div>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Monthly Budget</span>
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Total Spent</span>
              <span className="text-sm sm:text-base font-bold text-red-600">
                {formatCurrency(spent)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 block">Remaining</span>
              <span
                className={`text-sm sm:text-base font-bold ${
                  remaining >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(remaining)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetProgress;
