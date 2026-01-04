'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuditStore, CompetenceCategory } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { generatePDFReport } from '@/lib/reportGenerator';

// Configuration couleurs catégories de compétences
const COMPETENCE_COLORS: Record<CompetenceCategory, { bg: string; text: string; border: string }> = {
  haptique: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  relationnelle: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  technique: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
};
const COMPETENCE_LABELS: Record<CompetenceCategory, { fr: string; en: string }> = {
  haptique: { fr: 'Haptique', en: 'Haptic' },
  relationnelle: { fr: 'Relationnelle', en: 'Relational' },
  technique: { fr: 'Technique', en: 'Technical' },
};
import { 
  Cpu, Target, Megaphone, CheckCircle2, Circle,
  Zap, Clock, Calendar, RotateCcw, Download,
  ArrowRight, TrendingUp, Compass, GraduationCap,
  User, Users, Shield, ChevronRight,
  Briefcase, Gauge, Crosshair, Hammer, 
  FileOutput, AlertTriangle, Rocket, Settings,
  FileText, BarChart3, Map, Lock, Unlock, LayoutGrid,
  ArrowRightLeft, CheckSquare, XSquare, AlertCircle, DollarSign, Brain,
  ShieldCheck, Wrench, Database, Mail, Sparkles
} from 'lucide-react';

// ===============================================
// CONFIGURATION DES COULEURS PAR SCÉNARIO
// ===============================================

const SCENARIO_CONFIG = {
  augmentation: {
    primary: '#10b981',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    label: { fr: 'POSTE AUGMENTÉ', en: 'AUGMENTED ROLE' },
    focus: { fr: 'Efficience & Pilotage', en: 'Efficiency & Piloting' },
  },
  pivot: {
    primary: '#6366f1',
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    gradient: 'from-indigo-500 to-purple-500',
    label: { fr: 'MUTATION', en: 'CAREER PIVOT' },
    focus: { fr: 'Transférabilité & Métier Refuge', en: 'Transferability & Safe Haven' },
  },
};

const PILLAR_CONFIG = {
  // === PILIERS AUGMENTATION ===
  delegation: {
    icon: Hammer,
    label: { fr: 'Délégation & Efficience', en: 'Delegation & Efficiency' },
    subtitle: { fr: 'Le Nettoyage', en: 'The Cleanup' },
    colorClass: 'emerald',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/30',
    textClass: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    desc: {
      fr: 'Identifier et automatiser les tâches à faible valeur humaine pour libérer du temps productif.',
      en: 'Identify and automate low human-value tasks to free up productive time.',
    },
  },
  reinforcement: {
    icon: Target,
    label: { fr: 'Renforcement de Signature', en: 'Signature Reinforcement' },
    subtitle: { fr: 'Le Muscle', en: 'The Muscle' },
    colorClass: 'amber',
    bgClass: 'bg-amber-500/15',
    borderClass: 'border-amber-500/30',
    textClass: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    desc: {
      fr: 'Plan de montée en compétence sur les Actifs Stratégiques non-automatisables.',
      en: 'Skills development plan for non-automatable Strategic Assets.',
    },
  },
  positioning: {
    icon: Rocket,
    label: { fr: 'Positionnement & Autorité', en: 'Positioning & Authority' },
    subtitle: { fr: 'La Sortie', en: 'The Exit' },
    colorClass: 'blue',
    bgClass: 'bg-blue-500/15',
    borderClass: 'border-blue-500/30',
    textClass: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    desc: {
      augmentation: {
        fr: 'Rédaction d\'un rapport d\'efficience démontrant la valeur du nouveau workflow.',
        en: 'Writing an efficiency report demonstrating the value of the new workflow.',
      },
      pivot: {
        fr: 'Packaging des actifs transférables pour approcher le Métier Refuge identifié.',
        en: 'Packaging transferable assets to approach the identified Safe Haven career.',
      },
    },
  },
  // === PILIERS PIVOT (MUTATION RADICALE) ===
  disengagement: {
    icon: Settings,
    label: { fr: 'Désengagement du Secteur Exposé', en: 'Disengagement from Exposed Sector' },
    subtitle: { fr: 'La Préparation', en: 'The Preparation' },
    colorClass: 'rose',
    bgClass: 'bg-rose-500/15',
    borderClass: 'border-rose-500/30',
    textClass: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
    desc: {
      fr: 'Sécuriser votre sortie du poste actuel sans risque financier. Planifier la transition.',
      en: 'Secure your exit from the current position without financial risk. Plan the transition.',
    },
  },
  oceanBleu: {
    icon: Compass,
    label: { fr: 'Immersion dans l\'Océan Bleu', en: 'Blue Ocean Immersion' },
    subtitle: { fr: 'Le Reskilling', en: 'The Reskilling' },
    colorClass: 'indigo',
    bgClass: 'bg-indigo-500/15',
    borderClass: 'border-indigo-500/30',
    textClass: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20',
    desc: {
      fr: 'Stratégie de reskilling intensif sur 3 mois. Acquérir les compétences du secteur cible.',
      en: 'Intensive 3-month reskilling strategy. Acquire target sector skills.',
    },
  },
  landing: {
    icon: Briefcase,
    label: { fr: 'Atterrissage', en: 'Landing' },
    subtitle: { fr: 'L\'Entrée', en: 'The Entry' },
    colorClass: 'purple',
    bgClass: 'bg-purple-500/15',
    borderClass: 'border-purple-500/30',
    textClass: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
    desc: {
      fr: 'Packager vos actifs et activer votre réseau pour entrer dans le Métier Refuge.',
      en: 'Package your assets and activate your network to enter the Safe Haven career.',
    },
  },
};

const PRIORITY_CONFIG = {
  immediate: {
    icon: Zap,
    label: { fr: 'Immédiat', en: 'Immediate' },
    bgClass: 'bg-rose-500/20',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
  },
  short_term: {
    icon: Clock,
    label: { fr: '1-3 mois', en: '1-3 months' },
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  medium_term: {
    icon: Calendar,
    label: { fr: '3-6 mois', en: '3-6 months' },
    bgClass: 'bg-blue-500/20',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
  },
};

// ===============================================
// COMPOSANT PRINCIPAL
// ===============================================

export function Step8Roadmap() {
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  const router = useRouter();
  
  const { 
    context, 
    tasks,
    talents,
    software,
    strategy, 
    computedKPIs,
    toggleRoadmapAction,
    setStep,
    reset,
    computeKPIs,
    enterpriseTargets,
    phantomCharge,
    getPhantomChargeGain,
  } = useAuditStore();
  
  // Calcul du gisement de temps (Phantom Charge)
  const phantomGain = getPhantomChargeGain();
  const showPhantomChargeSection = phantomGain.isSignificant && phantomCharge.isEnabled;
  
  // Recalculer les KPIs à chaque rendu
  useEffect(() => {
    computeKPIs();
  }, [computeKPIs, tasks, talents, strategy]);
  
  const isAugmentation = context.goal === 'augmentation';
  const isPivot = context.goal === 'pivot';
  const isReclassement = context.goal === 'reclassement';
  const colors = isAugmentation ? SCENARIO_CONFIG.augmentation : SCENARIO_CONFIG.pivot;
  
  // Données Job Designer - Employee Matches avec gaps de compétences
  const employeeMatches = enterpriseTargets.employeeMatches || [];
  const matchesWithGaps = employeeMatches.filter(m => m.competenceGaps.length > 0);

  // Définir les piliers selon le parcours
  const pillarKeys = useMemo(() => {
    if (isPivot) {
      return ['disengagement', 'oceanBleu', 'landing'] as const;
    }
    return ['delegation', 'reinforcement', 'positioning'] as const;
  }, [isPivot]);

  // Grouper les actions par pilier
  const actionsByPillar = useMemo(() => {
    const grouped: Record<string, typeof strategy.roadmap> = {};
    
    // Initialiser tous les piliers possibles
    ['delegation', 'reinforcement', 'positioning', 'disengagement', 'oceanBleu', 'landing'].forEach(p => {
      grouped[p] = [];
    });
    
    strategy.roadmap.forEach(action => {
      if (grouped[action.pillar]) {
        grouped[action.pillar].push(action);
      }
    });
    
    return grouped;
  }, [strategy.roadmap]);

  // Stats de progression
  const completedCount = strategy.roadmap.filter(a => a.completed).length;
  const totalCount = strategy.roadmap.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Données calculées pour le Business Model
  const selectedTalents = talents.filter(t => t.selected);
  const topTalents = [...selectedTalents].sort((a, b) => b.level - a.level).slice(0, 2);
  
  // ===============================================
  // CALCULS DYNAMIQUES - DONNÉES DU STORE
  // ===============================================
  
  // Tâches vulnérables avec scores détaillés
  const tasksWithScores = useMemo(() => {
    return [...tasks]
      .map(t => ({
        ...t,
        avgScore: (t.resilience.donnees + t.resilience.decision + t.resilience.relationnel + t.resilience.creativite + t.resilience.execution) / 5,
        vulnerabilityPercent: 100 - Math.round((t.resilience.donnees + t.resilience.decision + t.resilience.relationnel + t.resilience.creativite + t.resilience.execution) / 5)
      }))
      .sort((a, b) => a.avgScore - b.avgScore);
  }, [tasks]);

  // LA tâche la plus vulnérable (Pilier 1 - titre dynamique)
  const mostVulnerableTask = tasksWithScores[0] || null;
  
  // Les 2 tâches les plus vulnérables
  const vulnerableTasks = tasksWithScores.slice(0, 2);

  // LE talent avec le score le plus bas du Top 5 (Pilier 2 - titre dynamique)
  const lowestScoredTalent = useMemo(() => {
    if (selectedTalents.length === 0) return null;
    return [...selectedTalents].sort((a, b) => a.level - b.level)[0];
  }, [selectedTalents]);

  // Temps potentiellement libérable
  const timeToFree = vulnerableTasks.reduce((acc, t) => acc + t.hoursPerWeek, 0);
  
  // Gain annuel estimé (52 semaines)
  const annualTimeGain = timeToFree * 52;
  
  // Équivalent en jours de travail (7h/jour)
  const daysEquivalent = Math.round(annualTimeGain / 7);

  // KPIs Opérationnels par Pilier
  const pillarKPIs = useMemo(() => {
    // Pilier 1 : Délégation — Potentiel de gain de temps
    const delegationTimeGain = strategy.eracActions
      .filter(a => a.category === 'eliminate' || a.category === 'reduce')
      .reduce((acc, a) => acc + (a.timeFreed || 0), 0);
    
    // Pilier 2 : Renforcement — Actifs à développer
    const talentsToReinforce = selectedTalents.filter(t => t.level < 4).length;
    const highValueTasksCount = tasks.filter(t => {
      const avg = (t.resilience.relationnel + t.resilience.decision + t.resilience.creativite) / 3;
      return avg > 60;
    }).length;

    // Pilier 3 : Positionnement — Indicateur d'autorité métier
    const authorityScore = isAugmentation
      ? Math.min(100, Math.round((selectedTalents.length * 15) + (delegationTimeGain * 5)))
      : strategy.gapAnalysis?.viabilityScore || 0;

    // KPIs Pivot
    const skillsToKeep = strategy.gapAnalysis?.bridge.toKeep?.length || strategy.gapAnalysis?.bridge.skillsToTransfer.length || 0;
    const skillsToAcquire = strategy.gapAnalysis?.bridge.toAcquire?.length || strategy.gapAnalysis?.bridge.skillsToAcquire.length || 0;
    const networkReadiness = strategy.gapAnalysis?.transitionMetrics?.networkReadiness || 40;

    return {
      // Piliers Augmentation
    delegation: {
        value: delegationTimeGain,
        unit: 'h/sem',
        label: { fr: 'Potentiel gain de temps', en: 'Time saving potential' },
    },
    reinforcement: {
        value: talentsToReinforce,
        unit: l === 'fr' ? 'actifs' : 'assets',
        label: { fr: 'Actifs à développer', en: 'Assets to develop' },
        secondary: { value: highValueTasksCount, label: { fr: 'tâches haute valeur', en: 'high-value tasks' } },
    },
    positioning: {
        value: authorityScore,
        unit: '%',
        label: isAugmentation 
          ? { fr: 'Potentiel d\'autorité', en: 'Authority potential' }
          : { fr: 'Viabilité transition', en: 'Transition viability' },
      },
      // Piliers Pivot (Mutation Radicale)
      disengagement: {
        value: strategy.gapAnalysis?.transitionMetrics?.financialRunway || '6 mois',
        unit: '',
        label: { fr: 'Runway de sécurité', en: 'Safety runway' },
      },
      oceanBleu: {
        value: skillsToAcquire,
        unit: l === 'fr' ? 'skills' : 'skills',
        label: { fr: 'Compétences à acquérir', en: 'Skills to acquire' },
      },
      landing: {
        value: networkReadiness,
        unit: '%',
        label: { fr: 'Réseau activé', en: 'Network activated' },
      },
    };
  }, [strategy.eracActions, strategy.gapAnalysis, selectedTalents, tasks, isAugmentation, l]);

  // Export handler
  // Export PDF complet
  const handleExportPDF = useCallback(() => {
    generatePDFReport({
      context,
      tasks,
      talents,
      software,
      strategy,
      computedKPIs,
      generatedAt: new Date().toISOString(),
    }, l as 'fr' | 'en');
  }, [context, tasks, talents, software, strategy, computedKPIs, l]);

  // Export JSON (backup)
  const handleExportJSON = useCallback(() => {
    const exportData = {
      context: {
        jobTitle: context.jobTitle,
        persona: context.persona,
        goal: context.goal,
        industry: context.industry,
        yearsExperience: context.yearsExperience,
        teamSize: context.teamSize,
      },
      audit: {
        tasks: tasks.map(t => ({
          name: t.name,
          hoursPerWeek: t.hoursPerWeek,
          resilience: t.resilience,
        })),
        talents: selectedTalents.map(t => ({
          name: t.name,
          level: t.level,
        })),
      },
      strategy: {
        businessModel: strategy.businessModel,
        ikigai: strategy.ikigai,
        roadmap: strategy.roadmap,
        eracActions: strategy.eracActions,
        nicheOpportunities: strategy.nicheOpportunities,
        gapAnalysis: strategy.gapAnalysis,
      },
      kpis: computedKPIs,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-strategie-${context.jobTitle?.replace(/\s+/g, '-').toLowerCase() || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [context, tasks, selectedTalents, strategy, computedKPIs]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* =============================================== */}
      {/* HEADER - Scénario Badge */}
      {/* =============================================== */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-sm font-bold mb-4 ${colors.bg} ${colors.text} border ${colors.border}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {isAugmentation ? <Settings className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
          <span className="tracking-wide">{colors.label[l]}</span>
          <span className="w-px h-4 bg-current opacity-30" />
          <span className="font-normal opacity-80">{colors.focus[l]}</span>
        </motion.div>
        
        <h1 className="apex-title text-3xl mb-3">
          {l === 'fr' ? 'Plan d\'Action Opérationnel' : 'Operational Action Plan'}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {l === 'fr' 
            ? 'Roadmap personnalisée issue de votre audit. Actions concrètes, KPIs mesurables.'
            : 'Personalized roadmap from your audit. Concrete actions, measurable KPIs.'}
        </p>
      </motion.div>

      {/* =============================================== */}
      {/* MODULE 1 : DIAGNOSTIC DE POSITIONNEMENT */}
      {/* (Business Model You - 4 Cartes) */}
      {/* =============================================== */}
      <motion.div
        className={`apex-card p-6 border-l-4 ${colors.border}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
            <Crosshair className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div>
            <h2 className="font-serif text-xl text-slate-200">
              {l === 'fr' ? 'Diagnostic de Positionnement' : 'Positioning Diagnostic'}
            </h2>
            <p className="text-sm text-slate-500">
              {l === 'fr' ? 'Votre proposition de valeur en 4 dimensions' : 'Your value proposition in 4 dimensions'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CARTE 1 : Valeur Unique */}
          <motion.div
            className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/50 border border-slate-700/50 relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
                {l === 'fr' ? 'Valeur Unique' : 'Core Value'}
              </h3>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              {strategy.businessModel.coreValue || '-'}
            </p>
            <p className="text-xs text-slate-500 mt-2 italic">
              {l === 'fr' 
                ? 'Croisement de vos meilleurs talents et tâches résilientes'
                : 'Intersection of your best talents and resilient tasks'}
            </p>
          </motion.div>

          {/* CARTE 2 : Audience Cible */}
          <motion.div
            className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/50 border border-slate-700/50 relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
                {l === 'fr' ? 'Audience Cible' : 'Target Audience'}
              </h3>
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              {strategy.businessModel.targetAudience || '-'}
            </p>
            <p className="text-xs text-slate-500 mt-2 italic">
              {l === 'fr' 
                ? 'Qui bénéficie de votre augmentation'
                : 'Who benefits from your augmentation'}
            </p>
          </motion.div>

          {/* CARTE 3 : Différenciateur */}
          <motion.div
            className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/50 border border-slate-700/50 relative overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-full" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
                {l === 'fr' ? 'Différenciateur' : 'Differentiator'}
              </h3>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              {strategy.businessModel.uniqueDifferentiator || '-'}
            </p>
            <p className="text-xs text-slate-500 mt-2 italic">
              {l === 'fr' 
                ? 'Pourquoi l\'automatisation ne peut pas vous remplacer ici'
                : 'Why automation cannot replace you here'}
            </p>
          </motion.div>

          {/* CARTE 4 : Mode de Livraison */}
          <motion.div
            className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/50 border border-slate-700/50 relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-bl-full" />
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Settings className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
                {l === 'fr' ? 'Mode de Livraison' : 'Delivery Method'}
              </h3>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              {strategy.businessModel.deliveryMethod || '-'}
            </p>
            <p className="text-xs text-slate-500 mt-2 italic">
              {l === 'fr' 
                ? 'Posture adoptée : Arbitrage, Supervision, Expertise'
                : 'Adopted stance: Arbitration, Supervision, Expertise'}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* =============================================== */}
      {/* QUICK STATS - Calcul de gain dynamique */}
      {/* =============================================== */}
      {timeToFree > 0 && (
        <motion.div
          className="space-y-4 py-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
        >
          {/* Résumé du gain */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">{timeToFree}h<span className="text-sm font-normal text-slate-500">/sem</span></p>
                <p className="text-xs text-slate-500">
                  {l === 'fr' ? 'Temps libérable' : 'Time to free'}
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600" />

            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">{annualTimeGain}h<span className="text-sm font-normal text-slate-500">/an</span></p>
                <p className="text-xs text-slate-500">
                  {l === 'fr' ? `≈ ${daysEquivalent} jours de travail` : `≈ ${daysEquivalent} work days`}
                </p>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-600" />

            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-200">+{timeToFree}h<span className="text-sm font-normal text-slate-500">/sem</span></p>
                <p className="text-xs text-slate-500">
                  {l === 'fr' ? 'Sur haute valeur' : 'On high value'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Détails des sources de gain */}
          {mostVulnerableTask && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <Hammer className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-slate-400">
                  {l === 'fr' ? 'Cible prioritaire :' : 'Priority target:'}
          </span>
                <span className="text-rose-300 font-medium">{mostVulnerableTask.name}</span>
                <span className="text-slate-500">({mostVulnerableTask.vulnerabilityPercent}% {l === 'fr' ? 'vulnérable' : 'vulnerable'})</span>
              </div>
              {lowestScoredTalent && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">
                    {l === 'fr' ? 'Actif à renforcer :' : 'Asset to reinforce:'}
          </span>
                  <span className="text-blue-300 font-medium">{lowestScoredTalent.name}</span>
                  <span className="text-slate-500">({lowestScoredTalent.level}/5)</span>
        </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* =============================================== */}
      {/* MODULE TRIAGE INTELLIGENT - PHANTOM CHARGE */}
      {/* Affiché si gain > 2h/semaine (10h/mois) */}
      {/* =============================================== */}
      {showPhantomChargeSection && (
        <motion.div
          className="apex-card p-6 border-2 border-blue-500/30 bg-gradient-to-br from-blue-900/10 to-indigo-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center border border-blue-400/30">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-slate-200">
                  {l === 'fr' ? 'Triage Intelligent & Morning Brief IA' : 'Smart Triage & AI Morning Brief'}
                </h2>
                <p className="text-sm text-blue-300/70">
                  {l === 'fr' 
                    ? 'Automatisation de vos flux administratifs'
                    : 'Automation of your administrative flows'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-400">
                  +{phantomGain.monthlyHours.toFixed(0)}h
                </p>
                <p className="text-xs text-slate-400">
                  /{l === 'fr' ? 'mois libérées' : 'month freed'}
                </p>
              </div>
            </div>
          </div>

          {/* Message de validation stratégique */}
          {phantomGain.monthlyHours >= 10 && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-300 text-center font-medium">
                {l === 'fr' 
                  ? '✓ Votre transition est entièrement financée par le temps gagné sur vos flux administratifs.'
                  : '✓ Your transition is entirely funded by time saved on your administrative flows.'}
              </p>
            </div>
          )}

          {/* Micro-Steps du Triage Intelligent */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4" />
              {l === 'fr' ? 'Plan de mise en place' : 'Implementation Plan'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 : Filtres automatiques */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">1</div>
                  <span className="font-medium text-blue-400">
                    {l === 'fr' ? 'Filtres Automatiques' : 'Automatic Filters'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  {l === 'fr' 
                    ? 'Configuration des règles de tri et d\'archivage automatique'
                    : 'Configure sorting and automatic archiving rules'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{l === 'fr' ? '2-4 heures' : '2-4 hours'}</span>
                </div>
              </div>
              
              {/* Step 2 : Templates IA */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">2</div>
                  <span className="font-medium text-amber-400">
                    {l === 'fr' ? 'Templates de Réponse IA' : 'AI Response Templates'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  {l === 'fr' 
                    ? 'Création de modèles pour les réponses récurrentes (ChatGPT, Claude)'
                    : 'Create templates for recurring responses (ChatGPT, Claude)'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{l === 'fr' ? '3-5 heures' : '3-5 hours'}</span>
                </div>
              </div>
              
              {/* Step 3 : Résumé quotidien */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">3</div>
                  <span className="font-medium text-emerald-400">
                    {l === 'fr' ? 'Morning Brief IA' : 'AI Morning Brief'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  {l === 'fr' 
                    ? 'Installation d\'un outil de résumé quotidien (Superhuman, SaneBox)'
                    : 'Install a daily summary tool (Superhuman, SaneBox)'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{l === 'fr' ? '1-2 heures' : '1-2 hours'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Summary */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <TrendingUp className="w-4 h-4" />
                <span>{l === 'fr' ? 'ROI estimé' : 'Estimated ROI'}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500">
                  {l === 'fr' ? 'Investissement :' : 'Investment:'} 6-11h
                </span>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <span className="text-emerald-400 font-bold">
                  +{(phantomGain.monthlyHours * 12).toFixed(0)}h/{l === 'fr' ? 'an' : 'year'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* =============================================== */}
      {/* LE PONT DE COMPÉTENCES - PIVOT ONLY */}
      {/* Tableau comparatif enrichi */}
      {/* =============================================== */}
      {isPivot && strategy.gapAnalysis && (
          <motion.div
          className="apex-card p-6 border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-900/10 to-purple-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Header avec Score de Viabilité */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border border-indigo-400/30">
                <Map className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-slate-200">
                  {l === 'fr' ? 'Le Pont de Compétences' : 'Skills Bridge'}
                </h2>
                <p className="text-sm text-indigo-300">
                  {l === 'fr' 
                    ? `${strategy.gapAnalysis.currentState.role} → ${strategy.gapAnalysis.targetState.role}`
                    : `${strategy.gapAnalysis.currentState.role} → ${strategy.gapAnalysis.targetState.role}`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex flex-col items-center px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30`}>
                <span className="text-2xl font-bold text-indigo-400">
                  {strategy.gapAnalysis.viabilityScore}%
                </span>
                <span className="text-xs text-slate-400">
                  {l === 'fr' ? 'Viabilité' : 'Viability'}
                </span>
              </div>
              <div className={`flex flex-col items-center px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50`}>
                <span className="text-lg font-bold text-slate-300">
                  {strategy.gapAnalysis.bridge.estimatedTimeline}
                </span>
                <span className="text-xs text-slate-500">
                  {l === 'fr' ? 'Durée' : 'Timeline'}
                </span>
              </div>
            </div>
          </div>

          {/* Tableau comparatif : À GARDER / À ACQUÉRIR / À ABANDONNER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            
            {/* À GARDER */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-400">
                    {l === 'fr' ? 'À GARDER' : 'TO KEEP'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {l === 'fr' ? 'Talents transférables' : 'Transferable talents'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {strategy.gapAnalysis.bridge.toKeep?.slice(0, 3).map((item, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-900/30 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-200 font-medium">{item.skill}</span>
                      <span className="text-xs text-emerald-400">{item.currentLevel}/5</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{item.rationale}</p>
                  </div>
                )) || strategy.gapAnalysis.bridge.skillsToTransfer.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/30">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span className="text-sm text-slate-300">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* À ACQUÉRIR */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-amber-400">
                    {l === 'fr' ? 'À ACQUÉRIR' : 'TO ACQUIRE'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {l === 'fr' ? 'Compétences sectorielles' : 'Sector skills'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {strategy.gapAnalysis.bridge.toAcquire?.slice(0, 3).map((item, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-900/30 border border-slate-700/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-200 font-medium">{item.skill}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        item.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                        item.priority === 'important' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {item.priority === 'critical' ? '!' : item.priority === 'important' ? '~' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{item.timeToAcquire}</span>
                      <span>{item.method}</span>
                    </div>
                  </div>
                )) || strategy.gapAnalysis.bridge.skillsToAcquire.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/30">
                    <Unlock className="w-3 h-3 text-amber-400" />
                    <span className="text-sm text-slate-300">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* À ABANDONNER */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <XSquare className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-medium text-rose-400">
                    {l === 'fr' ? 'À ABANDONNER' : 'TO ABANDON'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {l === 'fr' ? 'Réflexes du poste exposé' : 'Exposed role habits'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {strategy.gapAnalysis.bridge.toAbandon?.slice(0, 3).map((item, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-900/30 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-200 font-medium line-through opacity-70">{item.habit}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">{item.reason}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <ArrowRightLeft className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">{item.replacement}</span>
                    </div>
                  </div>
                )) || strategy.gapAnalysis.currentState.vulnerabilities?.slice(0, 3).map((v, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/30">
                    <XSquare className="w-3 h-3 text-rose-400" />
                    <span className="text-sm text-slate-300 line-through opacity-70">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Métriques de Transition */}
          {strategy.gapAnalysis.transitionMetrics && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
              <div className="text-center p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-sm font-bold text-slate-200">{strategy.gapAnalysis.transitionMetrics.financialRunway}</p>
                <p className="text-[10px] text-slate-500">
                  {l === 'fr' ? 'Runway Financier' : 'Financial Runway'}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-sm font-bold text-slate-200">{strategy.gapAnalysis.transitionMetrics.networkReadiness}%</p>
                <p className="text-[10px] text-slate-500">
                  {l === 'fr' ? 'Réseau Cible' : 'Target Network'}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-sm font-bold text-slate-200">{strategy.gapAnalysis.transitionMetrics.mentalReadiness}%</p>
                <p className="text-[10px] text-slate-500">
                  {l === 'fr' ? 'Préparation' : 'Readiness'}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* =============================================== */}
      {/* GAP DE COMPÉTENCES - RECLASSEMENT ONLY */}
      {/* Exigences entreprise vs Profils collaborateurs */}
      {/* =============================================== */}
      {isReclassement && matchesWithGaps.length > 0 && (
        <motion.div
          className="apex-card p-6 border-2 border-rose-500/30 bg-gradient-to-br from-rose-900/10 to-violet-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/30 to-violet-500/30 flex items-center justify-center border border-rose-400/30">
                <Map className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-slate-200">
                  {l === 'fr' ? 'Gap de Compétences — Exigences Stratégiques' : 'Competency Gap — Strategic Requirements'}
                </h2>
                <p className="text-sm text-rose-300/70">
                  {l === 'fr' 
                    ? `${matchesWithGaps.length} collaborateur(s) avec écarts identifiés`
                    : `${matchesWithGaps.length} employee(s) with identified gaps`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div className="text-right">
                <p className="text-lg font-bold text-amber-400">
                  {matchesWithGaps.reduce((acc, m) => acc + m.competenceGaps.reduce((a, g) => a + g.trainingHours, 0), 0)}h
                </p>
                <p className="text-xs text-slate-400">
                  {l === 'fr' ? 'Formation totale' : 'Total training'}
                </p>
              </div>
            </div>
          </div>

          {/* Liste des collaborateurs avec leurs gaps */}
          <div className="space-y-4">
            {matchesWithGaps.slice(0, 5).map((match) => (
              <div 
                key={`${match.employeeId}-${match.futureJobId}`}
                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">{match.employeeName}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Target className="w-3 h-3" /> {match.futureJobTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      match.compatibilityScore >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                      match.compatibilityScore >= 50 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {match.compatibilityScore}%
                    </span>
                  </div>
                </div>

                {/* Gaps du collaborateur */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {match.competenceGaps.map((gap) => {
                    const catColor = COMPETENCE_COLORS[gap.category];
                    return (
                      <div 
                        key={gap.competenceId}
                        className={`p-3 rounded-lg bg-slate-800/30 border ${catColor.border}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${catColor.bg} ${catColor.text}`}>
                            {COMPETENCE_LABELS[gap.category][l]}
                          </span>
                          <span className="text-xs text-amber-400 font-medium">{gap.trainingHours}h</span>
                        </div>
                        <p className="text-sm text-slate-300 font-medium mb-1">{gap.competenceName}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>Niveau {gap.currentLevel}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span className="text-emerald-400">Niveau {gap.requiredLevel}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {matchesWithGaps.length > 5 && (
            <p className="text-center text-sm text-slate-500 mt-4">
              {l === 'fr' 
                ? `+ ${matchesWithGaps.length - 5} autres collaborateurs avec gaps`
                : `+ ${matchesWithGaps.length - 5} more employees with gaps`
              }
            </p>
          )}

          {/* Plan de Reskilling Stratégique */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              {l === 'fr' ? 'Stratégie de Reskilling Recommandée' : 'Recommended Reskilling Strategy'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phase 1 : Évaluation */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                  <span className="font-medium text-blue-400">{l === 'fr' ? 'Évaluation' : 'Assessment'}</span>
                </div>
                <p className="text-sm text-slate-400">
                  {l === 'fr' 
                    ? 'Valider les portraits de mutation avec entretiens individuels'
                    : 'Validate mutation portraits with individual interviews'
                  }
                </p>
                <div className="mt-2 text-xs text-slate-500">
                  {l === 'fr' ? 'Durée: 2-4 semaines' : 'Duration: 2-4 weeks'}
                </div>
              </div>
              
              {/* Phase 2 : Formation */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">2</div>
                  <span className="font-medium text-amber-400">{l === 'fr' ? 'Formation' : 'Training'}</span>
                </div>
                <p className="text-sm text-slate-400">
                  {l === 'fr' 
                    ? 'Parcours de reskilling personnalisés par collaborateur'
                    : 'Personalized reskilling paths per employee'
                  }
                </p>
                <div className="mt-2 text-xs text-slate-500">
                  {l === 'fr' 
                    ? `Budget estimé: ${matchesWithGaps.reduce((acc, m) => acc + m.competenceGaps.reduce((a, g) => a + g.trainingHours, 0), 0)}h`
                    : `Estimated budget: ${matchesWithGaps.reduce((acc, m) => acc + m.competenceGaps.reduce((a, g) => a + g.trainingHours, 0), 0)}h`
                  }
                </div>
              </div>
              
              {/* Phase 3 : Transition */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">3</div>
                  <span className="font-medium text-emerald-400">{l === 'fr' ? 'Transition' : 'Transition'}</span>
                </div>
                <p className="text-sm text-slate-400">
                  {l === 'fr' 
                    ? 'Affectation aux postes cibles avec période d\'accompagnement'
                    : 'Assignment to target positions with support period'
                  }
                </p>
                <div className="mt-2 text-xs text-slate-500">
                  {l === 'fr' ? 'Durée: 1-3 mois' : 'Duration: 1-3 months'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* =============================================== */}
      {/* PROGRESS BAR */}
      {/* =============================================== */}
      <motion.div
        className="apex-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 font-medium">
            {l === 'fr' ? 'Progression du Plan' : 'Plan Progress'}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${colors.text}`}>{progressPercent}%</span>
            <span className="text-slate-500">({completedCount}/{totalCount})</span>
          </div>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${colors.gradient}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* =============================================== */}
      {/* LES 3 PILIERS - ACTIONS CHECKBOXES */}
      {/* Piliers Augmentation: delegation, reinforcement, positioning */}
      {/* Piliers Pivot: disengagement, oceanBleu, landing */}
      {/* =============================================== */}
      <div className="space-y-6">
        {pillarKeys.map((pillarKey, pillarIndex) => {
          const config = PILLAR_CONFIG[pillarKey];
          const Icon = config.icon;
          const actions = actionsByPillar[pillarKey];
          const pillarDesc = typeof config.desc === 'object' && 'augmentation' in config.desc
            ? config.desc[isAugmentation ? 'augmentation' : 'pivot'][l]
            : (config.desc as { fr: string; en: string })[l];
          
          return (
            <motion.div
              key={pillarKey}
              className="apex-card overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + pillarIndex * 0.1 }}
            >
              {/* Pillar Header */}
              <div className={`p-5 border-b border-slate-800/50 ${config.bgClass}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${config.iconBg} border ${config.borderClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.textClass}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <div className="flex items-center gap-3">
                        <h2 className="font-serif text-lg text-slate-200">
                          {l === 'fr' ? `Pilier ${pillarIndex + 1}` : `Pillar ${pillarIndex + 1}`}
                          <span className={`ml-2 ${config.textClass}`}>— {config.label[l]}</span>
                    </h2>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700/50 text-slate-400 font-medium">
                          {config.subtitle[l]}
                        </span>
                      </div>
                      {/* KPI Opérationnel */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgClass} border ${config.borderClass}`}>
                        <span className={`text-lg font-bold ${config.textClass}`}>
                          {pillarKPIs[pillarKey].value}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {pillarKPIs[pillarKey].unit}
                        </span>
                        <span className="text-slate-500 text-[10px] hidden sm:inline">
                          {pillarKPIs[pillarKey].label[l]}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      {pillarDesc}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions List - Checkboxes Style */}
              <div className="p-4">
                <AnimatePresence>
                  {actions.map((action, actionIndex) => {
                    const priorityConfig = PRIORITY_CONFIG[action.priority];
                    const PriorityIcon = priorityConfig.icon;
                    
                    return (
                      <motion.div
                        key={action.id}
                        className={`group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer mb-3 last:mb-0 ${
                          action.completed 
                            ? 'bg-slate-800/20 border-slate-800/50 opacity-60'
                            : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60'
                        }`}
                        onClick={() => toggleRoadmapAction(action.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: actionIndex * 0.05 }}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                      >
                          {/* Checkbox */}
                        <div className="pt-0.5 flex-shrink-0">
                          <motion.div
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                              action.completed
                                ? `${config.bgClass} ${config.borderClass}`
                                : 'border-slate-600 group-hover:border-slate-500'
                            }`}
                            animate={action.completed ? { scale: [1, 1.2, 1] } : {}}
                          >
                            {action.completed && (
                              <CheckCircle2 className={`w-4 h-4 ${config.textClass}`} />
                            )}
                          </motion.div>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-medium ${action.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                {action.title}
                              </h3>
                              {action.eracCategory && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  action.eracCategory === 'eliminate' ? 'bg-rose-500/20 text-rose-400' :
                                  action.eracCategory === 'reduce' ? 'bg-amber-500/20 text-amber-400' :
                                  action.eracCategory === 'raise' ? 'bg-emerald-500/20 text-emerald-400' :
                                  'bg-blue-500/20 text-blue-400'
                                }`}>
                                  {action.eracCategory === 'eliminate' ? 'É' :
                                   action.eracCategory === 'reduce' ? 'R' :
                                   action.eracCategory === 'raise' ? 'A' : 'C'}
                                </span>
                              )}
                          </div>
                          
                          {/* Priority Badge */}
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${priorityConfig.bgClass} ${priorityConfig.textClass} border ${priorityConfig.borderClass}`}>
                            <PriorityIcon className="w-3 h-3" />
                            {priorityConfig.label[l]}
                            </div>
                          </div>
                          
                          <p className={`text-sm leading-relaxed ${action.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                            {action.description}
                          </p>
                          
                          {/* KPI + Resilience Score + Suggested Tool */}
                          <div className="flex flex-wrap items-center gap-3 mt-2 pt-2 border-t border-slate-700/30">
                            {action.kpi && (
                              <div className="flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-xs text-slate-500">
                                  <span className="font-medium">KPI:</span> {action.kpi}
                                </span>
                              </div>
                            )}
                            
                            {/* Score de Résilience (1-10) */}
                            {action.resilienceScore && (
                              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                                action.resilienceScore >= 9 ? 'bg-emerald-500/15 text-emerald-400' :
                                action.resilienceScore >= 7 ? 'bg-amber-500/15 text-amber-400' :
                                'bg-slate-500/15 text-slate-400'
                              }`}>
                                <ShieldCheck className="w-3 h-3" />
                                <span className="text-[10px] font-medium">
                                  {l === 'fr' ? 'Résilience' : 'Resilience'}: {action.resilienceScore}/10
                                </span>
                              </div>
                            )}
                            
                            {/* Outil Suggéré */}
                            {action.suggestedTool && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400">
                                <Wrench className="w-3 h-3" />
                                <span className="text-[10px]">{action.suggestedTool}</span>
                              </div>
                            )}
                            
                            {/* Source des Données */}
                            {action.sourceData && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-700/30 text-slate-500">
                                <Database className="w-3 h-3" />
                                <span className="text-[10px]">{action.sourceData}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {actions.length === 0 && (
                  <div className="text-center py-6">
                    <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500">
                      {l === 'fr' ? 'Aucune action générée pour ce pilier.' : 'No actions generated for this pillar.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =============================================== */}
      {/* EXPORT CTA */}
      {/* =============================================== */}
      <motion.div
        className={`apex-card p-8 text-center bg-gradient-to-br from-slate-900/90 to-slate-800/50 border ${colors.border}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <FileOutput className={`w-12 h-12 ${colors.text} mx-auto mb-4`} />
        <h2 className="font-serif text-2xl text-slate-200 mb-3">
          {l === 'fr' ? 'Exportez Votre Synthèse Stratégique' : 'Export Your Strategic Summary'}
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-6">
          {l === 'fr' 
            ? 'Compilez l\'Audit + la Matrice Ikigai + ce Plan d\'Action dans un document de synthèse complet.'
            : 'Compile the Audit + Ikigai Matrix + this Action Plan into a complete summary document.'}
        </p>
        
        {/* KPIs Automatiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
          <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
            <div className={`text-2xl font-bold ${colors.text}`}>+{computedKPIs.productivityGainPercent}%</div>
            <div className="text-xs text-slate-500">{l === 'fr' ? 'Productivité' : 'Productivity'}</div>
          </div>
          <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
            <div className={`text-2xl font-bold ${colors.text}`}>{computedKPIs.timeROI}h</div>
            <div className="text-xs text-slate-500">{l === 'fr' ? 'Temps libéré/an' : 'Time saved/year'}</div>
          </div>
          <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
            <div className={`text-2xl font-bold ${colors.text}`}>{computedKPIs.riskReductionScore}/100</div>
            <div className="text-xs text-slate-500">{l === 'fr' ? 'Réduction risque' : 'Risk reduction'}</div>
          </div>
          <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
            <div className={`text-2xl font-bold ${colors.text}`}>{computedKPIs.marketPositioningScore}/100</div>
            <div className="text-xs text-slate-500">{l === 'fr' ? 'Positionnement' : 'Positioning'}</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={handleExportPDF}
            className={`apex-button flex items-center gap-2 px-6 py-3 font-semibold ${colors.bg} hover:opacity-90 ${colors.text} border ${colors.border}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText className="w-5 h-5" />
            {l === 'fr' ? 'Exporter PDF' : 'Export PDF'}
          </motion.button>
          
          <motion.button
            onClick={handleExportJSON}
            className="apex-button flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BarChart3 className="w-4 h-4" />
            {l === 'fr' ? 'Export JSON' : 'Export JSON'}
          </motion.button>

          {/* Bouton Hub - Retour au Centre de Commandement */}
          <motion.button
            onClick={() => router.push('/hub')}
            className="apex-button flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LayoutGrid className="w-4 h-4" />
            {l === 'fr' ? 'Retour au Hub' : 'Back to Hub'}
          </motion.button>
          
          <motion.button
            onClick={() => {
              reset();
              router.push('/audit');
            }}
            className="apex-button flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            {l === 'fr' ? 'Nouvel Audit' : 'New Audit'}
          </motion.button>
        </div>
      </motion.div>

      {/* Footer Méthodologique */}
      <motion.div
        className="mt-8 pt-6 border-t border-slate-800/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex flex-col items-center gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <span>
              {l === 'fr'
                ? 'Méthodologie : ERAC (Blue Ocean Strategy) • Business Model You • Roadmap Opérationnelle'
                : 'Methodology: ERAC (Blue Ocean Strategy) • Business Model You • Operational Roadmap'}
            </span>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
          </div>
          <p className="text-slate-700 text-[10px] max-w-lg text-center">
            {l === 'fr'
              ? 'Cet audit utilise les standards de management stratégique ERAC (W. Chan Kim & Renée Mauborgne) et Business Model You (Tim Clark, Alexander Osterwalder).'
              : 'This audit uses ERAC strategic management standards (W. Chan Kim & Renée Mauborgne) and Business Model You (Tim Clark, Alexander Osterwalder).'}
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <NavigationButtons
        onPrev={() => setStep(7)}
        showNext={false}
        prevLabel={l === 'fr' ? '← Retour à la Matrice Ikigai' : '← Back to Ikigai Matrix'}
      />
    </motion.div>
  );
}
