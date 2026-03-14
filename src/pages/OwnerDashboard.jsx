import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, CalendarCheck, DollarSign, ArrowRight, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { propertyService } from '../services/propertyService';
import { bookingService } from '../services/bookingService';
import { Loader } from '../components/Loader';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

export function OwnerDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      propertyService.getOwnerProperties(),
      bookingService.getOwnerBookings(),
    ])
      .then(([propsRes, booksRes]) => {
        setProperties(propsRes.data || []);
        setBookings(booksRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const recentBookings = bookings.slice(0, 5);

  const stats = [
    { icon: Building2, label: 'Total Properties', value: properties.length, color: 'bg-blue-50 text-[#2563EB]', link: '/owner/properties' },
    { icon: CalendarCheck, label: 'Total Bookings', value: bookings.length, color: 'bg-emerald-50 text-emerald-600', link: '/owner/bookings' },
    { icon: DollarSign, label: 'Total Revenue', value: formatPrice(totalRevenue), color: 'bg-amber-50 text-[#F59E0B]', link: null },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Owner Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome, {user?.name?.split(' ')[0]}</p>
          </div>
          <Link
            to="/owner/properties/add"
            className="flex items-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {stats.map(({ icon: Icon, label, value, color, link }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {link ? (
                    <Link to={link} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 hover:border-[#2563EB] transition-colors block">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
                        <p className="text-xs text-slate-500">{label}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
                        <p className="text-xs text-slate-500">{label}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Bookings */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#0F172A]">Recent Bookings</h2>
                  <Link to="/owner/bookings" className="text-sm text-[#2563EB] font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {recentBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                    <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-600">No bookings yet</p>
                    <p className="text-sm text-slate-400 mt-1">Add your first property to get started</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Property</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Dates</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Total</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-3 font-medium text-[#0F172A] max-w-32 truncate">
                              {booking.property?.name || 'Property'}
                            </td>
                            <td className="px-5 py-3 text-slate-500 hidden sm:table-cell">
                              {formatDate(booking.checkIn)}
                            </td>
                            <td className="px-5 py-3 font-semibold text-[#0F172A]">
                              {formatPrice(booking.totalPrice)}
                            </td>
                            <td className="px-5 py-3">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* My Properties */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#0F172A]">My Properties</h2>
                  <Link to="/owner/properties" className="text-sm text-[#2563EB] font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {properties.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium text-slate-600 text-sm">No properties yet</p>
                    <Link
                      to="/owner/properties/add"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-[#2563EB] font-semibold hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Add first property
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {properties.slice(0, 4).map((prop) => (
                      <Link
                        key={prop._id}
                        to={`/property/${prop._id}`}
                        className="flex gap-3 bg-white rounded-xl border border-slate-100 p-3 hover:border-[#2563EB] transition-colors shadow-sm"
                      >
                        <img
                          src={prop.coverImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&q=80'}
                          alt={prop.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0F172A] truncate">{prop.name}</p>
                          <p className="text-xs text-slate-500">{formatPrice(prop.pricePerNight)}/night</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
