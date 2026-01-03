'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { 
  Cpu, Target, Megaphone, CheckCircle2, Circle,
  Zap, Clock, Calendar, RotateCcw, Download,
  ArrowRight, Sparkles, TrendingUp
} from 'lucide-react';

const PILLAR_CONFIG = {
  delegation: {
    icon: Cpu,
    colorClass: 'emerald',
    bgClass: 'bg-emerald-500/20',
    borderClass: 'border-emerald-500/30',
    textClass: 'text-emerald-400',
  },
  reinforcement: {
    icon: Target,
    colorClass: 'amber',
    bgClass: 'bg-amber-500/20',
    borderClass: 'border-amber-500/30',
    textClass: 'text-amber-400',
  },
  positioning: {
    icon: Megaphone,
    colorClass: 'blue',
    bgClass: 'bg-blue-500/20',
    borderClass: 'border-blue-500/30',
    textClass: 'text-blue-400',
  },
};

const PRIORITY_CONFIG = {
  immediate: {
    icon: Zap,
    label: { fr: 'Immédiat', en: 'Immediate' },
    bgClass: 'bg-rose-500/20',
    textClass: 'text-rose-400',
  },
  short_term: {
    icon: Clock,
    label: { fr: '1-3 mois', en: '1-3 months' },
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
  },
  medium_term: {
    icon: Calendar,
    label: { fr: '3-6 mois', en: '3-6 months' },
    bgClass: 'bg-blue-500/20',
    textClass: 'text-blue-400',
  },
};

export function Step8Roadmap() {
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { 
    context, 
    strategy, 
    toggleRoadmapAction,
    prevStep,
    reset 
  } = useAuditStore();
  
  const isAugmentation = context.goal === 'augmentation';

  // Grouper les actions par pilier
  const actionsByPillar = useMemo(() => {
    const grouped: Record<string, typeof strategy.roadmap> = {
      delegation: [],
      reinforcement: [],
      positioning: [],
    };
    
    strategy.roadmap.forEach(action => {
      if (grouped[action.pillar]) {
        grouped[action.pillar].push(action);
      }
    });
    
    return grouped;
  }, [strategy.roadmap]);

  // Stats de progression
  const completedCount = strategy.roadmap.filter(a => a.completed).length;
  const totalCount = strategy.roadmap.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const pillarLabels = {
    delegation: {
      fr: 'Délégation Technologique',
      en: 'Technological Delegation',
      desc: {
        fr: 'Automatiser les processus à faible valeur ajoutée pour libérer votre temps stratégique.',
        en: 'Automate low-value processes to free up your strategic time.',
      }
    },
    reinforcement: {
      fr: 'Renforcement de Signature',
      en: 'Signature Reinforcement',
      desc: {
        fr: 'Consolider vos actifs stratégiques pour maximiser votre différenciation.',
        en: 'Consolidate your strategic assets to maximize differentiation.',
      }
    },
    positioning: {
      fr: 'Positionnement Marché',
      en: 'Market Positioning',
      desc: {
        fr: 'Affirmer votre valeur unique face aux systèmes automatisés.',
        en: 'Assert your unique value against automated systems.',
      }
    },
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Parcours Badge */}
        <motion.div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            isAugmentation 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {isAugmentation ? <Zap className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          {l === 'fr' 
            ? (isAugmentation ? 'Parcours Augmentation' : 'Parcours Pivot') 
            : (isAugmentation ? 'Augmentation Path' : 'Pivot Path')}
        </motion.div>
        
        <h1 className="apex-title text-3xl mb-3">
          {l === 'fr' ? 'Plan d\'Action Stratégique' : 'Strategic Action Plan'}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {l === 'fr' 
            ? 'Votre roadmap personnalisée pour sécuriser et valoriser votre position professionnelle.'
            : 'Your personalized roadmap to secure and enhance your professional position.'}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 font-medium">
            {l === 'fr' ? 'Progression' : 'Progress'}
          </span>
          <span className="text-slate-400">
            {completedCount}/{totalCount} {l === 'fr' ? 'actions' : 'actions'}
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {progressPercent === 100 
            ? (l === 'fr' ? '🎉 Toutes les actions sont complétées !' : '🎉 All actions completed!')
            : (l === 'fr' ? `${progressPercent}% de votre plan réalisé` : `${progressPercent}% of your plan completed`)}
        </p>
      </motion.div>

      {/* 3 Pillars */}
      <div className="space-y-6">
        {(['delegation', 'reinforcement', 'positioning'] as const).map((pillarKey, pillarIndex) => {
          const config = PILLAR_CONFIG[pillarKey];
          const Icon = config.icon;
          const actions = actionsByPillar[pillarKey];
          const pillarLabel = pillarLabels[pillarKey];
          
          return (
            <motion.div
              key={pillarKey}
              className="apex-card overflow-visible"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + pillarIndex * 0.15 }}
            >
              {/* Pillar Header */}
              <div className={`p-6 border-b border-slate-800 ${config.bgClass}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${config.bgClass} border ${config.borderClass} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${config.textClass}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-xl text-slate-200 mb-1">
                      {l === 'fr' ? `Pilier ${pillarIndex + 1} : ` : `Pillar ${pillarIndex + 1}: `}
                      {pillarLabel[l]}
                    </h2>
                    <p className="text-sm text-slate-400">
                      {pillarLabel.desc[l]}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-4 space-y-3">
                <AnimatePresence>
                  {actions.map((action, actionIndex) => {
                    const priorityConfig = PRIORITY_CONFIG[action.priority];
                    const PriorityIcon = priorityConfig.icon;
                    
                    return (
                      <motion.div
                        key={action.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          action.completed 
                            ? 'bg-slate-800/30 border-slate-700/50 opacity-60' 
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        }`}
                        onClick={() => toggleRoadmapAction(action.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: actionIndex * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div className="mt-0.5">
                            {action.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium ${action.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                {action.title}
                              </h3>
                            </div>
                            <p className={`text-sm ${action.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                              {action.description}
                            </p>
                          </div>
                          
                          {/* Priority Badge */}
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${priorityConfig.bgClass} ${priorityConfig.textClass}`}>
                            <PriorityIcon className="w-3 h-3" />
                            {priorityConfig.label[l]}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {actions.length === 0 && (
                  <p className="text-slate-500 text-center py-4">
                    {l === 'fr' ? 'Aucune action pour ce pilier.' : 'No actions for this pillar.'}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Final CTA */}
      <motion.div
        className="apex-card p-8 text-center bg-gradient-to-br from-slate-900/80 to-slate-800/40 border-emerald-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-slate-200 mb-3">
          {l === 'fr' ? 'Votre Stratégie est Prête' : 'Your Strategy is Ready'}
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-6">
          {l === 'fr' 
            ? 'Vous avez maintenant une vision claire de votre positionnement et un plan d\'action concret pour sécuriser votre avenir professionnel.'
            : 'You now have a clear vision of your positioning and a concrete action plan to secure your professional future.'}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={() => {
              // TODO: Export PDF
              alert(l === 'fr' ? 'Export PDF à venir !' : 'PDF export coming soon!');
            }}
            className="apex-button flex items-center gap-2 bg-slate-700 hover:bg-slate-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            {l === 'fr' ? 'Exporter en PDF' : 'Export as PDF'}
          </motion.button>
          
          <motion.button
            onClick={reset}
            className="apex-button flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            {l === 'fr' ? 'Nouvel Audit' : 'New Audit'}
          </motion.button>
        </div>
      </motion.div>

      {/* Navigation */}
      <NavigationButtons
        onPrev={prevStep}
        showNext={false}
        prevLabel={l === 'fr' ? '← Retour à la Matrice' : '← Back to Matrix'}
      />
    </motion.div>
  );
}

