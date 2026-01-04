'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { 
  Mail, Clock, Zap, TrendingUp, 
  ChevronDown, ChevronUp, Bot, Users, Brain,
  Sparkles, Settings, Edit3, HelpCircle
} from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// ===============================================
// COEFFICIENTS DE RÉDUCTION IA (validés)
// ===============================================
const AI_REDUCTION_COEFFICIENTS = {
  auto: 0.95,      // 95% pour Flux Automatiques
  basNiveau: 0.70, // 70% pour Flux Bas Niveau
  strategique: 0.30, // 30% pour Flux Stratégiques
};

// ===============================================
// CONFIGURATION DES SLIDERS
// ===============================================
const FLUX_CONFIG = {
  auto: {
    label: { fr: 'Automatiques', en: 'Automatic' },
    description: { fr: 'Notifications, rapports', en: 'Notifications, reports' },
    icon: Bot,
    color: 'emerald',
    textClass: 'text-emerald-400',
    reduction: '95%',
  },
  basNiveau: {
    label: { fr: 'Bas Niveau', en: 'Low-Level' },
    description: { fr: 'Logistique, RDV', en: 'Logistics, scheduling' },
    icon: Users,
    color: 'amber',
    textClass: 'text-amber-400',
    reduction: '70%',
  },
  strategique: {
    label: { fr: 'Stratégiques', en: 'Strategic' },
    description: { fr: 'Négociations, décisions', en: 'Negotiations, decisions' },
    icon: Brain,
    color: 'rose',
    textClass: 'text-rose-400',
    reduction: '30%',
  },
};

interface PhantomChargeScannerProps {
  isToggleMode?: boolean;
}

export function PhantomChargeScanner({ isToggleMode = false }: PhantomChargeScannerProps) {
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { phantomCharge, setPhantomCharge, updatePhantomChargeFlux } = useAuditStore();
  
  // States UI
  const [isExpanded, setIsExpanded] = useState(!isToggleMode);
  const [showFluxSettings, setShowFluxSettings] = useState(true); // Sliders visibles par défaut
  const [isEditing, setIsEditing] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // ===============================================
  // CALCULS
  // ===============================================
  
  const dailyTotalMinutes = (phantomCharge.dailyHours || 0) * 60 + (phantomCharge.dailyMinutes || 0);
  const weeklyTotalMinutes = dailyTotalMinutes * 5;
  const weeklyTotalHours = weeklyTotalMinutes / 60;
  
  const potentialGainMinutes = useMemo(() => {
    const pAuto = phantomCharge.fluxAuto / 100;
    const pBas = phantomCharge.fluxBasNiveau / 100;
    const pStrat = phantomCharge.fluxStrategique / 100;
    
    return weeklyTotalMinutes * (
      pAuto * AI_REDUCTION_COEFFICIENTS.auto +
      pBas * AI_REDUCTION_COEFFICIENTS.basNiveau +
      pStrat * AI_REDUCTION_COEFFICIENTS.strategique
    );
  }, [weeklyTotalMinutes, phantomCharge.fluxAuto, phantomCharge.fluxBasNiveau, phantomCharge.fluxStrategique]);
  
  const potentialGainHours = potentialGainMinutes / 60;
  const isDataComplete = dailyTotalMinutes > 0;
  const isSignificantGain = potentialGainHours >= 2;
  
  // Auto-switch to compact mode when data is complete
  const showCompactMode = isDataComplete && !isEditing;
  
  // ===============================================
  // HANDLERS
  // ===============================================
  
  const handleFluxChange = useCallback((key: 'fluxAuto' | 'fluxBasNiveau' | 'fluxStrategique', newValue: number) => {
    const currentValues = {
      fluxAuto: phantomCharge.fluxAuto,
      fluxBasNiveau: phantomCharge.fluxBasNiveau,
      fluxStrategique: phantomCharge.fluxStrategique,
    };
    
    const oldValue = currentValues[key];
    const delta = newValue - oldValue;
    if (delta === 0) return;
    
    const otherKeys = (['fluxAuto', 'fluxBasNiveau', 'fluxStrategique'] as const).filter(k => k !== key);
    const otherSum = otherKeys.reduce((acc, k) => acc + currentValues[k], 0);
    
    const newValues = { ...currentValues, [key]: newValue };
    
    if (otherSum > 0) {
      otherKeys.forEach(otherKey => {
        const ratio = currentValues[otherKey] / otherSum;
        const adjustment = -delta * ratio;
        newValues[otherKey] = Math.max(0, Math.min(100, Math.round(currentValues[otherKey] + adjustment)));
      });
    } else {
      const remaining = 100 - newValue;
      newValues[otherKeys[0]] = Math.round(remaining / 2);
      newValues[otherKeys[1]] = remaining - newValues[otherKeys[0]];
    }
    
    const sum = newValues.fluxAuto + newValues.fluxBasNiveau + newValues.fluxStrategique;
    if (sum !== 100) {
      const diff = 100 - sum;
      const maxOtherKey = otherKeys.reduce((a, b) => newValues[a] >= newValues[b] ? a : b);
      newValues[maxOtherKey] = Math.max(0, newValues[maxOtherKey] + diff);
    }
    
    updatePhantomChargeFlux(newValues.fluxAuto, newValues.fluxBasNiveau, newValues.fluxStrategique);
  }, [phantomCharge, updatePhantomChargeFlux]);

  const handleConfirm = () => {
    if (isDataComplete) {
      setIsEditing(false);
      setShowFluxSettings(false);
    }
  };
  
  // ===============================================
  // MODE TOGGLE (bouton d'expansion)
  // ===============================================
  
  if (isToggleMode && !isExpanded) {
    return (
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="w-full apex-card p-3 flex items-center justify-between gap-3 hover:border-blue-500/50 transition-colors group"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.005 }}
      >
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-300">
            {l === 'fr' ? '🔍 Analyser le gisement de temps' : '🔍 Analyze time savings'}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
      </motion.button>
    );
  }
  
  // ===============================================
  // MODE COMPACT (après saisie)
  // ===============================================
  
  if (showCompactMode) {
    return (
      <motion.div
        className={cn(
          'apex-card p-4 space-y-3',
          isSignificantGain ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700'
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Ligne principale : résultat */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
              isSignificantGain ? 'bg-emerald-500/20' : 'bg-blue-500/20'
            )}>
              <Mail className={cn('w-5 h-5', isSignificantGain ? 'text-emerald-400' : 'text-blue-400')} />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-400">
                {l === 'fr' ? 'Vos emails :' : 'Your emails:'}
              </span>
              <span className="font-bold text-slate-200">
                {weeklyTotalHours.toFixed(1)}h/{l === 'fr' ? 'sem' : 'wk'}
              </span>
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <span className={cn(
                'text-xl font-bold',
                isSignificantGain ? 'text-emerald-400' : 'text-blue-400'
              )}>
                +{potentialGainHours.toFixed(1)}h
              </span>
              <span className="text-sm text-slate-400">
                {l === 'fr' ? 'récupérables' : 'recoverable'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
            title={l === 'fr' ? 'Modifier' : 'Edit'}
          >
            <Edit3 className="w-4 h-4 text-slate-400 hover:text-slate-200" />
          </button>
        </div>
        
        {/* Ligne secondaire : répartition des flux */}
        <div className="flex items-center justify-between text-xs text-slate-500 pl-[52px]">
          <span>
            {l === 'fr' ? 'Analyse basée sur' : 'Analysis based on'}{' '}
            <span className="text-emerald-400">{phantomCharge.fluxAuto}%</span> {l === 'fr' ? 'Auto' : 'Auto'},{' '}
            <span className="text-amber-400">{phantomCharge.fluxBasNiveau}%</span> {l === 'fr' ? 'Bas Niveau' : 'Low'},{' '}
            <span className="text-rose-400">{phantomCharge.fluxStrategique}%</span> {l === 'fr' ? 'Stratégique' : 'Strategic'}
          </span>
          <button
            onClick={() => {
              setIsEditing(true);
              setShowFluxSettings(true);
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors"
          >
            <Settings className="w-3 h-3" />
            {l === 'fr' ? 'Modifier' : 'Edit'}
          </button>
        </div>
      </motion.div>
    );
  }
  
  // ===============================================
  // MODE ÉDITION (formulaire complet)
  // ===============================================
  
  return (
    <motion.div
      className="apex-card overflow-hidden border-blue-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header compact avec tooltip */}
      <div 
        className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-slate-800/50 flex items-center justify-between"
        onClick={() => isToggleMode && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-400" />
          <h2 className="font-medium text-slate-200">
            {l === 'fr' ? 'Scanner de Charge' : 'Load Scanner'}
          </h2>
          {/* Tooltip d'aide */}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-slate-500 hover:text-blue-400 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 top-6 z-50 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-xl"
                >
                  <p className="text-xs text-slate-300">
                    {l === 'fr' 
                      ? "L'automatisation de vos flux = le budget temps qui financera votre mutation."
                      : "Automating your flows = the time budget that will fund your transition."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {isToggleMode && (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        )}
      </div>
      
      <div className="p-4 space-y-4">
        {/* =============================================== */}
        {/* INPUTS EN GRILLE 2 COLONNES */}
        {/* =============================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Champ A : Volume */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="number"
              min="0"
              max="1000"
              value={phantomCharge.dailyVolume || ''}
              onChange={(e) => setPhantomCharge({ dailyVolume: Math.max(0, parseInt(e.target.value) || 0) })}
              placeholder="100"
              className="w-20 px-2 py-1.5 rounded bg-slate-900/50 border border-slate-700 text-slate-200 text-center font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-600 placeholder:font-normal"
            />
            <span className="text-sm text-slate-500">
              {l === 'fr' ? 'emails/jour' : 'emails/day'}
            </span>
          </div>
          
          {/* Champ B : Temps Global */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="number"
              min="0"
              max="12"
              value={phantomCharge.dailyHours ?? ''}
              onChange={(e) => setPhantomCharge({ dailyHours: Math.max(0, Math.min(12, parseInt(e.target.value) || 0)) })}
              placeholder="2"
              className="w-12 px-2 py-1.5 rounded bg-slate-900/50 border border-slate-700 text-slate-200 text-center font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-600 placeholder:font-normal"
            />
            <span className="text-xs text-slate-500">h</span>
            <input
              type="number"
              min="0"
              max="59"
              step="5"
              value={phantomCharge.dailyMinutes ?? ''}
              onChange={(e) => setPhantomCharge({ dailyMinutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
              placeholder="30"
              className="w-12 px-2 py-1.5 rounded bg-slate-900/50 border border-slate-700 text-slate-200 text-center font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-600 placeholder:font-normal"
            />
            <span className="text-xs text-slate-500">min/{l === 'fr' ? 'jour' : 'day'}</span>
          </div>
        </div>
        
        {/* =============================================== */}
        {/* RÉSULTAT COMPACT + BOUTON AFFINER */}
        {/* =============================================== */}
        {isDataComplete && (
          <motion.div
            className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-800/50"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">{l === 'fr' ? 'Temps :' : 'Time:'}</span>
                <span className="font-bold text-blue-400">{weeklyTotalHours.toFixed(1)}h/{l === 'fr' ? 'sem' : 'wk'}</span>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">{l === 'fr' ? 'Gain :' : 'Savings:'}</span>
                <span className={cn('font-bold', isSignificantGain ? 'text-emerald-400' : 'text-blue-400')}>
                  +{potentialGainHours.toFixed(1)}h
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowFluxSettings(!showFluxSettings)}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              {showFluxSettings 
                ? (l === 'fr' ? 'Masquer flux' : 'Hide flows')
                : (l === 'fr' ? 'Affiner flux' : 'Refine flows')
              }
              {showFluxSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </motion.div>
        )}
        
        {/* =============================================== */}
        {/* ACCORDÉON : SLIDERS FLUX (masqué par défaut) */}
        {/* =============================================== */}
        <AnimatePresence>
          {showFluxSettings && isDataComplete && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {l === 'fr' ? 'Nature des flux' : 'Flow types'}
                </span>
                <span className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] font-medium',
                  phantomCharge.fluxAuto + phantomCharge.fluxBasNiveau + phantomCharge.fluxStrategique === 100
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                )}>
                  {phantomCharge.fluxAuto + phantomCharge.fluxBasNiveau + phantomCharge.fluxStrategique}%
                </span>
              </div>
              
              {(Object.keys(FLUX_CONFIG) as Array<keyof typeof FLUX_CONFIG>).map((key) => {
                const config = FLUX_CONFIG[key];
                const Icon = config.icon;
                const storeKey = key === 'auto' ? 'fluxAuto' : key === 'basNiveau' ? 'fluxBasNiveau' : 'fluxStrategique';
                const value = phantomCharge[storeKey];
                
                return (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4 flex-shrink-0', config.textClass)} />
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleFluxChange(storeKey, parseInt(e.target.value))}
                        className={cn(
                          'w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700',
                          config.color === 'emerald' && 'accent-emerald-500',
                          config.color === 'amber' && 'accent-amber-500',
                          config.color === 'rose' && 'accent-rose-500'
                        )}
                      />
                    </div>
                    <span className={cn('text-sm font-bold tabular-nums w-12 text-right', config.textClass)}>
                      {value}%
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* =============================================== */}
        {/* BOUTON CONFIRMER */}
        {/* =============================================== */}
        {isDataComplete && (
          <motion.button
            onClick={handleConfirm}
            className={cn(
              'w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors',
              isSignificantGain
                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Sparkles className="w-4 h-4" />
            {isSignificantGain 
              ? (l === 'fr' ? `Valider (+${potentialGainHours.toFixed(1)}h récupérables)` : `Confirm (+${potentialGainHours.toFixed(1)}h recoverable)`)
              : (l === 'fr' ? 'Valider l\'analyse' : 'Confirm analysis')
            }
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
