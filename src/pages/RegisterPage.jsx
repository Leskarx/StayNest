import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phoneNumber: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to StayNest, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'owner' ? '/owner/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#1E293B] to-[#0F172A] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#2563EB]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#F59E0B]/10 rounded-full blur-2xl" />
        <div className="relative text-center">
          <Link to="/" className="flex items-center gap-2 justify-center mb-10">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Stay<span className="text-[#F59E0B]">Nest</span></span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Join Thousands of<br />Happy Travelers
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Create an account as a traveler to book amazing stays, or as an owner to list and manage your properties.
          </p>
          <div className="mt-8 space-y-3">
            {['Free to join, no hidden fees', 'Instant booking confirmation', '24/7 customer support', 'Secure payments'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-left">
                <div className="w-5 h-5 bg-[#F59E0B] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0F172A]">Stay<span className="text-[#2563EB]">Nest</span></span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2563EB] font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {/* Role toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {[{ val: 'user', label: 'Traveler' }, { val: 'owner', label: 'Property Owner' }].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: val }))}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  form.role === val
                    ? 'bg-white text-[#2563EB] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                required
                value={form.name}
                onChange={set('name')}
                placeholder="John Smith"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                placeholder="john@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={set('phoneNumber')}
                placeholder="+1234567890"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Minimum 6 characters"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-[#2563EB] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#2563EB] hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
