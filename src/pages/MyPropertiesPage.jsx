import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Building2, Star, MapPin } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/Loader';
import { formatPrice } from '../utils/formatters';

export function MyPropertiesPage() {
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    propertyService
      .getOwnerProperties()
      .then((res) => setProperties(res.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await propertyService.deleteProperty(id);
      setProperties((p) => p.filter((prop) => prop._id !== id));
      toast.success('Property deleted successfully.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete property.');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">My Properties</h1>
            <p className="text-slate-500 text-sm mt-1">{properties.length} properties listed</p>
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
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg font-semibold text-slate-600">No properties yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-6">List your first property and start earning</p>
            <Link
              to="/owner/properties/add"
              className="inline-flex items-center gap-2 bg-[#2563EB] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              List a Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {properties.map((prop, i) => (
                <motion.div
                  key={prop._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={prop.coverImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-xs font-semibold text-[#1E293B] px-2.5 py-1 rounded-full capitalize">
                        {prop.propertyType}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-[#0F172A] mb-1 line-clamp-1">{prop.name}</h3>
                    {prop.location && (
                      <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{prop.location.city}, {prop.location.country}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-base font-bold text-[#0F172A]">{formatPrice(prop.pricePerNight)}<span className="text-xs font-normal text-slate-500">/night</span></span>
                      {prop.rating > 0 && (
                        <span className="flex items-center gap-1 text-xs text-slate-600">
                          <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                          {prop.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/owner/properties/edit/${prop._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 py-2 rounded-xl transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(prop._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 py-2 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Delete Property?</h3>
              <p className="text-sm text-slate-500 mb-6">
                This action is permanent and will remove all associated data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
