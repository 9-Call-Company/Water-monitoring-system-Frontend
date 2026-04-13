import api from "./api";

export const getRobines = (params) => api.get("/robines", { params });
export const getRobineById = (id) => api.get(`/robines/${id}`);
export const createRobine = (payload) => api.post("/robines", payload);
export const updateRobine = (id, payload) => api.put(`/robines/${id}`, payload);
export const toggleRobineStatus = (id) => api.patch(`/robines/${id}/status`);
export const deleteRobine = (id) => api.delete(`/robines/${id}`);
