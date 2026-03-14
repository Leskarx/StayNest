import api from './api';

export const propertyService = {
  async getProperties(params = {}) {
    const res = await api.get('/properties', { params });
    return res.data;
  },

  async getProperty(id) {
    const res = await api.get(`/properties/${id}`);
    return res.data;
  },

  async createProperty(formData) {
    const res = await api.post('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async updateProperty(id, formData) {
    const res = await api.put(`/properties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async deleteProperty(id) {
    const res = await api.delete(`/properties/${id}`);
    return res.data;
  },

  async getOwnerProperties() {
    const res = await api.get('/properties/owner/me');
    return res.data;
  },

  async getPropertyBookings(propertyId) {
    const res = await api.get(`/properties/${propertyId}/bookings`);
    return res.data;
  },
};
