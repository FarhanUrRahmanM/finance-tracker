import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      {text && <p className="text-sm font-medium text-slate-600">{text}</p>}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-28 bg-slate-200 rounded"></div>
        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
      </div>
      <div className="h-8 w-36 bg-slate-200 rounded mb-2"></div>
      <div className="h-3 w-24 bg-slate-200 rounded"></div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse shadow-xs space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
            <div className="space-y-1">
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-3 w-20 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="h-4 w-20 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
