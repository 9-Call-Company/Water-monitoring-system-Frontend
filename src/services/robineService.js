import api from './api';

export const getRobines = (params) => api.get('/robines', { params });
export const getRobineById = (id) => api.get(`/robines/${id}`);
export const getRobineByUser = (userId) => api.get('/robines', { params: { userId } });
export const getRobineByAgent = (agentId) => api.get('/robines', { params: { agentId } });
export const createRobine = (data) => api.post('/robines', data);
export const updateRobine = (id, data) => api.put(`/robines/${id}`, data);
export const toggleRobineStatus = (id) => api.patch(`/robines/${id}/status`);
export const deleteRobine = (id) => api.delete(`/robines/${id}`);
