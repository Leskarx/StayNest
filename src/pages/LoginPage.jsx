import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Home, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'owner' ? '/owner/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials. Please try again.');
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
            Your Dream Stay<br />Awaits You
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Sign in to manage bookings, discover new properties, and unlock exclusive deals.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['50K+', 'Properties'], ['200+', 'Cities'], ['4.9★', 'Rating']].map(([val, label]) => (
              <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xl font-bold text-white">{val}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
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

          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-8">
            New to StayNest?{' '}
            <Link to="/register" className="text-[#2563EB] font-semibold hover:underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs text-[#2563EB] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
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
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
