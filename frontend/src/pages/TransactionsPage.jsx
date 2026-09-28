import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactions, deleteTransaction, createTransaction } from '../services/transactionService';
import TransactionTable from '../components/TransactionTable';
import TransactionCard from '../components/TransactionCard';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSpinner';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import { formatCurrency } from '../utils/currencyFormatter';
import { toast } from 'react-toastify';
import {
  Search,
  Filter,
  Plus,
  RotateCcw,
} from 'lucide-react';

const TransactionsPage = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expenses: 0, net: 0 });
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [category, setCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('newest');

  // Modals & Dialogs
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransactionsData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        type: type !== 'All' ? type : undefined,
        category: category !== 'All' ? category : undefined,
        paymentMethod: paymentMethod !== 'All' ? paymentMethod : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sort,
      };

      const res = await getTransactions(params);
      if (res.success) {
        setTransactions(res.transactions);
        if (res.totals) setTotals(res.totals);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [search, type, category, paymentMethod, startDate, endDate, sort]);

  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  const handleResetFilters = () => {
    setSearch('');
    setType('All');
    setCategory('All');
    setPaymentMethod('All');
    setStartDate('');
    setEndDate('');
    setSort('newest');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteTransaction(deleteConfirmId);
      if (res.success) {
        toast.success('Transaction deleted successfully');
        setDeleteConfirmId(null);
        fetchTransactionsData();
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
        fetchTransactionsData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Transactions History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter, and manage all your income and expenses.
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

      {/* Totals Summary Banner */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="text-center border-r border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Filtered Income</span>
          <span className="text-sm sm:text-lg font-extrabold text-green-600">
            {formatCurrency(totals.income)}
          </span>
        </div>
        <div className="text-center border-r border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Filtered Expenses</span>
          <span className="text-sm sm:text-lg font-extrabold text-red-600">
            {formatCurrency(totals.expenses)}
          </span>
        </div>
        <div className="text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">Net Result</span>
          <span
            className={`text-sm sm:text-lg font-extrabold ${
              totals.net >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(totals.net)}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Search & Filter</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Input & Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Dropdown */}
          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Types (Income & Expense)</option>
              <option value="Expense">Expense Only</option>
              <option value="Income">Income Only</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Dropdown */}
          <div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Payment Methods</option>
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range & Sorting Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Content */}
      {loading ? (
        <TableSkeleton />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions matched"
          description="Try resetting your filters or add a new transaction."
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          <div className="hidden md:block">
            <TransactionTable
              transactions={transactions}
              onEdit={(tx) => navigate(`/transactions/edit/${tx._id}`)}
              onDelete={(id) => setDeleteConfirmId(id)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:hidden">
            {transactions.map((tx) => (
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

export default TransactionsPage;
