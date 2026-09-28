import React, { useState, useEffect } from 'react';
import { getCategoryExpenses, getMonthlyTrend } from '../services/dashboardService';
import CategoryChart from '../components/CategoryChart';
import MonthlyChart from '../components/MonthlyChart';
import SpendingTrendChart from '../components/SpendingTrendChart';
import { CardSkeleton } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/currencyFormatter';
import { CATEGORY_COLORS } from '../utils/constants';
import { toast } from 'react-toastify';
import { Calendar } from 'lucide-react';

const AnalyticsPage = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [totalMonthExpenses, setTotalMonthExpenses] = useState(0);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [catRes, trendRes] = await Promise.all([
          getCategoryExpenses(selectedMonth, selectedYear),
          getMonthlyTrend(),
        ]);

        if (catRes.success) {
          setCategoryData(catRes.categoryData);
          setTotalMonthExpenses(catRes.totalMonthExpenses);
        }
        if (trendRes.success) {
          setMonthlyTrend(trendRes.trend);
        }
      } catch (err) {
        console.error('Analytics load error:', err);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedMonth, selectedYear]);

  const yearsList = [2024, 2025, 2026, 2027];
  const monthsList = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Financial Analytics & Charts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive visual analysis of income, expenses, and spending patterns.
          </p>
        </div>

        {/* Month & Year Selectors */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-xs">
          <Calendar className="w-4 h-4 text-blue-600 ml-2" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="bg-transparent text-xs font-bold text-slate-800 outline-none py-1.5 px-2"
          >
            {monthsList.map((m) => (
              <option key={m.num} value={m.num}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-transparent text-xs font-bold text-slate-800 outline-none py-1.5 px-2"
          >
            {yearsList.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donut Chart: Expenses by Category */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Expense by Category (Donut Chart)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Total Expenses: {formatCurrency(totalMonthExpenses)}
              </p>
              <CategoryChart data={categoryData} />
            </div>

            {/* Bar Chart: Income vs Expense */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Monthly Income vs Expense (Bar Chart)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Comparing revenue vs spending across recent months
              </p>
              <MonthlyChart data={monthlyTrend} />
            </div>
          </div>

          {/* Spending Trend Area Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Spending Trend Over Time (Area Chart)
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing expense progression across recent billing cycles
              </p>
            </div>
            <SpendingTrendChart data={monthlyTrend} />
          </div>

          {/* Detailed Category Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Category Breakdown Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">% of Total Expenses</th>
                    <th className="py-3 px-4 text-center">Transactions Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoryData.map((cat) => (
                    <tr key={cat.category} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#64748b' }}
                        ></span>
                        <span>{cat.category}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatCurrency(cat.totalSpent)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-blue-600">
                        {cat.percentage}%
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">
                        {cat.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
