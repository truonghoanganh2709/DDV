import { api } from './api';

export const reviewService = {
  async getByProduct(productId) {
    const { data } = await api.get(`/reviews/product/${productId}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/reviews', payload);
    return data;
  },
  async getAll() {
    const { data } = await api.get('/reviews');
    return data;
  },
  async updateStatus(id, status) {
    const { data } = await api.put(`/reviews/${id}/status`, { status });
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/reviews/${id}`);
    return data;
  },
};
