import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Menu, X, User, LogOut, LayoutDashboard, Building2, CalendarCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = user?.role === 'owner' ? '/owner/dashboard' : '/dashboard';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-[#0F172A] tracking-tight">
            Stay<span className="text-[#2563EB]">Nest</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/search"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
          >
            Explore
          </Link>
          {!user && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="ml-2 px-5 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
          {user && (
            <div className="relative ml-2">
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white"
              >
                <img
                  src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-1"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <Link
                      to={dashboardLink}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    {user.role === 'owner' && (
                      <Link
                        to="/owner/properties"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        My Properties
                      </Link>
                    )}
                    {user.role === 'user' && (
                      <Link
                        to="/bookings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <CalendarCheck className="w-4 h-4 text-slate-400" />
                        My Bookings
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile
                    </Link>
                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setMobileOpen((p) => !p)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <Link to="/search" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                Explore
              </Link>
              {!user ? (
                <>
                  <Link to="/login" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                    Sign In
                  </Link>
                  <Link to="/register" className="block px-4 py-2.5 text-sm font-semibold text-[#2563EB] hover:bg-blue-50 rounded-lg">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link to={dashboardLink} className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                    Profile
                  </Link>
                  {user.role === 'user' && (
                    <Link to="/bookings" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                      My Bookings
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
