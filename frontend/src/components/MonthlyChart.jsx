import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../utils/currencyFormatter';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-slate-900 p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1.5">
        <p className="font-bold text-slate-900">{label}</p>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
          <span className="text-slate-600">Income:</span>
          <span className="font-semibold text-green-700">{formatCurrency(payload[0]?.value || 0)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <span className="text-slate-600">Expense:</span>
          <span className="font-semibold text-red-700">{formatCurrency(payload[1]?.value || 0)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
        <p className="text-sm text-slate-500 font-medium">No monthly trend data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
            tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-700 capitalize">{value}</span>
            )}
          />
          <Bar dataKey="income" name="Income" fill="#16A34A" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="expense" name="Expense" fill="#DC2626" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
