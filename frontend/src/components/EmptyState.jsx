import React from 'react';
import { FolderOpen, Plus } from 'lucide-react';

const EmptyState = ({
  title = 'No transactions found',
  description = 'You have not added any transactions for this period or search criteria.',
  actionText = 'Add Transaction',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white my-4 shadow-xs">
      <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4 border border-blue-100">
        <FolderOpen className="w-10 h-10" />
      </div>
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
