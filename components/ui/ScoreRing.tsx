'use client';

import { motion } from 'framer-motion';
import { cn, getResilienceColor } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showLabel?: boolean;
}

type ColorKey = 'emerald' | 'amber' | 'rose';

export function ScoreRing({ score, size = 'md', label, showLabel = true }: ScoreRingProps) {
  const color = getResilienceColor(score) as ColorKey;
  
  const sizes = {
    sm: { ring: 80, stroke: 6, text: 'text-lg', label: 'text-xs' },
    md: { ring: 120, stroke: 8, text: 'text-3xl', label: 'text-sm' },
    lg: { ring: 180, stroke: 10, text: 'text-5xl', label: 'text-base' },
  };
  
  const s = sizes[size];
  const radius = (s.ring - s.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const colorClasses = {
    emerald: 'stroke-emerald-500',
    amber: 'stroke-amber-500',
    rose: 'stroke-rose-500',
  };

  const textColorClasses = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={s.ring}
        height={s.ring}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={s.ring / 2}
          cy={s.ring / 2}
          r={radius}
          strokeWidth={s.stroke}
          fill="none"
          className="stroke-slate-800"
        />
        
        {/* Progress ring */}
        <motion.circle
          cx={s.ring / 2}
          cy={s.ring / 2}
          r={radius}
          strokeWidth={s.stroke}
          fill="none"
          strokeLinecap="round"
          className={cn(colorClasses[color])}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn('font-bold tabular-nums', s.text, textColorClasses[color])}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {score}
        </motion.span>
        {showLabel && label && (
          <span className={cn('text-slate-400', s.label)}>{label}</span>
        )}
      </div>
    </div>
  );
}

