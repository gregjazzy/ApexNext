'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ChevronLeft, Zap, Compass, ArrowLeft, LayoutGrid } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { UserMenu } from '@/components/ui/UserMenu';
import { Step7Ikigai, Step8Roadmap } from '@/components/steps';
import PortraitMutation from '@/components/PortraitMutation';

// Configuration des couleurs par scénario
const SCENARIO_CONFIG = {
  augmentation: {
    gradient: 'from-emerald-600 to-teal-600',
    bgGradient: 'from-emerald-500/5 via-transparent to-teal-500/5',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    label: { fr: 'Réingénierie du Poste', en: 'Position Reengineering' },
    icon: Zap,
  },
  pivot: {
    gradient: 'from-indigo-600 to-purple-600',
    bgGradient: 'from-indigo-500/5 via-transparent to-purple-500/5',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    label: { fr: 'Pivot Stratégique', en: 'Strategic Pivot' },
    icon: Compass,
  },
};

const STRATEGY_STEPS = [
  { number: 7, shortTitle: 'ikigai', title: { fr: 'Matrice Ikigai', en: 'Ikigai Matrix' } },
  { number: 8, shortTitle: 'roadmap', title: { fr: 'Plan d\'Action', en: 'Action Plan' } },
];

export function StrategyFlow() {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { 
    currentStep, 
    setStep, 
    context, 
    tasks, 
    getSelectedTalents,
    generateStrategy,
    strategy,
    userIntention 
  } = useAuditStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [showPortrait, setShowPortrait] = useState(false);

  // Vérifier que le diagnostic est complété
  useEffect(() => {
    const selectedTalents = getSelectedTalents();
    const hasDiagnostic = tasks.length > 0 && selectedTalents.length === 5 && context.persona && context.goal;
    
    if (!hasDiagnostic) {
      // Rediriger vers le diagnostic si pas complété
      router.push('/audit');
      return;
    }

    // Pour le parcours Pivot, afficher le Portrait si pas encore complété
    if (context.goal === 'pivot' && !userIntention.isComplete) {
      setShowPortrait(true);
    }

    // S'assurer qu'on est sur l'étape 7 ou 8
    if (currentStep < 7) {
      setStep(7);
    }

    // Générer la stratégie si pas encore fait
    if (!strategy.generatedAt) {
      generateStrategy();
    }

    setIsInitialized(true);
  }, [tasks, context, getSelectedTalents, router, currentStep, setStep, strategy.generatedAt, generateStrategy, userIntention.isComplete]);

  // Callback quand le Portrait est complété
  const handlePortraitComplete = () => {
    setShowPortrait(false);
    // Régénérer la stratégie avec les nouvelles données
    generateStrategy();
  };

  // Callback pour retourner au diagnostic
  const handlePortraitBack = () => {
    router.push('/audit');
  };

  const isAugmentation = context.goal === 'augmentation';
  const config = isAugmentation ? SCENARIO_CONFIG.augmentation : SCENARIO_CONFIG.pivot;
  const ScenarioIcon = config.icon;

  // Déterminer le composant actuel (7 ou 8)
  const strategyStep = currentStep >= 7 ? currentStep : 7;
  const CurrentStepComponent = strategyStep === 7 ? Step7Ikigai : Step8Roadmap;
  const currentStepInfo = STRATEGY_STEPS.find(s => s.number === strategyStep);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto animate-pulse`}>
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <p className="text-slate-400">Initialisation de la stratégie...</p>
        </div>
      </div>
    );
  }

  // Afficher le Portrait de Mutation pour le parcours Pivot (intercalé avant Phase 2)
  if (showPortrait && context.goal === 'pivot') {
    return (
      <PortraitMutation 
        onComplete={handlePortraitComplete}
        onBack={handlePortraitBack}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient}`}>
      {/* Header - Design différent pour Phase 2 */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/90 border-b ${config.border}`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Titre */}
            <div className="flex items-center gap-4">
              {/* Bouton retour au Hub */}
              <motion.button
                onClick={() => router.push('/hub')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors text-indigo-400 hover:text-indigo-300"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
                title={l === 'fr' ? 'Centre de Commandement' : 'Command Center'}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">
                  {l === 'fr' ? 'Hub' : 'Hub'}
                </span>
              </motion.button>
              
              {/* Bouton retour au diagnostic */}
              <motion.button
                onClick={() => {
                  setStep(6);
                  router.push('/audit');
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">
                  {l === 'fr' ? 'Diagnostic' : 'Diagnostic'}
                </span>
              </motion.button>

              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Rocket className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="font-serif text-xl font-bold text-slate-100">APEX Strategy</h1>
                  <p className="text-xs text-slate-500">Phase 2 — Mutation Engine</p>
                </div>
              </div>
            </div>

            {/* Parcours Badge + Step Info */}
            <div className="flex items-center gap-4">
              {/* Parcours Badge */}
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full ${isAugmentation ? 'bg-emerald-500/20' : 'bg-indigo-500/20'} border ${config.border}`}>
                <ScenarioIcon className={`w-4 h-4 ${config.text}`} />
                <span className={`text-sm font-medium ${config.text}`}>
                  {config.label[l]}
                </span>
              </div>

              {/* Step Info */}
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500">
                  {l === 'fr' ? 'Étape' : 'Step'} {strategyStep - 6} / 2
                </p>
                <p className="text-sm text-slate-300 font-medium">
                  {currentStepInfo?.title[l]}
                </p>
              </div>

              <LanguageSwitcher />

              {session?.user && (
                <UserMenu user={session.user} />
              )}
            </div>
          </div>

          {/* Mini Stepper Phase 2 */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {STRATEGY_STEPS.map((step, index) => {
              const isActive = strategyStep === step.number;
              const isCompleted = strategyStep > step.number;

              return (
                <div key={step.number} className="flex items-center gap-2">
                  {index > 0 && (
                    <div className={`w-12 h-0.5 ${isCompleted ? `bg-gradient-to-r ${config.gradient}` : 'bg-slate-700'}`} />
                  )}
                  <motion.button
                    onClick={() => setStep(step.number)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                        : isCompleted
                        ? `${isAugmentation ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'} border ${config.border}`
                        : 'bg-slate-800/50 text-slate-500 border border-slate-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{step.number - 6}</span>
                    <span className="hidden sm:inline text-sm">{step.title[l]}</span>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-40 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={strategyStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className={`fixed bottom-0 left-0 right-0 py-3 backdrop-blur-md bg-slate-950/90 border-t ${config.border}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              APEX Strategy • {l === 'fr' ? 'Moteur de Mutation Professionnelle' : 'Professional Mutation Engine'}
            </p>
            <div className={`flex items-center gap-2 px-2 py-1 rounded ${isAugmentation ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`}>
              <div className={`w-2 h-2 rounded-full ${isAugmentation ? 'bg-emerald-400' : 'bg-indigo-400'} animate-pulse`} />
              <span className={`text-xs ${config.text}`}>
                {l === 'fr' ? 'Stratégie Active' : 'Strategy Active'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

