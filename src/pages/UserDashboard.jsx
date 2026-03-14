import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck, Heart, Star, ArrowRight, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { Loader } from '../components/Loader';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

export function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService
      .getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const recentBookings = bookings.slice(0, 3);
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const upcoming = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length;

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
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here is your travel summary</p>
          </div>
          <Link
            to="/search"
            className="hidden sm:flex items-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Find a Stay
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: CalendarCheck, label: 'Total Bookings', value: bookings.length, color: 'bg-blue-50 text-[#2563EB]' },
            { icon: Star, label: 'Confirmed', value: confirmed, color: 'bg-emerald-50 text-emerald-600' },
            { icon: Heart, label: 'Upcoming', value: upcoming, color: 'bg-amber-50 text-[#F59E0B]' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">Recent Bookings</h2>
              <Link to="/bookings" className="text-sm text-[#2563EB] font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <Loader />
            ) : recentBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="font-medium text-slate-600">No bookings yet</p>
                <p className="text-sm text-slate-400 mt-1 mb-5">Start exploring amazing properties</p>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Find a Stay
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 shadow-sm"
                  >
                    <img
                      src={booking.property?.coverImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=120&q=80'}
                      alt={booking.property?.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">
                          {booking.property?.name || 'Property'}
                        </p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}</span>
                      </div>
                      <p className="text-sm font-bold text-[#2563EB] mt-1">{formatPrice(booking.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Your Profile</h2>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex flex-col items-center text-center mb-5">
                <img
                  src={
                    user?.profileImage?.url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=2563EB&color=fff&size=80`
                  }
                  alt={user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 mb-3"
                />
                <p className="font-bold text-[#0F172A]">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-slate-500">Email</span>
                  <span className="text-[#0F172A] font-medium truncate max-w-32">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-slate-500">Phone</span>
                  <span className="text-[#0F172A] font-medium">{user?.phoneNumber || 'Not set'}</span>
                </div>
              </div>
              <Link
                to="/profile"
                className="mt-5 block text-center text-sm font-semibold text-[#2563EB] bg-blue-50 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
