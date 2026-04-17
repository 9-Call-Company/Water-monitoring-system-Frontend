import api from './api';

export const getIssues = () => api.get('/issues');
export const getIssueById = (id) => api.get(`/issues/${id}`);
export const createIssue = (data) => api.post('/issues', data);
export const updateIssue = (id, data) => api.put(`/issues/${id}`, data);
export const updateIssueStatus = (id) => api.patch(`/issues/${id}/resolve`);
export const deleteIssue = (id) => api.delete(`/issues/${id}`);
