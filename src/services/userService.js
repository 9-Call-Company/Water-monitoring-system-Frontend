import api from "./api";

export const getUsers = (params) => api.get("/users", { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (payload) => api.post("/users", payload);
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload);
export const toggleUserStatus = (id) => api.patch(`/users/${id}/status`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const searchUsers = (query) =>
  api.get("/users/search", { params: { q: query } });
