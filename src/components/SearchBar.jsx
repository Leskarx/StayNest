import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export function SearchBar({ compact = false, initialValues = {} }) {
  const navigate = useNavigate();
  const [city, setCity] = useState(initialValues.city || '');
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || '');
  const [guests, setGuests] = useState(initialValues.guests || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm"
      >
        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Where are you going?"
          className="flex-1 text-sm outline-none text-slate-700 placeholder:text-slate-400 min-w-0"
        />
        <button
          type="submit"
          className="bg-[#2563EB] text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
    >
      <div className="flex items-center gap-3 flex-1 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
        <MapPin className="w-5 h-5 text-[#2563EB] shrink-0" />
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-slate-500 mb-0.5">Location</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City, destination..."
            className="w-full text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
        <Calendar className="w-5 h-5 text-[#2563EB] shrink-0" />
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-0.5">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="text-sm text-slate-800 outline-none w-32"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
        <Calendar className="w-5 h-5 text-[#2563EB] shrink-0" />
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-0.5">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="text-sm text-slate-800 outline-none w-32"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 sm:border-r border-slate-100">
        <Users className="w-5 h-5 text-[#2563EB] shrink-0" />
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-0.5">Guests</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            placeholder="1"
            className="text-sm text-slate-800 outline-none w-16"
          />
        </div>
      </div>

      <div className="px-2">
        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2563EB] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  );
}
