import api from "./api";

export const getIssues = (params) => api.get("/issues", { params });
export const getIssueById = (id) => api.get(`/issues/${id}`);
export const createIssue = (payload) => api.post("/issues", payload);
export const updateIssue = (id, payload) => api.put(`/issues/${id}`, payload);
export const resolveIssue = (id) => api.patch(`/issues/${id}/resolve`);
export const deleteIssue = (id) => api.delete(`/issues/${id}`);
