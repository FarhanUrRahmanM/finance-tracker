import React from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDate } from '../utils/dateFormatter';
import { CATEGORY_COLORS } from '../utils/constants';

const TransactionCard = ({ transaction: tx, onEdit, onDelete }) => {
  const isIncome = tx.type === 'Income';
  const catColor = CATEGORY_COLORS[tx.category] || '#64748b';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-xl ${
              isIncome
                ? 'bg-green-50 text-green-600 border border-green-100'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 line-clamp-1">{tx.description}</h4>
            <span className="text-xs text-slate-400">{formatDate(tx.date)}</span>
          </div>
        </div>
        <div className="text-right">
          <span
            className={`text-base font-extrabold block ${
              isIncome ? 'text-green-600' : 'text-slate-900'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${catColor}18`, color: catColor }}
          >
            {tx.category}
          </span>
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium border border-slate-200">
            {tx.paymentMethod}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(tx)}
              className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg border border-slate-100"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(tx._id)}
              className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg border border-slate-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
