import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <AlertCircle className="w-5 h-5 text-blue-400" />,
  };

  const borderColors = {
    success: 'border-l-emerald-400',
    error: 'border-l-red-400',
    info: 'border-l-blue-400',
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3 bg-[#1E293B] text-white px-4 py-3 rounded-xl shadow-2xl border-l-4 ${borderColors[t.type]} min-w-[280px] max-w-[380px]`}
            >
              {icons[t.type]}
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
