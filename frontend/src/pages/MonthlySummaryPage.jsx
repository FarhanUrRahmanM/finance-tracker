import React, { useState, useEffect, useCallback } from 'react';
import { getMonthlySummary, getCategoryExpenses } from '../services/dashboardService';
import { formatCurrency } from '../utils/currencyFormatter';
import { CardSkeleton } from '../components/LoadingSpinner';
import { CATEGORY_COLORS } from '../utils/constants';
import { toast } from 'react-toastify';
import {
  CalendarDays,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Receipt,
  Sparkles,
} from 'lucide-react';

const MonthlySummaryPage = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, catRes] = await Promise.all([
        getMonthlySummary(selectedMonth, selectedYear),
        getCategoryExpenses(selectedMonth, selectedYear),
      ]);

      if (sumRes.success) setSummaryData(sumRes);
      if (catRes.success) setCategoryData(catRes.categoryData);
    } catch (err) {
      console.error('Error fetching monthly summary:', err);
      toast.error('Failed to load monthly summary');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

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
            Monthly Financial Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive financial breakdown for selected period.
          </p>
        </div>

        {/* Month & Year Selectors */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-xs">
          <CalendarDays className="w-4 h-4 text-blue-600 ml-2" />
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
        <CardSkeleton />
      ) : (
        <>
          {/* Automated Text Summary Banner */}
          <div className="p-6 bg-blue-50 border border-blue-200 text-slate-900 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Automated Monthly Insight</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              {summaryData?.summaryText}
            </h3>
          </div>

          {/* Key Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-slate-500">Total Income</span>
                <div className="p-2 bg-green-50 text-green-600 rounded-full">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {formatCurrency(summaryData?.totalIncome || 0)}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-slate-500">Total Expenses</span>
                <div className="p-2 bg-red-50 text-red-600 rounded-full">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-red-600">
                {formatCurrency(summaryData?.totalExpenses || 0)}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-slate-500">Net Savings</span>
                <div className="p-2 bg-green-50 text-green-600 rounded-full">
                  <PiggyBank className="w-4 h-4" />
                </div>
              </div>
              <p
                className={`text-2xl font-extrabold ${
                  (summaryData?.netSavings || 0) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(summaryData?.netSavings || 0)}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-slate-500">Transactions Count</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">
                {summaryData?.transactionCount || 0}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Budget vs Actual */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Budget vs Expenses</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                  <span className="text-slate-500">Monthly Budget Set</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(summaryData?.monthlyBudget || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                  <span className="text-slate-500">Total Spent</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(summaryData?.totalExpenses || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                  <span className="text-slate-500">Remaining Target</span>
                  <span
                    className={`font-bold ${
                      (summaryData?.remainingBudget || 0) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(summaryData?.remainingBudget || 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-slate-500">Highest Spending Category</span>
                  <span className="font-bold text-blue-600">
                    {summaryData?.highestCategory} ({formatCurrency(summaryData?.highestCategoryAmount || 0)})
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Category Breakdown List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Category Expenses List</h3>
              {categoryData.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No categories to display</p>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {categoryData.map((c) => (
                    <div
                      key={c.category}
                      className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[c.category] || '#64748b' }}
                        ></span>
                        <span className="font-bold text-slate-800">{c.category}</span>
                      </div>
                      <div className="text-right font-extrabold text-slate-900">
                        {formatCurrency(c.totalSpent)} ({c.percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlySummaryPage;
