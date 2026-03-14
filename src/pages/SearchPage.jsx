import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, MapPin } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { SkeletonCard } from '../components/Loader';
import { propertyService } from '../services/propertyService';

const PROPERTY_TYPES = ['villa', 'apartment', 'house', 'cabin', 'condo', 'studio', 'hotel'];

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: searchParams.get('type') || '',
    minBedrooms: '',
    minGuests: searchParams.get('guests') || '',
    sortBy: 'rating',
  });

  const city = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  useEffect(() => {
    setLoading(true);
    const params = {
      page: 1,
      limit: 12,
      ...(city && { city }),
      ...(filters.propertyType && { propertyType: filters.propertyType }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.minBedrooms && { minBedrooms: filters.minBedrooms }),
      ...(filters.minGuests && { minGuests: filters.minGuests }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
    };
    propertyService
      .getProperties(params)
      .then((res) => {
        setProperties(res.data || []);
        setTotal(res.count || 0);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [city, JSON.stringify(filters)]);

  const clearFilter = (key) => setFilters((f) => ({ ...f, [key]: '' }));

  const activeFilters = Object.entries(filters).filter(([, v]) => v !== '' && v !== 'rating');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20">
      {/* Search top bar */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto">
          <SearchBar compact initialValues={{ city, checkIn, checkOut }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              {city ? (
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2563EB]" />
                  Stays in {city}
                </span>
              ) : (
                'All Properties'
              )}
            </h1>
            {!loading && (
              <p className="text-sm text-slate-500 mt-0.5">{total} properties found</p>
            )}
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${
              showFilters
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[#2563EB]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters.length > 0 && (
              <span className="bg-white/30 text-xs rounded-full px-1.5">{activeFilters.length}</span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 mb-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Max Price</label>
                <input
                  type="number"
                  placeholder="$9999"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters((f) => ({ ...f, propertyType: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2563EB] bg-white capitalize"
                >
                  <option value="">Any</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t} className="capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Min Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Any"
                  value={filters.minBedrooms}
                  onChange={(e) => setFilters((f) => ({ ...f, minBedrooms: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Min Guests</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Any"
                  value={filters.minGuests}
                  onChange={(e) => setFilters((f) => ({ ...f, minGuests: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2563EB] bg-white"
                >
                  <option value="rating">Top Rated</option>
                  <option value="pricePerNight">Price: Low to High</option>
                  <option value="-pricePerNight">Price: High to Low</option>
                  <option value="-createdAt">Newest</option>
                </select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                {activeFilters.map(([key, val]) => (
                  <span
                    key={key}
                    className="flex items-center gap-1 bg-blue-50 text-[#2563EB] text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {key}: {val}
                    <button onClick={() => clearFilter(key)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-600">No properties found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((prop, i) => (
              <PropertyCard key={prop._id} property={prop} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
