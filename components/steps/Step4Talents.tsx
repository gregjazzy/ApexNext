'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { cn } from '@/lib/utils';

export function Step4Talents() {
  const t = useTranslations('step4');
  const { talents, toggleTalent, setTalentLevel, getSelectedTalents, nextStep, prevStep } = useAuditStore();

  const selectedTalents = getSelectedTalents();
  const canProceed = selectedTalents.length === 5;

  // Group talents by category
  const talentsByCategory = talents.reduce((acc, talent) => {
    if (!acc[talent.category]) {
      acc[talent.category] = [];
    }
    acc[talent.category].push(talent);
    return acc;
  }, {} as Record<string, typeof talents>);

  const categoryLabels: Record<string, string> = {
    analytique: t('categories.analytical'),
    relationnel: t('categories.relational'),
    creatif: t('categories.creative'),
    operationnel: t('categories.operational'),
    technique: t('categories.technical'),
  };

  const getTalentLabel = (talentId: string): string => {
    const talentKey = talentId as keyof ReturnType<typeof t>;
    try {
      return t(`talents.${talentId}` as any) || talentId;
    } catch {
      return talentId;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          className="apex-title text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t('title')}
        </motion.h1>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>
      </div>

      {/* Selected Count */}
      <motion.div
        className="apex-card p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-slate-300 font-medium">
            {t('selected')}: <span className={cn(
              'font-bold',
              selectedTalents.length === 5 ? 'text-emerald-400' : 'text-amber-400'
            )}>{selectedTalents.length}</span> / 5
          </span>
        </div>
        {selectedTalents.length !== 5 && (
          <span className="text-sm text-slate-500">
            {t('hint')}
          </span>
        )}
      </motion.div>

      {/* Talent Categories */}
      <div className="space-y-8">
        {Object.entries(talentsByCategory).map(([category, categoryTalents], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + catIndex * 0.1 }}
          >
            <h3 className="text-lg font-medium text-slate-300 mb-4">
              {categoryLabels[category] || category}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categoryTalents.map((talent) => {
                const isSelected = talent.selected;
                const canSelect = !isSelected && selectedTalents.length < 5;

                return (
                  <motion.div
                    key={talent.id}
                    onClick={() => (isSelected || canSelect) && toggleTalent(talent.id)}
                    className={cn(
                      'relative cursor-pointer rounded-lg p-4 transition-all duration-200',
                      isSelected
                        ? 'bg-amber-500/20 border border-amber-500/50 shadow-lg shadow-amber-500/10'
                        : canSelect
                          ? 'bg-slate-800/50 border border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                          : 'bg-slate-800/30 border border-slate-800 opacity-50 cursor-not-allowed'
                    )}
                    whileHover={isSelected || canSelect ? { scale: 1.02 } : {}}
                    whileTap={isSelected || canSelect ? { scale: 0.98 } : {}}
                    layout
                  >
                    <p className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-amber-300' : 'text-slate-300'
                    )}>
                      {getTalentLabel(talent.id)}
                    </p>

                    {/* Level Selector */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-amber-500/30"
                        >
                          <p className="text-xs text-slate-400 mb-2">{t('masteryLevel')}</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTalentLevel(talent.id, level);
                                }}
                                className="p-1"
                              >
                                <Star
                                  className={cn(
                                    'w-4 h-4 transition-colors',
                                    level <= talent.level
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-600 hover:text-amber-400/50'
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Talents Summary */}
      <AnimatePresence>
        {selectedTalents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="apex-card p-6"
          >
            <h4 className="text-sm font-medium text-slate-400 mb-4">{t('yourSignature')}</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTalents.map((talent) => (
                <motion.div
                  key={talent.id}
                  layout
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30"
                >
                  <span className="text-amber-300 text-sm">{getTalentLabel(talent.id)}</span>
                  <div className="flex gap-0.5">
                    {[...Array(talent.level)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
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
