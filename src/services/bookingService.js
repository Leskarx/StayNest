import api from './api';

export const bookingService = {
  async createBooking(data) {
    const res = await api.post('/bookings', data);
    return res.data;
  },

  async getMyBookings() {
    const res = await api.get('/bookings/my-bookings');
    return res.data;
  },

  async cancelBooking(id) {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data;
  },

  async getOwnerBookings() {
    const res = await api.get('/bookings/property-bookings');
    return res.data;
  },
};
