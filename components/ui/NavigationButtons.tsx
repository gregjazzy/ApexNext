'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  showPrev?: boolean;
  showNext?: boolean;
  nextVariant?: 'primary' | 'success';
}

export function NavigationButtons({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  prevDisabled = false,
  nextDisabled = false,
  showPrev = true,
  showNext = true,
  nextVariant = 'primary',
}: NavigationButtonsProps) {
  const t = useTranslations('common');
  
  const finalPrevLabel = prevLabel || t('back');
  const finalNextLabel = nextLabel || t('continue');

  return (
    <div className="flex items-center justify-between pt-8 border-t border-slate-800">
      {showPrev ? (
        <motion.button
          onClick={onPrev}
          disabled={prevDisabled}
          className="apex-button-outline flex items-center gap-2"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-4 h-4" />
          {finalPrevLabel}
        </motion.button>
      ) : (
        <div />
      )}

      {showNext && (
        <motion.button
          onClick={onNext}
          disabled={nextDisabled}
          className={cn(
            'flex items-center gap-2',
            nextVariant === 'primary' && 'apex-button',
            nextVariant === 'success' && 
              'px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {finalNextLabel}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
}
