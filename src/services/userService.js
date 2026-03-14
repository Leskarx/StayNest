import api from './api';

export const userService = {
  async getProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/users/profile', data);
    return res.data;
  },

  async uploadProfileImage(formData) {
    const res = await api.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
