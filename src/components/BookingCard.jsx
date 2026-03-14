import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, X, CheckCircle } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, calcNights } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export function BookingCard({ property }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const nights = calcNights(checkIn, checkOut);
  const total = nights * property.pricePerNight;
  const serviceFee = Math.round(total * 0.12);
  const grandTotal = total + serviceFee;

  const today = new Date().toISOString().split('T')[0];

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      toast.error('Please select valid check-in and check-out dates.');
      return;
    }
    if (guests > property.maxGuests) {
      toast.error(`Maximum ${property.maxGuests} guests allowed.`);
      return;
    }
    setConfirmModal(true);
  };

  const confirmBooking = async () => {
    setLoading(true);
    try {
      await bookingService.createBooking({
        propertyId: property._id,
        checkIn,
        checkOut,
        guestsCount: guests,
      });
      toast.success('Booking confirmed! Check your dashboard.');
      setConfirmModal(false);
      navigate('/bookings');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sticky top-24">
        <div className="flex items-baseline gap-1 mb-5">
          <span className="text-2xl font-bold text-[#0F172A]">{formatPrice(property.pricePerNight)}</span>
          <span className="text-slate-500 text-sm">/ night</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
          <div className="grid grid-cols-2 border-b border-slate-200">
            <div className="p-3 border-r border-slate-200">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Check-in</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-sm text-slate-800 outline-none"
              />
            </div>
            <div className="p-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Check-out</label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-sm text-slate-800 outline-none"
              />
            </div>
          </div>
          <div className="p-3">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Guests</label>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-slate-400" />
              <input
                type="number"
                min={1}
                max={property.maxGuests}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="flex-1 text-sm text-slate-800 outline-none"
              />
              <span className="text-xs text-slate-400">max {property.maxGuests}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleBook}
          className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm text-sm"
        >
          {user ? 'Reserve' : 'Sign in to Book'}
        </button>

        {nights > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 space-y-2 text-sm"
          >
            <div className="flex justify-between text-slate-600">
              <span>{formatPrice(property.pricePerNight)} x {nights} nights</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Service fee</span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold text-[#0F172A]">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </motion.div>
        )}

        <p className="text-xs text-slate-400 text-center mt-4">You will not be charged yet</p>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#0F172A]">Confirm Booking</h3>
                <button onClick={() => setConfirmModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
                <p className="font-semibold text-[#0F172A]">{property.name}</p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{checkIn} — {checkOut}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{guests} guest{guests > 1 ? 's' : ''} · {nights} nights</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-5">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#2563EB]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={confirmBooking}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm Booking
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
