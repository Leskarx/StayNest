import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react";

export function PropertyGallery({ images = [], coverImage, name }) {
  const allImages = coverImage
    ? [coverImage, ...images.filter((img) => img.url !== coverImage?.url)]
    : images;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const openLightbox = (idx) => {
    setCurrentIdx(idx);
    setLightboxOpen(true);
  };

  const prev = () =>
    setCurrentIdx((i) => (i - 1 + allImages.length) % allImages.length);

  const next = () =>
    setCurrentIdx((i) => (i + 1) % allImages.length);

  const handleKey = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  const preview = allImages.slice(0, 5);

  // Function to get border radius classes based on position
  const getBorderRadiusClass = (idx) => {
    if (idx === 0) return "rounded-tl-2xl rounded-bl-2xl";
    if (idx === 1) return "rounded-tr-2xl";
    if (idx === 3) return "rounded-br-2xl";
    return "";
  };

  return (
    <>
      {/* Gallery */}
      <div className="relative grid grid-cols-4 grid-rows-2 h-80 sm:h-[420px] gap-0">
        {preview.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className={`relative cursor-pointer group overflow-hidden ${getBorderRadiusClass(idx)} ${
              idx === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={img.url || img}
              alt={`${name}-${idx}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}

        {allImages.length > 5 && (
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-[#0F172A] text-sm font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-slate-50 transition-colors border border-slate-200 z-10"
          >
            <Grid3x3 className="w-4 h-4" />
            Show all {allImages.length} photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            tabIndex={0}
            autoFocus
            onKeyDown={handleKey}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={prev}
              className="absolute left-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.img
              key={currentIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={allImages[currentIdx]?.url || allImages[currentIdx]}
              alt={`${name}-${currentIdx}`}
              className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
            />

            <button
              onClick={next}
              className="absolute right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentIdx ? "bg-white w-6" : "bg-white/40 w-2"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}