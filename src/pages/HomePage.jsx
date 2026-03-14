import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Globe, HeartHandshake, Star, TrendingUp } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { SkeletonCard } from '../components/Loader';
import { propertyService } from '../services/propertyService';

const CATEGORIES = [
  { label: 'Beach', icon: '🏖', query: 'beach' },
  { label: 'Mountain', icon: '🏔', query: 'mountain' },
  { label: 'City', icon: '🏙', query: 'city' },
  { label: 'Countryside', icon: '🌿', query: 'countryside' },
  { label: 'Villa', icon: '🏛', query: 'villa' },
  { label: 'Cabin', icon: '🪵', query: 'cabin' },
  { label: 'Luxury', icon: '✨', query: 'luxury' },
  { label: 'Apartment', icon: '🏢', query: 'apartment' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Verified Listings',
    desc: 'Every property is verified by our team before listing.',
  },
  {
    icon: Globe,
    title: 'Global Destinations',
    desc: 'Discover unique stays in 100+ countries worldwide.',
  },
  {
    icon: HeartHandshake,
    title: '24/7 Support',
    desc: 'Dedicated support to assist you before, during and after.',
  },
];

export function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService
      .getProperties({ limit: 8 })
      .then((res) => setFeatured(res.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&q=85"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-[#0F172A]/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] text-xs font-semibold px-3 py-1 rounded-full">
                #1 Property Rental Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Find Your
              <span className="text-[#F59E0B]"> Perfect</span>
              <br />
              Place to Stay
            </h1>
            <p className="text-lg text-white/75 mb-10 max-w-lg leading-relaxed">
              Discover unique homes, villas, and apartments for unforgettable experiences around the world.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl"
          >
            <SearchBar />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-6 mt-8 text-white/70 text-sm"
          >
            {['50,000+ Properties', '200+ Destinations', '4.9★ Average Rating'].map((stat) => (
              <div key={stat} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
                <span>{stat}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Explore by Category</h2>
          <p className="text-slate-500 mb-6 text-sm">Find the type of stay that suits you</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/search?type=${cat.query}`}
                  className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-100 rounded-2xl hover:border-[#2563EB] hover:bg-blue-50/50 hover:shadow-sm transition-all group"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-[#2563EB]">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Featured Stays</h2>
            <p className="text-slate-500 text-sm mt-1">Top-rated properties handpicked for you</p>
          </div>
          <Link
            to="/search"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-blue-700 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No properties available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((prop, i) => (
              <PropertyCard key={prop._id} property={prop} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white border-t border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Why Choose StayNest?</h2>
            <p className="text-slate-500 text-sm">Built for travelers who expect the best</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F59E0B]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="relative">
            <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
              For Property Owners
            </span>
            <h2 className="text-3xl font-bold text-white mb-3">List Your Property Today</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Join thousands of hosts and start earning. Set your own price, manage bookings, and grow your rental income.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Hosting
              </Link>
              <Link
                to="/search"
                className="px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Browse Stays
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
