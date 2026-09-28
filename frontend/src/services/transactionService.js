import API from './api';

export const getTransactions = async (params = {}) => {
  const response = await API.get('/transactions', { params });
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await API.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await API.post('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await API.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await API.delete(`/transactions/${id}`);
  return response.data;
};
