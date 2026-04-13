import api from "./api";

export const getSources = (params) => api.get("/sources", { params });
export const getSourceById = (id) => api.get(`/sources/${id}`);
export const createSource = (payload) => api.post("/sources", payload);
export const updateSource = (id, payload) => api.put(`/sources/${id}`, payload);
export const toggleSourceStatus = (id) => api.patch(`/sources/${id}/status`);
export const deleteSource = (id) => api.delete(`/sources/${id}`);
