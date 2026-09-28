import React from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';
import { formatDate } from '../utils/dateFormatter';
import { CATEGORY_COLORS } from '../utils/constants';

const TransactionTable = ({ transactions = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Description</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Payment Method</th>
            <th className="py-3.5 px-4">Type</th>
            <th className="py-3.5 px-4 text-right">Amount</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'Income';
            const catColor = CATEGORY_COLORS[tx.category] || '#64748b';

            return (
              <tr
                key={tx._id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                {/* Date */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium text-xs">
                  {formatDate(tx.date)}
                </td>

                {/* Description */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 max-w-xs truncate">
                    {tx.description}
                  </div>
                  {tx.notes && (
                    <div className="text-xs text-slate-400 truncate max-w-xs">
                      {tx.notes}
                    </div>
                  )}
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${catColor}15`,
                      color: catColor,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mr-1.5"
                      style={{ backgroundColor: catColor }}
                    ></span>
                    {tx.category}
                  </span>
                </td>

                {/* Payment Method */}
                <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-xs">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium border border-slate-200">
                    {tx.paymentMethod}
                  </span>
                </td>

                {/* Type */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isIncome
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-green-600" />
                    ) : (
                      <ArrowDownLeft className="w-3.5 h-3.5 mr-1 text-red-600" />
                    )}
                    {tx.type}
                  </span>
                </td>

                {/* Amount */}
                <td
                  className={`py-3.5 px-4 text-right font-extrabold whitespace-nowrap ${
                    isIncome ? 'text-green-600' : 'text-slate-900'
                  }`}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center space-x-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(tx)}
                        title="Edit transaction"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(tx._id)}
                        title="Delete transaction"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
