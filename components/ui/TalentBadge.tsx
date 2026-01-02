'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TalentBadgeProps {
  name: string;
  category: string;
  level: number;
  selected: boolean;
  onSelect: () => void;
  onLevelChange: (level: number) => void;
  disabled?: boolean;
}

export function TalentBadge({
  name,
  category,
  level,
  selected,
  onSelect,
  onLevelChange,
  disabled,
}: TalentBadgeProps) {
  return (
    <motion.div
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-300',
        selected
          ? 'bg-blue-500/10 border-blue-500'
          : disabled
          ? 'bg-slate-900/20 border-slate-800 opacity-50 cursor-not-allowed'
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 cursor-pointer'
      )}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={() => !disabled && onSelect()}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-wider">
            {category}
          </span>
          <h4 className={cn(
            'font-medium',
            selected ? 'text-blue-100' : 'text-slate-200'
          )}>
            {name}
          </h4>
        </div>
        
        {selected && (
          <motion.div
            className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 pt-3 border-t border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-xs text-slate-400 mb-2 block">Niveau de maîtrise</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={(e) => {
                  e.stopPropagation();
                  onLevelChange(star);
                }}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={cn(
                    'w-5 h-5 transition-colors',
                    star <= level
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  )}
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

