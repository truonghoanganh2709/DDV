import { api } from './api';

export const userService = {
  async getAll() {
    const { data } = await api.get('/users');
    return data;
  },
  async updateRole(id, role) {
    const { data } = await api.put(`/users/${id}/role`, { role });
    return data;
  },
  async updateStatus(id, payload) {
    const { data } = await api.put(`/users/${id}/status`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};

