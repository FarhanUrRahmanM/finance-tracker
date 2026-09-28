import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getDashboardSummary,
  getCategoryExpenses,
  getMonthlyTrend,
  getFinancialInsights,
} from '../services/dashboardService';
import { getTransactions, deleteTransaction, createTransaction } from '../services/transactionService';
import { getBudget, setBudget as saveBudgetApi } from '../services/budgetService';
import SummaryCard from '../components/SummaryCard';
import BudgetProgress from '../components/BudgetProgress';
import CategoryChart from '../components/CategoryChart';
import MonthlyChart from '../components/MonthlyChart';
import FinancialInsights from '../components/FinancialInsights';
import TransactionTable from '../components/TransactionTable';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { CardSkeleton, TableSkeleton } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  Plus,
  ArrowRight,
  Sliders,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [insights, setInsights] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budget, setBudget] = useState(null);

  // Modals & Dialogs
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [budgetModalLoading, setBudgetModalLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date();
      const m = now.getMonth() + 1;
      const y = now.getFullYear();

      const [summaryRes, categoryRes, trendRes, insightsRes, txRes, budgetRes] =
        await Promise.all([
          getDashboardSummary(m, y),
          getCategoryExpenses(m, y),
          getMonthlyTrend(),
          getFinancialInsights(),
          getTransactions({ limit: 5, sort: 'newest' }),
          getBudget(m, y),
        ]);

      if (summaryRes.success) setSummary(summaryRes.summary);
      if (categoryRes.success) setCategoryData(categoryRes.categoryData);
      if (trendRes.success) setMonthlyTrend(trendRes.trend);
      if (insightsRes.success) setInsights(insightsRes.insights);
      if (txRes.success) setRecentTransactions(txRes.transactions);
      if (budgetRes.success) setBudget(budgetRes.budget);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    if (newBudgetAmount === '' || Number(newBudgetAmount) < 0) {
      toast.error('Please enter a valid non-negative budget amount');
      return;
    }

    setBudgetModalLoading(true);
    try {
      const now = new Date();
      const res = await saveBudgetApi({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amount: Number(newBudgetAmount),
      });

      if (res.success) {
        toast.success('Monthly budget updated successfully');
        setBudget(res.budget);
        setIsBudgetModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving budget');
    } finally {
      setBudgetModalLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteTransaction(deleteConfirmId);
      if (res.success) {
        toast.success('Transaction deleted successfully');
        setDeleteConfirmId(null);
        fetchDashboardData();
      }
    } catch (err) {
      toast.error('Failed to delete transaction');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddTransactionSubmit = async (formData) => {
    try {
      const res = await createTransaction(formData);
      if (res.success) {
        toast.success('Transaction added successfully');
        setIsAddModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Hello, {user?.name ? user.name.split(' ')[0] : 'User'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Here is your financial summary and monthly spending overview.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          amount={summary?.totalBalance || 0}
          icon={Wallet}
          description="Net cumulative wealth"
          variant="blue"
        />

        <SummaryCard
          title="Total Income"
          amount={summary?.monthIncome || 0}
          icon={ArrowUpRight}
          description="Current month income"
          variant="emerald"
        />

        <SummaryCard
          title="Total Expenses"
          amount={summary?.monthExpenses || 0}
          icon={ArrowDownLeft}
          description="Current month expenses"
          trend={summary?.momExpenseChange}
          variant="rose"
        />

        <SummaryCard
          title="Remaining Budget"
          amount={summary?.remainingBudget || 0}
          icon={PieChart}
          description={
            summary?.monthlyBudget > 0
              ? `${summary.budgetUsedPercentage}% of budget spent`
              : 'No budget set yet'
          }
          variant="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Expense by Category</h3>
              <p className="text-xs text-slate-500">Current month distribution</p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Full Analytics
            </button>
          </div>
          <CategoryChart data={categoryData} />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Income vs Expense</h3>
              <p className="text-xs text-slate-500">Monthly trend comparison</p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Trend
            </button>
          </div>
          <MonthlyChart data={monthlyTrend} />
        </div>
      </div>

      {/* Budget Progress Card */}
      <BudgetProgress
        budget={budget}
        onEditBudget={() => {
          setNewBudgetAmount(budget?.amount || '');
          setIsBudgetModalOpen(true);
        }}
      />

      {/* Automated Financial Insights */}
      <FinancialInsights insights={insights} />

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest activity on your account</p>
          </div>
          <button
            onClick={() => navigate('/transactions')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:underline"
          >
            <span>View All Transactions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyState
            title="No recent transactions"
            description="Start recording your daily income and expenses."
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <>
            <div className="hidden md:block">
              <TransactionTable
                transactions={recentTransactions}
                onEdit={(tx) => navigate(`/transactions/edit/${tx._id}`)}
                onDelete={(id) => setDeleteConfirmId(id)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
              {recentTransactions.map((tx) => (
                <TransactionCard
                  key={tx._id}
                  transaction={tx}
                  onEdit={(t) => navigate(`/transactions/edit/${t._id}`)}
                  onDelete={(id) => setDeleteConfirmId(id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Transaction"
        maxWidth="max-w-lg"
      >
        <TransactionForm
          onSubmit={handleAddTransactionSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Set Monthly Budget Modal */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        title="Set Monthly Budget"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center space-x-2 border border-blue-100">
            <Sliders className="w-4 h-4 shrink-0" />
            <span>Set your total expense target for the current month.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Monthly Target Budget (₹) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={newBudgetAmount}
              onChange={(e) => setNewBudgetAmount(e.target.value)}
              placeholder="e.g. 30000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-700 border border-slate-200 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={budgetModalLoading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              {budgetModalLoading ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default DashboardPage;
