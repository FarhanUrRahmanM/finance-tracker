import API from './api';

export const getDashboardSummary = async (month, year) => {
  const response = await API.get('/dashboard/summary', { params: { month, year } });
  return response.data;
};

export const getCategoryExpenses = async (month, year) => {
  const response = await API.get('/dashboard/category-expenses', { params: { month, year } });
  return response.data;
};

export const getMonthlySummary = async (month, year) => {
  const response = await API.get('/dashboard/monthly-summary', { params: { month, year } });
  return response.data;
};

export const getMonthlyTrend = async () => {
  const response = await API.get('/dashboard/monthly-trend');
  return response.data;
};

export const getFinancialInsights = async () => {
  const response = await API.get('/dashboard/insights');
  return response.data;
};
