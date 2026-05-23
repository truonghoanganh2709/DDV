import { api } from './api';

export const uploadService = {
  async uploadImage(file) {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // {url}
  },
};

