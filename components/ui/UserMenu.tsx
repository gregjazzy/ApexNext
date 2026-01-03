'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, ChevronDown, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuditStore } from '@/lib/store';

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations('auth');
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const reset = useAuditStore((state) => state.reset);
  const router = useRouter();

  const handleReset = () => {
    reset();
    setShowResetConfirm(false);
    setIsOpen(false);
    router.push('/audit');
  };

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() || 'U';

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-medium">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline text-sm max-w-[100px] truncate">
          {user.name || user.email}
        </span>
        <ChevronDown className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-700 bg-slate-800 shadow-xl z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user.name || 'Utilisateur'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Paramètres
                </button>
                
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Nouvel Audit
                </button>
                
                <div className="border-t border-slate-700 my-1" />
                
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('signOut')}
                </button>
              </div>

              {/* Reset Confirmation */}
              {showResetConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-4 rounded-lg"
                >
                  <RotateCcw className="w-8 h-8 text-amber-400 mb-3" />
                  <p className="text-sm text-slate-200 text-center mb-4">
                    Réinitialiser l&apos;audit ?<br />
                    <span className="text-slate-400 text-xs">
                      Toutes les données seront effacées.
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-3 py-1.5 text-xs bg-amber-500 text-slate-900 rounded-md hover:bg-amber-400 transition-colors font-medium"
                    >
                      Confirmer
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

