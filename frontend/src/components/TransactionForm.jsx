import React, { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import { formatInputDate } from '../utils/dateFormatter';

const TransactionForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [type, setType] = useState('Expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatInputDate(new Date()));
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'Expense');
      setAmount(initialData.amount !== undefined ? initialData.amount : '');
      setCategory(initialData.category || (initialData.type === 'Income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]));
      setDescription(initialData.description || '');
      setDate(formatInputDate(initialData.date));
      setPaymentMethod(initialData.paymentMethod || 'UPI');
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'Income') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  };

  const validate = () => {
    const errs = {};
    if (!amount || Number(amount) <= 0) {
      errs.amount = 'Amount must be greater than 0';
    }
    if (!description.trim()) {
      errs.description = 'Description is required';
    }
    if (!category) {
      errs.category = 'Category is required';
    }
    if (!date) {
      errs.date = 'Valid date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      type,
      amount: Number(amount),
      category,
      description: description.trim(),
      date,
      paymentMethod,
      notes: notes.trim(),
    });
  };

  const categories = type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Selector Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => handleTypeChange('Expense')}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
            type === 'Expense'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('Income')}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
            type === 'Income'
              ? 'bg-green-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Income
        </button>
      </div>

      {/* Amount Field */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Amount (₹) *
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-lg">₹</span>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-lg placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Description *
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Grocery Shopping, Monthly Salary..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Category & Payment Method Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Date *
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
      </div>

      {/* Optional Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Notes (Optional)
        </label>
        <textarea
          rows="2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add extra details or reference numbers..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        ></textarea>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-slate-700 border border-slate-200 hover:bg-slate-50 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
