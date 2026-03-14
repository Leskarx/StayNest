import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck, Users } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { Loader } from '../components/Loader';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

export function PropertyBookingsPage() {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      propertyService.getPropertyBookings(id),
      propertyService.getProperty(id),
    ])
      .then(([bRes, pRes]) => {
        setBookings(bRes.data || []);
        setProperty(pRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pt-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Property Bookings</h1>
        {property && (
          <p className="text-slate-500 text-sm mb-8">{property.name} — {bookings.length} bookings</p>
        )}

        {loading ? (
          <Loader />
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-600">No bookings yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Guest</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Check-in</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Check-out</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Guests</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Total</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <motion.tr
                      key={b._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              b.user?.profileImage?.url ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(b.user?.name || 'G')}&background=2563EB&color=fff&size=32`
                            }
                            className="w-7 h-7 rounded-lg object-cover"
                            alt={b.user?.name}
                          />
                          <span className="font-medium text-[#0F172A]">{b.user?.name || 'Guest'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(b.checkIn)}</td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(b.checkOut)}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Users className="w-3.5 h-3.5" />
                          {b.guestsCount}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#0F172A]">{formatPrice(b.totalPrice)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
