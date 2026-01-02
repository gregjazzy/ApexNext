'use client';

import * as Slider from '@radix-ui/react-slider';
import { motion } from 'framer-motion';
import { cn, getResilienceColor } from '@/lib/utils';

interface ResilienceSliderProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
}

export function ResilienceSlider({
  label,
  description,
  value,
  onChange,
  icon,
}: ResilienceSliderProps) {
  const color = getResilienceColor(value);
  
  const colorClasses = {
    emerald: {
      track: 'bg-emerald-500',
      thumb: 'border-emerald-500 hover:border-emerald-400',
      glow: 'shadow-emerald-500/30',
      text: 'text-emerald-400',
    },
    amber: {
      track: 'bg-amber-500',
      thumb: 'border-amber-500 hover:border-amber-400',
      glow: 'shadow-amber-500/30',
      text: 'text-amber-400',
    },
    rose: {
      track: 'bg-rose-500',
      thumb: 'border-rose-500 hover:border-rose-400',
      glow: 'shadow-rose-500/30',
      text: 'text-rose-400',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <div>
            <span className="text-sm font-medium text-slate-200">{label}</span>
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
        </div>
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn('text-sm font-semibold tabular-nums', classes.text)}
        >
          {value}%
        </motion.span>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        max={100}
        step={5}
      >
        <Slider.Track className="bg-slate-800 relative grow rounded-full h-2">
          <Slider.Range
            className={cn(
              'absolute rounded-full h-full transition-colors duration-200',
              classes.track
            )}
          />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            'block w-5 h-5 bg-slate-900 rounded-full border-2 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
            'hover:scale-110',
            classes.thumb,
            classes.glow
          )}
        />
      </Slider.Root>
    </div>
  );
}

