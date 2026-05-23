import { api } from './api';

export const bannerService = {
  async getAll(params = {}) {
    const { data } = await api.get('/banners', { params });
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/banners', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/banners/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/banners/${id}`);
    return data;
  },
};

