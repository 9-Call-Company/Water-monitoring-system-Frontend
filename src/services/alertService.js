import api from './api';

export const getAlerts = (params) => api.get('/alerts', { params });
export const getAlertsByUser = (userId) => api.get('/alerts', { params: { userId } });
export const createAlert = (data) => api.post('/alerts', data);
export const resolveAlert = (id) => api.put(`/alerts/${id}/resolve`);
export const ackAlert = (id) => api.patch(`/alerts/${id}/ack`);
