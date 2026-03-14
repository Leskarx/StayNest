import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageUploader({ label = 'Upload Images', multiple = false, onFilesChange, maxFiles = 8 }) {
  const [previews, setPreviews] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const processFiles = useCallback(
    (files) => {
      const accepted = Array.from(files).filter((f) => f.type.startsWith('image/'));
      const limited = multiple ? accepted.slice(0, maxFiles - previews.length) : [accepted[0]];

      const newPreviews = limited.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
      }));

      const next = multiple ? [...previews, ...newPreviews] : newPreviews;
      setPreviews(next);
      onFilesChange && onFilesChange(next.map((p) => p.file));
    },
    [previews, multiple, maxFiles, onFilesChange]
  );

  const removePreview = (idx) => {
    const next = previews.filter((_, i) => i !== idx);
    setPreviews(next);
    onFilesChange && onFilesChange(next.map((p) => p.file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-[#2563EB] bg-blue-50'
            : 'border-slate-300 hover:border-[#2563EB] hover:bg-blue-50/30'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => processFiles(e.target.files)}
          className="hidden"
        />
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600">
          Drop images here or <span className="text-[#2563EB]">browse</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB{multiple ? ` (max ${maxFiles})` : ''}</p>
      </div>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
          <AnimatePresence>
            {previews.map((p, idx) => (
              <motion.div
                key={p.url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200"
              >
                <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePreview(idx); }}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
