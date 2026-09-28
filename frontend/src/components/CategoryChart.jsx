import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CATEGORY_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/currencyFormatter';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white text-slate-900 p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1">
        <p className="font-bold text-sm text-slate-900">{data.category}</p>
        <p className="text-slate-600">Amount: <span className="font-semibold text-slate-900">{formatCurrency(data.totalSpent)}</span></p>
        <p className="text-slate-500">{data.percentage}% of total expenses</p>
        <p className="text-slate-500">{data.count} transaction{data.count > 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
        <p className="text-sm text-slate-500 font-medium">No category expense data to display</p>
        <p className="text-xs text-slate-400 mt-1">Add expense transactions to see your spending breakdown.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={4}
            dataKey="totalSpent"
            nameKey="category"
          >
            {data.map((entry, index) => {
              const color = CATEGORY_COLORS[entry.category] || '#64748b';
              return <Cell key={`cell-${index}`} fill={color} stroke="#ffffff" strokeWidth={2} />;
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-semibold text-slate-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
