'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Users, Zap, Shuffle, Compass, UserCog } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuditStore, Persona, Goal } from '@/lib/store';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { matrixLexicon, personaLabels, getGoalTitle, getGoalDescription } from '@/lib/lexicon';

export function Step1Matrix() {
  const locale = useLocale();
  const router = useRouter();
  const { context, setPersona, setGoal } = useAuditStore();
  const { persona, goal } = context;

  const canProceed = persona && goal;
  const l = locale === 'en' ? 'en' : 'fr';

  // Redirect to Strategy Hub after persona + goal selection
  const handleLaunchHub = () => {
    router.push('/hub');
  };

  // Personas with expert vocabulary - Updated for Pivot intention
  const personas = [
    {
      id: 'salarie' as Persona,
      title: personaLabels.salarie[l],
      description: l === 'fr' 
        ? "En poste, vous voulez sécuriser votre rôle actuel ou piloter une réorientation stratégique." 
        : "Employed, you want to secure your current role or lead a strategic reorientation.",
      icon: <User className="w-6 h-6" />,
    },
    {
      id: 'freelance' as Persona,
      title: personaLabels.freelance[l],
      description: l === 'fr'
        ? "Indépendant, vous cherchez à optimiser votre activité ou pivoter vers un nouveau marché résilient."
        : "Independent, you're looking to optimize your business or pivot to a resilient new market.",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      id: 'leader' as Persona,
      title: personaLabels.leader[l],
      description: l === 'fr'
        ? "Vous pilotez une équipe et anticipez les mutations sectorielles."
        : "You lead a team and anticipate sector transformations.",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  // Type pour les options de goal
  type GoalOption = {
    id: Goal;
    title: string;
    description: string;
    icon: React.ReactNode;
    accentColor: 'blue' | 'emerald' | 'violet';
  };

  // Goals with dynamic titles AND descriptions based on persona
  const getGoals = (): GoalOption[] => {
    const baseGoals: GoalOption[] = [
      {
        id: 'augmentation',
        title: persona 
          ? getGoalTitle('augmentation', persona, locale)
          : (l === 'fr' ? "Axe Augmentation" : "Augmentation Axis"),
        description: persona 
          ? getGoalDescription('augmentation', persona, locale)
          : (l === 'fr' ? "Sélectionnez d'abord votre profil" : "Select your profile first"),
        icon: <Zap className="w-6 h-6" />,
        accentColor: 'blue',
      },
      {
        id: 'pivot',
        title: persona 
          ? getGoalTitle('pivot', persona, locale)
          : (l === 'fr' ? "Axe Pivot" : "Pivot Axis"),
        description: persona 
          ? getGoalDescription('pivot', persona, locale)
          : (l === 'fr' ? "Sélectionnez d'abord votre profil" : "Select your profile first"),
        icon: <Shuffle className="w-6 h-6" />,
        accentColor: 'emerald',
      },
    ];

    // Option Reclassement/PSE uniquement pour Leader/RH
    if (persona === 'leader') {
      baseGoals.push({
        id: 'reclassement',
        title: l === 'fr' 
          ? "Cellule de Reclassement Stratégique" 
          : "Strategic Outplacement Cell",
        description: l === 'fr'
          ? "Piloter un Plan de Reclassement (Mutation de Masse) — Audit de transition collective pour vos équipes."
          : "Lead a Redeployment Plan (Mass Transition) — Collective transition audit for your teams.",
        icon: <UserCog className="w-6 h-6" />,
        accentColor: 'violet',
      });
    }

    return baseGoals;
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
          {matrixLexicon.title[l]}
        </motion.h1>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {matrixLexicon.subtitle[l]}
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
          {l === 'fr' ? 'Quel est votre profil ?' : 'What is your profile?'}
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
              {l === 'fr' ? 'Quel est votre objectif stratégique ?' : 'What is your strategic objective?'}
            </h2>
            <div className={`grid grid-cols-1 gap-4 ${
              persona === 'leader' ? 'md:grid-cols-3' : 'md:grid-cols-2'
            }`}>
              {getGoals().map((g) => (
                <SelectionCard
                  key={g.id}
                  title={g.title}
                  description={g.description}
                  icon={g.icon}
                  selected={goal === g.id}
                  onClick={() => setGoal(g.id)}
                  accentColor={g.accentColor}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Summary with Badge */}
      <AnimatePresence mode="wait">
        {canProceed && (
          <motion.div
            className="apex-card p-6 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Mode Badge */}
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Mode Diagnostic : {personas.find(p => p.id === persona)?.title}
              </span>
            </div>

            <div className="text-center pt-4">
              <p className="text-slate-400 mb-2">
                {l === 'fr' ? 'Configuration validée' : 'Configuration validated'}
              </p>
              <p className="text-xl font-serif text-slate-100">
                <span className="text-blue-400">{personas.find(p => p.id === persona)?.title}</span>
                {' '}{l === 'fr' ? 'en mode' : 'in'}{' '}
                <span className="text-emerald-400">{getGoals().find(g => g.id === goal)?.title}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavigationButtons
        showPrev={false}
        onNext={handleLaunchHub}
        nextDisabled={!canProceed}
        nextLabel={l === 'fr' ? 'Accéder au Centre de Commandement →' : 'Access Command Center →'}
        nextIcon={<Compass className="w-4 h-4" />}
      />
    </motion.div>
  );
}
