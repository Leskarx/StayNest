import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, MapPin, Users, X, Search } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/Loader';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

export function MyBookingsPage() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState(null);

  useEffect(() => {
    bookingService
      .getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingService.cancelBooking(id);
      setBookings((b) =>
        b.map((bk) => (bk._id === id ? { ...bk, status: 'cancelled' } : bk))
      );
      toast.success('Booking cancelled successfully.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelId(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pt-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A]">My Bookings</h1>
          <Link
            to="/search"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            Find more stays
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-xl capitalize whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#2563EB]'
              }`}
            >
              {status === 'all' ? 'All Bookings' : status}
              {status === 'all' && bookings.length > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === 'all' ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                  {bookings.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-600">No bookings found</p>
            <p className="text-sm text-slate-400 mt-1">
              {filter === 'all' ? 'Start exploring amazing properties' : `No ${filter} bookings`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((booking, i) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-5">
                    <Link to={`/property/${booking.property?._id || booking.property}`}>
                      <img
                        src={booking.property?.coverImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80'}
                        alt={booking.property?.name}
                        className="w-full sm:w-28 h-28 rounded-xl object-cover shrink-0"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            to={`/property/${booking.property?._id || booking.property}`}
                            className="text-base font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors"
                          >
                            {booking.property?.name || 'Property'}
                          </Link>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <CalendarCheck className="w-3.5 h-3.5" />
                              {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                            </span>
                            {booking.guestsCount && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {booking.guestsCount} guest{booking.guestsCount > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize shrink-0 ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="text-lg font-bold text-[#0F172A]">{formatPrice(booking.totalPrice)}</span>
                          <span className="text-xs text-slate-400 ml-1">total</span>
                        </div>
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => setCancelId(booking._id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {cancelId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setCancelId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Cancel Booking?</h3>
              <p className="text-sm text-slate-500 mb-6">
                This action cannot be undone. The booking will be marked as cancelled.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelId(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancel(cancelId)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
