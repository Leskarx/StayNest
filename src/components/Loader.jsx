import React from 'react';
import { motion } from 'framer-motion';

export function Loader({ fullscreen = false, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <motion.div
      className={`${sizes[size]} rounded-full border-2 border-slate-200 border-t-[#2563EB]`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-12">{spinner}</div>;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>
        <div className="h-4 bg-slate-200 rounded w-1/3" />
      </div>
    </div>
  );
}
