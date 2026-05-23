import { api } from './api';

export const orderService = {
  async create(payload) {
    const { data } = await api.post('/orders', payload);
    return data;
  },
  async getMyOrders() {
    const { data } = await api.get('/orders/my-orders');
    return data;
  },
  async getAll() {
    const { data } = await api.get('/orders');
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  async updateStatus(id, status) {
    const { data } = await api.put(`/orders/${id}/status`, { status });
    return data;
  },
};

