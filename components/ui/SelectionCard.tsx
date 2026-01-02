'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type AccentColor = 'blue' | 'emerald' | 'amber' | 'rose';

interface SelectionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
  accentColor?: AccentColor;
}

const colorClasses: Record<AccentColor, {
  bg: string;
  border: string;
  ring: string;
  checkBg: string;
  iconBg: string;
  iconText: string;
  titleText: string;
}> = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    ring: 'ring-blue-500/30',
    checkBg: 'bg-blue-500',
    iconBg: 'bg-blue-500/20',
    iconText: 'text-blue-400',
    titleText: 'text-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500/30',
    checkBg: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/20',
    iconText: 'text-emerald-400',
    titleText: 'text-emerald-100',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500',
    ring: 'ring-amber-500/30',
    checkBg: 'bg-amber-500',
    iconBg: 'bg-amber-500/20',
    iconText: 'text-amber-400',
    titleText: 'text-amber-100',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500',
    ring: 'ring-rose-500/30',
    checkBg: 'bg-rose-500',
    iconBg: 'bg-rose-500/20',
    iconText: 'text-rose-400',
    titleText: 'text-rose-100',
  },
};

export function SelectionCard({
  title,
  description,
  icon,
  selected,
  onClick,
  className,
  accentColor = 'blue',
}: SelectionCardProps) {
  const colors = colorClasses[accentColor];

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative p-6 text-left rounded-lg border transition-all duration-300 w-full',
        selected
          ? `${colors.bg} ${colors.border} ring-1 ${colors.ring}`
          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {selected && (
        <motion.div
          className={cn('absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center', colors.checkBg)}
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
        selected ? `${colors.iconBg} ${colors.iconText}` : 'bg-slate-800 text-slate-400'
      )}>
        {icon}
      </div>

      <h3 className={cn(
        'font-serif text-lg font-medium mb-1 transition-colors duration-300',
        selected ? colors.titleText : 'text-slate-100'
      )}>
        {title}
      </h3>

      {description && (
        <p className={cn(
          'text-sm transition-colors duration-300',
          selected ? 'text-slate-300' : 'text-slate-400'
        )}>
          {description}
        </p>
      )}
    </motion.button>
  );
}
