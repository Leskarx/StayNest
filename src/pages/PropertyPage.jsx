import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Wifi, Waves, UtensilsCrossed, Car, Dumbbell,
  Wind, Tv, Users, Bed, Bath, Home, Share2
} from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { PropertyGallery } from '../components/PropertyGallery';
import { BookingCard } from '../components/BookingCard';
import { ReviewCard } from '../components/ReviewCard';
import { Loader } from '../components/Loader';

const AMENITY_ICONS = {
  wifi: Wifi,
  pool: Waves,
  kitchen: UtensilsCrossed,
  parking: Car,
  gym: Dumbbell,
  ac: Wind,
  tv: Tv,
};

export function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    propertyService
      .getProperty(id)
      .then((res) => {
        setProperty(res.data);
        setReviews(res.data?.reviews || []);
      })
      .catch(() => setError('Property not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-24"><Loader /></div>;
  if (error || !property) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-semibold text-slate-600">Property not found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2">{property.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              {property.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                  <strong className="text-[#0F172A]">{property.rating.toFixed(1)}</strong>
                  {property.numReviews > 0 && <span>({property.numReviews} reviews)</span>}
                </span>
              )}
              {property.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {[property.location.city, property.location.state, property.location.country]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              )}
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#2563EB] border border-slate-200 px-4 py-2 rounded-xl hover:border-[#2563EB] transition-colors shrink-0">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Gallery */}
        <div className="mb-8">
          <PropertyGallery
            images={property.images || []}
            coverImage={property.coverImage}
            name={property.name}
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick stats */}
            <div className="flex flex-wrap gap-5">
              <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                <Users className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <p className="text-xs text-slate-400">Guests</p>
                  <p className="text-sm font-semibold text-[#0F172A]">{property.maxGuests}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                <Bed className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <p className="text-xs text-slate-400">Bedrooms</p>
                  <p className="text-sm font-semibold text-[#0F172A]">{property.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                <Bath className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <p className="text-xs text-slate-400">Bathrooms</p>
                  <p className="text-sm font-semibold text-[#0F172A]">{property.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                <Home className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <p className="text-xs text-slate-400">Type</p>
                  <p className="text-sm font-semibold text-[#0F172A] capitalize">{property.propertyType}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-[#0F172A] mb-3">About this place</h2>
                <p className="text-slate-600 leading-relaxed text-sm">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-[#0F172A] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => {
                    const Icon = AMENITY_ICONS[amenity.toLowerCase()] || Home;
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Icon className="w-4 h-4 text-[#2563EB] shrink-0" />
                        <span className="text-sm text-slate-600 capitalize">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            {property.location && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-bold text-[#0F172A] mb-3">Location</h2>
                <div className="flex items-center gap-2 text-slate-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-[#2563EB]" />
                  <span>
                    {[
                      property.location.address,
                      property.location.city,
                      property.location.state,
                      property.location.country,
                      property.location.postalCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
                <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-[#2563EB]" />
                    <p className="text-sm font-medium text-slate-500">
                      {property.location.city}, {property.location.country}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-bold text-[#0F172A]">Reviews</h2>
                {property.rating > 0 && (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                    <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                    <span className="text-sm font-bold text-[#0F172A]">{property.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              {reviews.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <div>
            <BookingCard property={property} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
