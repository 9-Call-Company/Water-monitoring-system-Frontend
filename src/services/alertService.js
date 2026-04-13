import api from "./api";

export const getAlerts = (params) => api.get("/alerts", { params });
export const getAlertById = (id) => api.get(`/alerts/${id}`);
export const createAlert = (payload) => api.post("/alerts", payload);
export const acknowledgeAlert = (id) => api.patch(`/alerts/${id}/ack`);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);
