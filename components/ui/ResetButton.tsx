'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useAuditStore } from '@/lib/store';

interface ResetButtonProps {
  variant?: 'icon' | 'text' | 'full';
  className?: string;
}

export function ResetButton({ variant = 'icon', className = '' }: ResetButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const reset = useAuditStore((state) => state.reset);
  const router = useRouter();

  const handleReset = () => {
    reset();
    setShowConfirm(false);
    router.push('/audit');
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setShowConfirm(true)}
        className={`
          flex items-center gap-2 rounded-lg transition-all font-medium
          ${variant === 'icon' 
            ? 'p-2 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10' 
            : variant === 'text'
            ? 'px-3 py-1.5 text-sm text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-400/50'
            : 'px-4 py-2 text-sm text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
          }
          ${className}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title="Recommencer un nouvel audit"
      >
        <RotateCcw className="w-4 h-4" />
        {variant !== 'icon' && <span>Nouvel Audit</span>}
      </motion.button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
              onClick={() => setShowConfirm(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]
                         w-full max-w-sm p-6 rounded-2xl
                         bg-slate-900 border border-slate-700 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setShowConfirm(false)}
                className="absolute top-4 right-4 p-1 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <RotateCcw className="w-8 h-8 text-amber-400" />
                </motion.div>

                <h3 className="text-xl font-serif font-bold text-slate-100 mb-2">
                  Réinitialiser l&apos;audit ?
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  Toutes vos données actuelles seront effacées et vous recommencerez à zéro.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                               text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <motion.button
                    onClick={handleReset}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                               text-slate-900 bg-amber-500 hover:bg-amber-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Confirmer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

