import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Bed, Bath } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export function PropertyCard({ property, index = 0 }) {
  const {
    _id,
    name,
    propertyType,
    location,
    pricePerNight,
    maxGuests,
    bedrooms,
    bathrooms,
    rating,
    numReviews,
    coverImage,
  } = property;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/property/${_id}`} className="block group">
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={coverImage?.url || `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80`}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#1E293B] px-2.5 py-1 rounded-full capitalize">
                {propertyType}
              </span>
            </div>
            {rating >= 4.8 && (
              <div className="absolute top-3 right-3">
                <span className="bg-[#F59E0B] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Top Rated
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold text-[#0F172A] leading-snug line-clamp-2 flex-1 group-hover:text-[#2563EB] transition-colors">
                {name}
              </h3>
              {rating && (
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-xs font-semibold text-slate-700">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {location && (
              <div className="flex items-center gap-1 text-slate-500 mb-3">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs truncate">
                  {location.city}{location.state ? `, ${location.state}` : ''}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {maxGuests} guests
              </span>
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5" />
                {bedrooms} bed
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" />
                {bathrooms} bath
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-base font-bold text-[#0F172A]">{formatPrice(pricePerNight)}</span>
                <span className="text-xs text-slate-500"> / night</span>
              </div>
              {numReviews > 0 && (
                <span className="text-xs text-slate-400">{numReviews} reviews</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
