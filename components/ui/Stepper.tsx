'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  shortTitle: string;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isComplete = step.number < currentStep;
          const isPending = step.number > currentStep;

          return (
            <div key={step.number} className="flex items-center">
              <div className="stepper-item">
                <motion.div
                  className={cn(
                    'stepper-number',
                    isActive && 'stepper-number-active',
                    isComplete && 'stepper-number-complete',
                    isPending && 'stepper-number-pending'
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors duration-200 capitalize',
                    isActive && 'text-slate-100',
                    isComplete && 'text-emerald-400',
                    isPending && 'text-slate-500'
                  )}
                >
                  {step.shortTitle}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'stepper-connector w-8 mx-2',
                    step.number < currentStep
                      ? 'stepper-connector-active'
                      : 'stepper-connector-pending'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-sm">
            {currentStep} / {steps.length}
          </span>
          <span className="text-slate-100 text-sm font-medium capitalize">
            {steps.find(s => s.number === currentStep)?.title}
          </span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

export const AUDIT_STEPS: Step[] = [
  { number: 1, title: 'La Matrice', shortTitle: 'matrix' },
  { number: 2, title: 'Contexte', shortTitle: 'context' },
  { number: 3, title: 'Audit Temporel', shortTitle: 'tasks' },
  { number: 4, title: 'Signature Talents', shortTitle: 'talents' },
  { number: 5, title: 'Tech Scan', shortTitle: 'tech' },
  { number: 6, title: 'Le Verdict', shortTitle: 'verdict' },
  { number: 7, title: 'Matrice Ikigai', shortTitle: 'ikigai' },
  { number: 8, title: 'Plan d\'Action', shortTitle: 'roadmap' },
];
