import { api } from './api';

export const authService = {
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data; // {token, user}
  },

  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    if (data?.token && data?.user) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data; // {token, user}
  },

  async getProfile() {
    const { data } = await api.get('/auth/profile');
    return data; // {user}
  },

  async updateProfile(payload) {
    const { data } = await api.put('/auth/profile', payload);
    return data; // {user}
  },
};
