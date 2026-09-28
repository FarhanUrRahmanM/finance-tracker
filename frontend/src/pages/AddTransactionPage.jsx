import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

const AddTransactionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await createTransaction(formData);
      if (res.success) {
        toast.success('Transaction added successfully!');
        navigate('/transactions');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Add New Transaction
          </h2>
          <p className="text-xs text-slate-500">
            Record an income credit or expense debit to your account.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/transactions')}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default AddTransactionPage;
