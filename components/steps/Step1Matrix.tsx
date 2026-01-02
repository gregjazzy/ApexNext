'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Users, TrendingUp, Shuffle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuditStore, Persona, Goal } from '@/lib/store';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { NavigationButtons } from '@/components/ui/NavigationButtons';

export function Step1Matrix() {
  const t = useTranslations('step1');
  const tCommon = useTranslations('common');
  const { context, setPersona, setGoal, nextStep } = useAuditStore();
  const { persona, goal } = context;

  const canProceed = persona && goal;

  const personas = [
    {
      id: 'salarie' as Persona,
      title: t('personas.salarie.title'),
      description: t('personas.salarie.description'),
      icon: <User className="w-6 h-6" />,
    },
    {
      id: 'freelance' as Persona,
      title: t('personas.freelance.title'),
      description: t('personas.freelance.description'),
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      id: 'leader' as Persona,
      title: t('personas.leader.title'),
      description: t('personas.leader.description'),
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const goals = [
    {
      id: 'augmentation' as Goal,
      title: t('goals.augmentation.title'),
      description: t('goals.augmentation.description'),
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      id: 'pivot' as Goal,
      title: t('goals.pivot.title'),
      description: t('goals.pivot.description'),
      icon: <Shuffle className="w-6 h-6" />,
    },
  ];

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

      {/* Persona Selection */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
            1
          </span>
          {t('whoAreYou')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {personas.map((p) => (
            <SelectionCard
              key={p.id}
              title={p.title}
              description={p.description}
              icon={p.icon}
              selected={persona === p.id}
              onClick={() => setPersona(p.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* Goal Selection */}
      <AnimatePresence mode="wait">
        {persona && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                2
              </span>
              {t('whatGoal')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((g) => (
                <SelectionCard
                  key={g.id}
                  title={g.title}
                  description={g.description}
                  icon={g.icon}
                  selected={goal === g.id}
                  onClick={() => setGoal(g.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Summary */}
      <AnimatePresence mode="wait">
        {canProceed && (
          <motion.div
            className="apex-card p-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <p className="text-slate-400 mb-2">{t('yourConfig')}</p>
            <p className="text-xl font-serif text-slate-100">
              <span className="text-blue-400">{personas.find(p => p.id === persona)?.title}</span>
              {' '}{t('inMode')}{' '}
              <span className="text-emerald-400">{goals.find(g => g.id === goal)?.title}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationButtons
        showPrev={false}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel={t('nextButton')}
      />
    </motion.div>
  );
}
