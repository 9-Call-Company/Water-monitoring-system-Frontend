import api from './api';

export const getConsumptionReport = (params) => api.get('/reports/consumption', { params });
export const getAlertsReport = (params) => api.get('/reports/alerts', { params });
export const getUsersReport = (params) => api.get('/reports/users', { params });
export const getEquipmentReport = (params) => api.get('/reports/equipment', { params });
export const exportReport = (type, reportType, params) =>
  api.get('/reports/export', {
    params: { type, reportType, ...params },
    responseType: 'blob',
  });
