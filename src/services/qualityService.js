import api from "./api";

export const getQualityRecords = (params) => api.get("/quality", { params });
export const createQualityRecord = (payload) => api.post("/quality", payload);
