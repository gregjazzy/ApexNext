'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { locales, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: Locale) => {
    startTransition(() => {
      // Set cookie and reload
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
      window.location.reload();
    });
    setIsOpen(false);
  };

  const localeNames: Record<Locale, string> = {
    fr: 'Français',
    en: 'English',
  };

  const localeFlags: Record<Locale, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4" />
        <span>{localeFlags[locale as Locale]}</span>
        <span className="hidden sm:inline">{localeNames[locale as Locale]}</span>
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
              className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-700 bg-slate-800 shadow-xl z-50 overflow-hidden"
            >
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  disabled={isPending}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    locale === loc
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{localeFlags[loc]}</span>
                  <span className="flex-1">{localeNames[loc]}</span>
                  {locale === loc && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

