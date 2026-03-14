import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Home, MapPin, DollarSign, Users, Bed, Bath, Tag } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { useToast } from '../context/ToastContext';
import { Loader } from '../components/Loader';

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'cabin', 'condo', 'studio', 'hotel', 'other'];
const ALL_AMENITIES = ['wifi', 'pool', 'kitchen', 'parking', 'gym', 'ac', 'tv', 'washer', 'balcony', 'fireplace', 'bbq', 'beach access'];

const inputCls = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all';

export function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    propertyType: 'apartment',
    pricePerNight: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    address: '',
  });

  useEffect(() => {
    propertyService
      .getProperty(id)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          propertyType: p.propertyType || 'apartment',
          pricePerNight: p.pricePerNight || '',
          maxGuests: p.maxGuests || '',
          bedrooms: p.bedrooms || '',
          bathrooms: p.bathrooms || '',
          city: p.location?.city || '',
          state: p.location?.state || '',
          country: p.location?.country || '',
          postalCode: p.location?.postalCode || '',
          address: p.location?.address || '',
        });
        setSelectedAmenities(p.amenities || []);
      })
      .catch(() => toast.error('Failed to load property.'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleAmenity = (a) =>
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      selectedAmenities.forEach((a) => fd.append('amenities', a));

      await propertyService.updateProperty(id, fd);
      toast.success('Property updated successfully!');
      navigate('/owner/properties');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update property.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pt-24"><Loader /></div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pt-20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Edit Property</h1>
        <p className="text-slate-500 text-sm mb-8">Update your property details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Home className="w-5 h-5 text-[#2563EB]" /> Basic Information
            </h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Property Name</label>
              <input required value={form.name} onChange={set('name')} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
              <textarea required value={form.description} onChange={set('description')} rows={4} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-slate-400" /> Type</label>
                <select required value={form.propertyType} onChange={set('propertyType')} className={`${inputCls} bg-white capitalize`}>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-slate-400" /> Price/Night</label>
                <input type="number" required min="1" value={form.pricePerNight} onChange={set('pricePerNight')} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Guests</label>
                <input type="number" min="1" value={form.maxGuests} onChange={set('maxGuests')} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Beds</label>
                <input type="number" min="0" value={form.bedrooms} onChange={set('bedrooms')} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Baths</label>
                <input type="number" min="0" value={form.bathrooms} onChange={set('bathrooms')} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2563EB]" /> Location
            </h2>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
              <input value={form.address} onChange={set('address')} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                <input value={form.city} onChange={set('city')} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                <input value={form.state} onChange={set('state')} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Country</label>
                <input value={form.country} onChange={set('country')} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Postal Code</label>
                <input value={form.postalCode} onChange={set('postalCode')} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-[#0F172A] mb-4">Amenities</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ALL_AMENITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium capitalize transition-all border ${
                    selectedAmenities.includes(a)
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-[#2563EB]'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
