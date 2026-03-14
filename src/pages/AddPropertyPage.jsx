import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, DollarSign, Users, Bed, Bath, Tag, Save } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { useToast } from '../context/ToastContext';
import { ImageUploader } from '../components/ImageUploader';

const PROPERTY_TYPES = [
  'apartment',
  'house',
  'villa',
  'cabin',
  'condo',
  'studio',
  'hotel',
  'other'
];

const ALL_AMENITIES = [
  'wifi',
  'pool',
  'kitchen',
  'parking',
  'gym',
  'ac',
  'tv',
  'washer',
  'balcony',
  'fireplace',
  'bbq',
  'beach access'
];

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all';

export function AddPropertyPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    propertyType: 'apartment',
    pricePerNight: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value
    }));

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverFile) {
      toast.error('Please upload a cover image.');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('propertyType', form.propertyType);
      fd.append('pricePerNight', form.pricePerNight);
      fd.append('maxGuests', form.maxGuests);
      fd.append('bedrooms', form.bedrooms);

      // beds same as bedrooms
      fd.append('beds', form.bedrooms);

      fd.append('bathrooms', form.bathrooms);

      // location
      fd.append('location[address]', form.address);
      fd.append('location[city]', form.city);
      fd.append('location[state]', form.state);
      fd.append('location[country]', form.country);
      fd.append('location[postalCode]', form.postalCode);

      // amenities
      selectedAmenities.forEach((a) => fd.append('amenities', a));

      // cover image
      fd.append('coverImage', coverFile);

      // additional images
      imageFiles.forEach((file) => {
        fd.append('images', file);
      });

      await propertyService.createProperty(fd);

      toast.success('Property listed successfully!');
      navigate('/owner/properties');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to create property.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8FAFC] pt-20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
          List a Property
        </h1>

        <p className="text-slate-500 text-sm mb-8">
          Fill in the details to list your property on StayNest
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Home className="w-5 h-5 text-[#2563EB]" />
              Basic Information
            </h2>

            <Field label="Property Name" icon={Home}>
              <input
                required
                value={form.name}
                onChange={set('name')}
                placeholder="Cozy Beachfront Villa"
                className={inputCls}
              />
            </Field>

            <Field label="Description">
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={set('description')}
                placeholder="Describe your property..."
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Property Type" icon={Tag}>
                <select
                  value={form.propertyType}
                  onChange={set('propertyType')}
                  className={`${inputCls} bg-white`}
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Price per Night" icon={DollarSign}>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.pricePerNight}
                  onChange={set('pricePerNight')}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Max Guests" icon={Users}>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.maxGuests}
                  onChange={set('maxGuests')}
                  className={inputCls}
                />
              </Field>

              <Field label="Bedrooms" icon={Bed}>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.bedrooms}
                  onChange={set('bedrooms')}
                  className={inputCls}
                />
              </Field>

              <Field label="Bathrooms" icon={Bath}>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.bathrooms}
                  onChange={set('bathrooms')}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2563EB]" />
              Location
            </h2>

            <Field label="Address">
              <input
                value={form.address}
                onChange={set('address')}
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <input
                  required
                  value={form.city}
                  onChange={set('city')}
                  className={inputCls}
                />
              </Field>

              <Field label="State">
                <input
                  value={form.state}
                  onChange={set('state')}
                  className={inputCls}
                />
              </Field>

              <Field label="Country">
                <input
                  required
                  value={form.country}
                  onChange={set('country')}
                  className={inputCls}
                />
              </Field>

              <Field label="Postal Code">
                <input
                  value={form.postalCode}
                  onChange={set('postalCode')}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-base font-bold text-[#0F172A] mb-4">
              Amenities
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {ALL_AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`py-2 px-3 rounded-xl text-sm border ${
                    selectedAmenities.includes(amenity)
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'border-slate-200'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
            <h2 className="text-base font-bold text-[#0F172A]">Photos</h2>

            <ImageUploader
              label="Cover Image (required)"
              multiple={false}
              onFilesChange={(files) => setCoverFile(files[0] || null)}
            />

            <ImageUploader
              label="Additional Images"
              multiple
              maxFiles={8}
              onFilesChange={setImageFiles}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-3 rounded-xl"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Listing...' : 'List Property'}
            </button>
          </div>

        </form>
      </div>
    </motion.div>
  );
}