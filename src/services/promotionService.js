import { api } from './api';

export const promotionService = {
  async getAll(params = {}) {
    const { data } = await api.get('/promotions', { params });
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/promotions', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/promotions/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/promotions/${id}`);
    return data;
  },
  async check(code, orderValue) {
    const { data } = await api.post('/promotions/check', { code, orderValue });
    return data; // {ok, promotion, discountAmount}
  },
};

