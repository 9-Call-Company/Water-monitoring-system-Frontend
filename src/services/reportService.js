import api from "./api";

export const getReports = (params) => api.get("/reports", { params });
export const exportReports = (params) =>
  api.get("/reports/export", { params, responseType: "blob" });
