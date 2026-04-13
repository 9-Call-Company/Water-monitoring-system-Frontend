import api from "./api";

export const getLatestSensorData = (sourceId) =>
  api.get(`/sensor-data/latest/${sourceId}`);
export const getSensorReadings = (params) =>
  api.get("/sensor-data", { params });
