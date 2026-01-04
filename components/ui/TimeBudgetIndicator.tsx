'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Timer, AlertTriangle, CheckCircle, Info, Calendar, CalendarDays, CalendarClock, Target } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Task, Temporality } from '@/lib/store';
import { cn } from '@/lib/utils';

interface TimeBudgetIndicatorProps {
  tasks: Task[];
  targetHours?: number; // Heures cibles par semaine (défaut: 40)
  className?: string;
}

type BudgetStatus = 'low' | 'normal' | 'high' | 'overload';

export function TimeBudgetIndicator({ 
  tasks, 
  targetHours = 40,
  className 
}: TimeBudgetIndicatorProps) {
  const locale = useLocale();
  const l = locale === 'en' ? 'en' : 'fr';

  // Calculs
  const { totalHours, byTemporality, status, percentage } = useMemo(() => {
    const total = tasks.reduce((acc, task) => acc + (task.hoursPerWeek || 4), 0);
    
    // Répartition par temporalité
    const byTemp: Record<Temporality, number> = {
      quotidien: 0,
      hebdomadaire: 0,
      mensuel: 0,
      strategique: 0,
    };
    
    tasks.forEach(task => {
      byTemp[task.temporalite] += task.hoursPerWeek || 4;
    });

    // Calcul du status
    let budgetStatus: BudgetStatus;
    if (total < 20) budgetStatus = 'low';
    else if (total <= 45) budgetStatus = 'normal';
    else if (total <= 55) budgetStatus = 'high';
    else budgetStatus = 'overload';

    // Pourcentage (cap à 150% pour l'affichage)
    const pct = Math.min(150, Math.round((total / targetHours) * 100));

    return {
      totalHours: total,
      byTemporality: byTemp,
      status: budgetStatus,
      percentage: pct,
    };
  }, [tasks, targetHours]);

  // Config par status
  const statusConfig: Record<BudgetStatus, {
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
    label: { fr: string; en: string };
    message: { fr: string; en: string };
  }> = {
    low: {
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/20',
      borderColor: 'border-slate-500/30',
      icon: <Info className="w-4 h-4" />,
      label: { fr: 'Incomplet', en: 'Incomplete' },
      message: { 
        fr: 'Avez-vous listé toutes vos tâches ?', 
        en: 'Have you listed all your tasks?' 
      },
    },
    normal: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      icon: <CheckCircle className="w-4 h-4" />,
      label: { fr: 'Équilibré', en: 'Balanced' },
      message: { 
        fr: 'Charge de travail cohérente', 
        en: 'Consistent workload' 
      },
    },
    high: {
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      icon: <AlertTriangle className="w-4 h-4" />,
      label: { fr: 'Chargé', en: 'Heavy' },
      message: { 
        fr: 'Semaine chargée — vérifiez vos estimations', 
        en: 'Heavy week — verify your estimates' 
      },
    },
    overload: {
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      borderColor: 'border-rose-500/30',
      icon: <AlertTriangle className="w-4 h-4" />,
      label: { fr: 'Surcharge', en: 'Overload' },
      message: { 
        fr: 'Estimation irréaliste — ajustez les heures', 
        en: 'Unrealistic estimate — adjust hours' 
      },
    },
  };

  const config = statusConfig[status];

  // Labels temporalité
  const tempLabels: Record<Temporality, { icon: React.ReactNode; label: { fr: string; en: string } }> = {
    quotidien: { 
      icon: <Calendar className="w-3 h-3" />, 
      label: { fr: 'Quotidien', en: 'Daily' } 
    },
    hebdomadaire: { 
      icon: <CalendarDays className="w-3 h-3" />, 
      label: { fr: 'Hebdo', en: 'Weekly' } 
    },
    mensuel: { 
      icon: <CalendarClock className="w-3 h-3" />, 
      label: { fr: 'Mensuel', en: 'Monthly' } 
    },
    strategique: { 
      icon: <Target className="w-3 h-3" />, 
      label: { fr: 'Stratégique', en: 'Strategic' } 
    },
  };

  if (tasks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'apex-card p-4 border',
        config.borderColor,
        className
      )}
    >
      {/* Header : Total + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            config.bgColor
          )}>
            <Timer className={cn('w-5 h-5', config.color)} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className={cn('text-2xl font-bold tabular-nums', config.color)}>
                {totalHours}h
              </span>
              <span className="text-slate-500 text-sm">
                / {targetHours}h {l === 'fr' ? 'semaine' : 'week'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {l === 'fr' ? 'Budget temps estimé' : 'Estimated time budget'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
          config.bgColor,
          config.color
        )}>
          {config.icon}
          {config.label[l]}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
        {/* Zone normale (35-45h) */}
        <div 
          className="absolute h-full bg-slate-700/50"
          style={{ 
            left: `${(35 / targetHours) * 100}%`, 
            width: `${((45 - 35) / targetHours) * 100}%` 
          }}
        />
        
        {/* Barre de progression */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            status === 'low' && 'bg-slate-500',
            status === 'normal' && 'bg-gradient-to-r from-emerald-500 to-emerald-400',
            status === 'high' && 'bg-gradient-to-r from-amber-500 to-amber-400',
            status === 'overload' && 'bg-gradient-to-r from-rose-500 to-rose-400'
          )}
        />

        {/* Marqueur 40h */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-slate-400/50"
          style={{ left: '100%' }}
        />
      </div>

      {/* Message d'alerte */}
      {status !== 'normal' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('text-xs mb-3 flex items-center gap-1.5', config.color)}
        >
          {config.icon}
          {config.message[l]}
        </motion.p>
      )}

      {/* Répartition par temporalité */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.entries(byTemporality) as [Temporality, number][]).map(([temp, hours]) => (
          <div
            key={temp}
            className={cn(
              'flex flex-col items-center p-2 rounded-lg transition-colors',
              hours > 0 ? 'bg-slate-800/50' : 'bg-slate-900/30 opacity-50'
            )}
          >
            <div className="flex items-center gap-1 text-slate-400 mb-1">
              {tempLabels[temp].icon}
              <span className="text-[10px] uppercase tracking-wider">
                {tempLabels[temp].label[l]}
              </span>
            </div>
            <span className={cn(
              'text-sm font-semibold tabular-nums',
              hours > 0 ? 'text-slate-200' : 'text-slate-600'
            )}>
              {hours}h
            </span>
          </div>
        ))}
      </div>

      {/* Delta vs standard (si écart significatif) */}
      {Math.abs(totalHours - targetHours) > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 pt-3 border-t border-slate-800"
        >
          <p className="text-xs text-slate-500 text-center">
            {totalHours > targetHours ? (
              <>
                <span className="text-amber-400 font-medium">+{totalHours - targetHours}h</span>
                {' '}{l === 'fr' ? 'au-dessus d\'une semaine standard' : 'above a standard week'}
              </>
            ) : (
              <>
                <span className="text-slate-400 font-medium">-{targetHours - totalHours}h</span>
                {' '}{l === 'fr' ? 'en-dessous d\'une semaine standard' : 'below a standard week'}
              </>
            )}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

