'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg shadow-xl border',
                toast.type === 'success' && 'bg-green-900/90 border-green-700',
                toast.type === 'error' && 'bg-red-900/90 border-red-700',
                toast.type === 'info' && 'bg-cw-bg-secondary border-cw-border'
              )}
            >
              {toast.type === 'success' && <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />}
              <p className="text-sm text-white flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-cw-text-secondary hover:text-white transition-colors min-w-[24px] min-h-[24px]"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export default function Toast() {
  return null;
}
