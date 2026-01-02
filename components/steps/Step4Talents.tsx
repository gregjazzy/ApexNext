'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Target, 
  Handshake, 
  Network, 
  AlertTriangle, 
  Users, 
  Lightbulb, 
  Bot, 
  Shield, 
  Flag, 
  Search, 
  MessageSquare,
  Star,
  CheckCircle2
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuditStore, Talent, STRATEGIC_ASSETS } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { cn } from '@/lib/utils';
import { personaLabels } from '@/lib/lexicon';

// Mapping des icônes
const iconMap: Record<string, React.ReactNode> = {
  Scale: <Scale className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  Handshake: <Handshake className="w-6 h-6" />,
  Network: <Network className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  Bot: <Bot className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Flag: <Flag className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
};

export function Step4Talents() {
  const t = useTranslations('step4');
  const locale = useLocale();
  const { context, talents, toggleTalent, setTalentLevel, getSelectedTalents, nextStep, prevStep, initializeTalents } = useAuditStore();

  const selectedTalents = getSelectedTalents();
  const canProceed = selectedTalents.length === 5;
  const persona = context.persona || 'salarie';
  const l = locale === 'en' ? 'en' : 'fr';

  // Initialiser les talents si nécessaire
  useEffect(() => {
    if (talents.length === 0) {
      initializeTalents();
    }
  }, [talents.length, initializeTalents]);

  const handleCardClick = (talent: Talent) => {
    const isSelected = talent.selected;
    const canSelect = !isSelected && selectedTalents.length < 5;
    
    if (isSelected || canSelect) {
      toggleTalent(talent.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Mode Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Mode Diagnostic : {personaLabels[persona][l]}
          </span>
          
          <h1 className="apex-title text-4xl md:text-5xl">
            {l === 'fr' ? 'Inventaire de vos Actifs Stratégiques' : 'Strategic Assets Inventory'}
          </h1>
        </motion.div>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {l === 'fr' 
            ? 'Identifiez les 5 leviers critiques sur lesquels repose votre autorité professionnelle réelle.'
            : 'Identify the 5 critical levers on which your real professional authority rests.'}
        </motion.p>
      </div>

      {/* Selection Counter */}
      <motion.div
        className="apex-card p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-colors duration-300',
            selectedTalents.length === 5 
              ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/50' 
              : 'bg-amber-500/20 text-amber-400'
          )}>
            {selectedTalents.length}
          </div>
          <div>
            <p className="text-slate-200 font-medium">
              {l === 'fr' ? 'Actifs sélectionnés' : 'Selected assets'} 
              <span className="text-slate-500 ml-1">/ 5</span>
            </p>
            <p className="text-sm text-slate-500">
              {selectedTalents.length === 5 
                ? (l === 'fr' ? '✓ Sélection complète' : '✓ Selection complete')
                : (l === 'fr' ? `Sélectionnez encore ${5 - selectedTalents.length} actif(s)` : `Select ${5 - selectedTalents.length} more asset(s)`)}
            </p>
          </div>
        </div>
        
        {selectedTalents.length === 5 && (
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        )}
      </motion.div>

      {/* Grid 3x4 des 12 Actifs Stratégiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talents.map((talent, index) => {
          const isSelected = talent.selected;
          const canSelect = !isSelected && selectedTalents.length < 5;

          return (
            <motion.div
              key={talent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => handleCardClick(talent)}
              className={cn(
                'apex-card p-5 cursor-pointer transition-all duration-300 group relative overflow-visible',
                isSelected
                  ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : canSelect
                    ? 'hover:border-slate-600 hover:bg-slate-800/60'
                    : 'opacity-60 cursor-not-allowed hover:opacity-80'
              )}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                </motion.div>
              )}

              {/* Icon */}
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300',
                isSelected
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
              )}>
                {iconMap[talent.icon] || <Target className="w-6 h-6" />}
              </div>

              {/* Content */}
              <h3 className={cn(
                'font-serif font-semibold text-lg mb-2 transition-colors duration-300',
                isSelected ? 'text-amber-300' : 'text-slate-200'
              )}>
                {talent.name}
              </h3>
              
              <p className="text-sm text-slate-400 leading-relaxed">
                {talent.description}
              </p>

              {/* Tooltip avec exemple - visible au hover */}
              {!isSelected && (
                <div className={cn(
                  'absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full px-4 py-3 rounded-lg',
                  'bg-slate-800 border border-amber-500/30 shadow-xl shadow-black/50',
                  'text-xs text-slate-300 leading-relaxed w-[280px] z-[100]',
                  'opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'
                )}>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{STRATEGIC_ASSETS.find(a => a.id === talent.id)?.example}</span>
                  </div>
                  {/* Flèche du tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
                </div>
              )}

              {/* Level Selector - Visible only when selected */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-amber-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        {l === 'fr' ? 'Niveau de maîtrise' : 'Mastery level'}
                      </p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={(e) => {
                              e.stopPropagation();
                              setTalentLevel(talent.id, level);
                            }}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={cn(
                                'w-5 h-5 transition-colors duration-200',
                                level <= talent.level
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600 hover:text-amber-400/50'
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Assets Summary */}
      <AnimatePresence>
        {selectedTalents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="apex-card p-6"
          >
            <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              {l === 'fr' ? 'Votre Signature Stratégique' : 'Your Strategic Signature'}
            </h4>
            <div className="flex flex-wrap gap-3">
              {selectedTalents.map((talent) => (
                <motion.div
                  key={talent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30"
                >
                  <span className="text-amber-300 font-medium">{talent.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(talent.level)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                    {[...Array(5 - talent.level)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-slate-700" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel={t('nextButton')}
      />
    </motion.div>
  );
}
