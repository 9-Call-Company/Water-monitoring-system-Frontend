import api from './api';

export const getSources = () => api.get('/sources');
export const getSourceById = (id) => api.get(`/sources/${id}`);
export const createSource = (data) => api.post('/sources', data);
export const updateSource = (id, data) => api.put(`/sources/${id}`, data);
export const toggleSourceStatus = (id) => api.patch(`/sources/${id}/status`);
export const controlSourceValve = (id, action) => api.patch(`/sources/${id}/valve`, { action });
export const deleteSource = (id) => api.delete(`/sources/${id}`);

// Agent assignment functions
export const getSourceAgents = (id) => api.get(`/sources/${id}/agents`);
export const assignAgentToSource = (id, agent_id) => api.post(`/sources/${id}/agents`, { agent_id });
export const removeAgentFromSource = (id, agent_id) => api.delete(`/sources/${id}/agents`, { data: { agent_id } });

