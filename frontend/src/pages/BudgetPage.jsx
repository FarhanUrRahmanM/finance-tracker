import React, { useState, useEffect, useCallback } from 'react';
import { getBudget, setBudget as saveBudgetApi } from '../services/budgetService';
import { getCategoryExpenses } from '../services/dashboardService';
import BudgetProgress from '../components/BudgetProgress';
import Modal from '../components/Modal';
import { CardSkeleton } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/currencyFormatter';
import { getMonthName } from '../utils/dateFormatter';
import { CATEGORY_COLORS } from '../utils/constants';
import { toast } from 'react-toastify';
import { Calendar, Sliders } from 'lucide-react';

const BudgetPage = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [budget, setBudget] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set Budget Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBudgetData = useCallback(async () => {
    try {
      setLoading(true);
      const [budgetRes, categoryRes] = await Promise.all([
        getBudget(selectedMonth, selectedYear),
        getCategoryExpenses(selectedMonth, selectedYear),
      ]);

      if (budgetRes.success) setBudget(budgetRes.budget);
      if (categoryRes.success) setCategoryData(categoryRes.categoryData);
    } catch (err) {
      console.error('Error fetching budget:', err);
      toast.error('Failed to load budget details');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (budgetInput === '' || Number(budgetInput) < 0) {
      toast.error('Please enter a valid non-negative budget amount');
      return;
    }

    setSaving(true);
    try {
      const res = await saveBudgetApi({
        month: selectedMonth,
        year: selectedYear,
        amount: Number(budgetInput),
      });

      if (res.success) {
        toast.success(`Budget updated for ${getMonthName(selectedMonth)} ${selectedYear}`);
        setBudget(res.budget);
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update budget');
    } finally {
      setSaving(false);
    }
  };

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
            Monthly Budget Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Set and monitor your spending limits for any month.
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
        <CardSkeleton />
      ) : (
        <>
          {/* Main Budget Progress Card */}
          <BudgetProgress
            budget={budget}
            onEditBudget={() => {
              setBudgetInput(budget?.amount !== undefined ? budget.amount : '');
              setIsModalOpen(true);
            }}
          />

          {/* Category-wise Expense Breakdown for Selected Month */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Category Spending Breakdown ({getMonthName(selectedMonth)} {selectedYear})
              </h3>
              <p className="text-xs text-slate-500">
                Detailed view of category expenditure against total monthly expenses.
              </p>
            </div>

            {categoryData.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No expense transactions logged for this month.
              </p>
            ) : (
              <div className="space-y-3 pt-2">
                {categoryData.map((cat) => {
                  const catColor = CATEGORY_COLORS[cat.category] || '#64748b';

                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center space-x-2 text-slate-800">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: catColor }}
                          ></span>
                          <span>{cat.category}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({cat.count} tx)
                          </span>
                        </span>
                        <span className="text-slate-900 font-extrabold">
                          {formatCurrency(cat.totalSpent)} ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(cat.percentage, 100)}%`,
                            backgroundColor: catColor,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Set Monthly Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Set Budget for ${getMonthName(selectedMonth)} ${selectedYear}`}
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center space-x-2 border border-blue-100">
            <Sliders className="w-4 h-4 shrink-0" />
            <span>Set target maximum expenses for this month.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Monthly Budget Amount (₹) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="e.g. 30000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-700 border border-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BudgetPage;
