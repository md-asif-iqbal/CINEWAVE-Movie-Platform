'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modal({ isOpen, onClose, title, children, className, fullScreenMobile = true }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative z-10 bg-cw-bg-secondary border border-cw-border rounded-lg overflow-hidden',
              fullScreenMobile
                ? 'w-full h-full md:w-auto md:h-auto md:max-w-lg md:max-h-[90vh] md:rounded-lg'
                : 'w-full max-w-lg max-h-[90vh] mx-4',
              className
            )}
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-cw-border">
                <h2 className="text-lg font-heading font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X size={20} className="text-cw-text-secondary" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto max-h-[calc(100vh-80px)] md:max-h-[calc(90vh-60px)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
