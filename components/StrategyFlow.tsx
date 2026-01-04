'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ChevronLeft, Zap, Compass, ArrowLeft, LayoutGrid } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { UserMenu } from '@/components/ui/UserMenu';
import { ResetButton } from '@/components/ui/ResetButton';
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
  const searchParams = useSearchParams();
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  // Lire le paramètre ?step=8 pour accès direct à la Roadmap
  const stepParam = searchParams.get('step');
  const targetStep = stepParam === '8' ? 8 : 7;
  
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

    // Pour le parcours Pivot, afficher le Portrait si pas encore complété (seulement pour Ikigai)
    if (targetStep === 7 && context.goal === 'pivot' && !userIntention.isComplete) {
      setShowPortrait(true);
    }

    // Définir l'étape selon le paramètre URL
    setStep(targetStep);

    // Générer la stratégie si pas encore fait
    if (!strategy.generatedAt) {
      generateStrategy();
    }

    setIsInitialized(true);
  }, [tasks, context, getSelectedTalents, router, targetStep, setStep, strategy.generatedAt, generateStrategy, userIntention.isComplete]);

  // ===============================================
  // SCROLL TO TOP : Remonter en haut à chaque changement d'étape
  // ===============================================
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Callback quand le Portrait est complété
  const handlePortraitComplete = () => {
    setShowPortrait(false);
    // Régénérer la stratégie avec les nouvelles données
    generateStrategy();
    // Retourner au Hub pour montrer la progression
    router.push('/hub');
  };

  // Callback pour retourner au diagnostic
  const handlePortraitBack = () => {
    router.push('/audit');
  };

  const isAugmentation = context.goal === 'augmentation';
  const config = isAugmentation ? SCENARIO_CONFIG.augmentation : SCENARIO_CONFIG.pivot;
  const ScenarioIcon = config.icon;

  // Déterminer le composant actuel basé sur l'URL (7 = Ikigai, 8 = Roadmap)
  const CurrentStepComponent = targetStep === 7 ? Step7Ikigai : Step8Roadmap;
  const currentStepInfo = STRATEGY_STEPS.find(s => s.number === targetStep);
  const isIkigai = targetStep === 7;
  const isRoadmap = targetStep === 8;

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
                  {isIkigai 
                    ? (l === 'fr' ? 'Stratégie' : 'Strategy')
                    : (l === 'fr' ? 'Plan d\'Action' : 'Action Plan')
                  }
                </p>
                <p className="text-sm text-slate-300 font-medium">
                  {currentStepInfo?.title[l]}
                </p>
              </div>

              <ResetButton variant="text" />

              <LanguageSwitcher />

              {session?.user && (
                <UserMenu user={session.user} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={targetStep}
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

