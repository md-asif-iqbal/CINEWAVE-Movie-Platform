'use client';
import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrialBanner({ daysRemaining }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !daysRemaining || daysRemaining > 7) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-cw-red text-white text-center text-sm py-2 px-4 relative z-30"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span>
            Your free trial ends in {daysRemaining} days
          </span>
          <Link
            href="/subscribe"
            className="underline font-semibold hover:no-underline"
          >
            Subscribe Now
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[32px] min-h-[32px] flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
