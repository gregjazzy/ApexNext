'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { Stepper, AUDIT_STEPS } from '@/components/ui/Stepper';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { UserMenu } from '@/components/ui/UserMenu';
import {
  Step1Matrix,
  Step2Context,
  Step3Tasks,
  Step4Talents,
  Step5Software,
  Step6Verdict,
} from '@/components/steps';

// Phase 1: Diagnostic (6 étapes)
const stepComponents: Record<number, React.ComponentType> = {
  1: Step1Matrix,
  2: Step2Context,
  3: Step3Tasks,
  4: Step4Talents,
  5: Step5Software,
  6: Step6Verdict,
};

export function AuditFlow() {
  const { data: session } = useSession();
  const router = useRouter();
  const { currentStep, initializeTalents, talents, setStep } = useAuditStore();
  const t = useTranslations('common');
  const tStepper = useTranslations('stepper');

  // Initialize talents on mount
  useEffect(() => {
    if (talents.length === 0) {
      initializeTalents();
    }
  }, [talents.length, initializeTalents]);

  // Rediriger vers /strategy si step >= 7 (Phase 2)
  useEffect(() => {
    if (currentStep >= 7) {
      router.push('/strategy');
    }
  }, [currentStep, router]);

  // Limiter à l'étape 6 max pour Phase 1
  const displayStep = Math.min(currentStep, 6);
  const CurrentStepComponent = stepComponents[displayStep] || Step1Matrix;

  // Phase 1 steps only (1-6)
  const phase1Steps = AUDIT_STEPS.filter(s => s.number <= 6);
  const translatedSteps = phase1Steps.map(step => ({
    ...step,
    title: tStepper(step.shortTitle.toLowerCase()),
    shortTitle: tStepper(step.shortTitle.toLowerCase()),
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Compass className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="font-serif text-xl font-bold text-slate-100">{t('appName')}</h1>
                <p className="text-xs text-slate-500">Phase 1 — Diagnostic</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right mr-4">
                <p className="text-xs text-slate-500">{t('step')} {displayStep} {t('of')} 6</p>
                <p className="text-sm text-slate-300 font-medium">
                  {translatedSteps.find(s => s.number === displayStep)?.title}
                </p>
              </div>
              
              <LanguageSwitcher />
              
              {session?.user && (
                <UserMenu user={session.user} />
              )}
            </div>
          </div>
          
          <Stepper currentStep={displayStep} steps={translatedSteps} />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 backdrop-blur-md bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              {t('appName')} • {t('tagline')}
            </p>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-500/10">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-blue-400">Phase 1 : Diagnostic</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
