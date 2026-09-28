import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTransactionById, updateTransaction } from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

const EditTransactionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const res = await getTransactionById(id);
        if (res.success) {
          setTransaction(res.transaction);
        }
      } catch (err) {
        toast.error('Transaction not found');
        navigate('/transactions');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransaction();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      const res = await updateTransaction(id, formData);
      if (res.success) {
        toast.success('Transaction updated successfully!');
        navigate('/transactions');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update transaction');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner text="Fetching transaction details..." />
      </div>
    );
  }

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
            Edit Transaction
          </h2>
          <p className="text-xs text-slate-500">
            Modify transaction details, amount, category, or payment method.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <TransactionForm
          initialData={transaction}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/transactions')}
          isLoading={saving}
        />
      </div>
    </div>
  );
};

export default EditTransactionPage;
