import api from './api';

export const getQuality = () => api.get('/quality');
export const getQualityBySource = (sourceId) => api.get('/quality', { params: { sourceId } });
export const createQuality = (data) => api.post('/quality', data);
export const updateQuality = (id, data) => api.put(`/quality/${id}`, data);
