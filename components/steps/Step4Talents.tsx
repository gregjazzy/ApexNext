'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { useAuditStore, AVAILABLE_TALENTS } from '@/lib/store';
import { TalentBadge } from '@/components/ui/TalentBadge';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { cn } from '@/lib/utils';

export function Step4Talents() {
  const { talents, toggleTalent, setTalentLevel, initializeTalents, nextStep, prevStep, getSelectedTalents } = useAuditStore();
  
  const selectedTalents = getSelectedTalents();
  const canProceed = selectedTalents.length === 5;

  useEffect(() => {
    if (talents.length === 0) {
      initializeTalents();
    }
  }, [talents.length, initializeTalents]);

  // Group talents by category
  const talentsByCategory = talents.reduce((acc, talent) => {
    if (!acc[talent.category]) {
      acc[talent.category] = [];
    }
    acc[talent.category].push(talent);
    return acc;
  }, {} as Record<string, typeof talents>);

  const categoryIcons: Record<string, string> = {
    'Analytique': '📊',
    'Relationnel': '🤝',
    'Créatif': '🎨',
    'Opérationnel': '⚙️',
    'Technique': '💻',
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
        <motion.h1
          className="apex-title text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Signature des Talents
        </motion.h1>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Sélectionnez vos 5 talents majeurs et évaluez votre niveau de maîtrise.
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
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-slate-300">Talents sélectionnés</span>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                i < selectedTalents.length
                  ? 'border-amber-500 bg-amber-500/20'
                  : 'border-slate-700 bg-transparent'
              )}
              animate={i < selectedTalents.length ? { scale: [1, 1.2, 1] } : {}}
            >
              <Star
                className={cn(
                  'w-4 h-4 transition-colors',
                  i < selectedTalents.length
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-600'
                )}
              />
            </motion.div>
          ))}
          <span className={cn(
            'ml-2 font-bold tabular-nums',
            selectedTalents.length === 5 ? 'text-amber-400' : 'text-slate-400'
          )}>
            {selectedTalents.length}/5
          </span>
        </div>
      </motion.div>

      {/* Selected Talents Preview */}
      <AnimatePresence mode="popLayout">
        {selectedTalents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedTalents.map((talent) => (
              <motion.div
                key={talent.id}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="apex-badge-accent flex items-center gap-2"
              >
                <span>{talent.name}</span>
                <div className="flex gap-0.5">
                  {[...Array(talent.level)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Talents by Category */}
      <div className="space-y-8">
        {Object.entries(talentsByCategory).map(([category, categoryTalents], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + categoryIndex * 0.1 }}
          >
            <h3 className="text-lg font-medium text-slate-300 mb-4 flex items-center gap-2">
              <span>{categoryIcons[category] || '•'}</span>
              {category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryTalents.map((talent) => (
                <TalentBadge
                  key={talent.id}
                  name={talent.name}
                  category={talent.category}
                  level={talent.level}
                  selected={talent.selected}
                  onSelect={() => toggleTalent(talent.id)}
                  onLevelChange={(level) => setTalentLevel(talent.id, level)}
                  disabled={!talent.selected && selectedTalents.length >= 5}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hint */}
      {selectedTalents.length < 5 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-500 text-sm"
        >
          💡 Sélectionnez exactement 5 talents pour définir votre signature unique
        </motion.p>
      )}

      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel="Scanner vos outils"
      />
    </motion.div>
  );
}

