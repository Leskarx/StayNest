import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1E293B] text-slate-300 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Stay<span className="text-[#F59E0B]">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find your perfect stay anywhere in the world. Book unique homes and experiences.
            </p>
            <div className="flex gap-3 mt-5">
              {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-[#2563EB] flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              {['Search Properties', 'Popular Destinations', 'New Listings', 'Luxury Stays'].map((item) => (
                <li key={item}>
                  <Link to="/search" className="hover:text-[#F59E0B] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Host</h4>
            <ul className="space-y-2 text-sm">
              {['List Your Property', 'Owner Dashboard', 'Manage Bookings', 'Pricing'].map((item) => (
                <li key={item}>
                  <Link to="/register" className="hover:text-[#F59E0B] transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              {['Help Center', 'Cancellation Policy', 'Safety', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#F59E0B] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; 2026 StayNest. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
