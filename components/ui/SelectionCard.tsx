'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function SelectionCard({
  title,
  description,
  icon,
  selected,
  onClick,
  className,
}: SelectionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative p-6 text-left rounded-lg border transition-all duration-300 w-full',
        selected
          ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/30'
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}

      <div className={cn(
        'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300',
        selected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'
      )}>
        {icon}
      </div>

      <h3 className={cn(
        'font-serif text-lg font-medium mb-1 transition-colors duration-300',
        selected ? 'text-blue-100' : 'text-slate-100'
      )}>
        {title}
      </h3>

      {description && (
        <p className="text-sm text-slate-400">
          {description}
        </p>
      )}
    </motion.button>
  );
}

