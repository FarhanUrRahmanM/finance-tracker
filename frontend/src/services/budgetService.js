import API from './api';

export const getBudget = async (month, year) => {
  const response = await API.get('/budget', { params: { month, year } });
  return response.data;
};

export const setBudget = async (data) => {
  const response = await API.post('/budget', data);
  return response.data;
};
