'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuditStore, MUTATION_DRIVERS, MutationDriver } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { EmployeeMatchResults } from '@/components/EmployeeMatchResults';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Area, ComposedChart, ReferenceLine, AreaChart
} from 'recharts';
import { 
  Target, Shield, TrendingUp, Zap, Sparkles, ArrowRight,
  CheckCircle2, AlertTriangle, Trash2, Minus, Plus, Lightbulb,
  Brain, Users, DollarSign, Compass, Crosshair, Rocket, 
  Map, Heart, Key, Star, BarChart3, ArrowUpRight, Lock
} from 'lucide-react';

// Configuration des couleurs par scénario
const SCENARIO_COLORS = {
  augmentation: {
    primary: '#10b981', // Emerald
    secondary: '#34d399',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
  },
  pivot: {
    primary: '#6366f1', // Indigo
    secondary: '#818cf8',
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    gradient: 'from-indigo-500 to-purple-500',
  },
};

// Labels ERAC
const ERAC_LABELS = {
  eliminate: { fr: 'Éliminer', en: 'Eliminate', icon: Trash2, color: 'text-rose-400', bg: 'bg-rose-500/20' },
  reduce: { fr: 'Réduire', en: 'Reduce', icon: Minus, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  raise: { fr: 'Augmenter', en: 'Raise', icon: Plus, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  create: { fr: 'Créer', en: 'Create', icon: Lightbulb, color: 'text-blue-400', bg: 'bg-blue-500/20' },
};

export function Step7Ikigai() {
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  const router = useRouter();
  
  const { 
    context, 
    strategy, 
    generateStrategy, 
    setStep,
    getSelectedTalents,
    setMutationDrivers
  } = useAuditStore();
  
  const selectedTalents = getSelectedTalents();
  const isAugmentation = context.goal === 'augmentation';
  const isPivot = context.goal === 'pivot';
  const isReclassement = context.goal === 'reclassement';
  const colors = isAugmentation ? SCENARIO_COLORS.augmentation : SCENARIO_COLORS.pivot;
  
  // État local pour le filtre d'aspiration (Pivot uniquement)
  const [selectedDrivers, setSelectedDrivers] = useState<MutationDriver[]>(
    context.mutationDrivers || []
  );
  const [showMutationFilter, setShowMutationFilter] = useState(
    isPivot && (!context.mutationDrivers || context.mutationDrivers.length === 0)
  );

  // Générer la stratégie au montage
  useEffect(() => {
    if (!strategy.generatedAt) {
      generateStrategy();
    }
  }, [strategy.generatedAt, generateStrategy]);

  // Données pour le Radar Ikigai Stratégique
  const ikigaiData = useMemo(() => [
    {
      dimension: l === 'fr' ? 'Engagement Stratégique' : 'Strategic Engagement',
      value: strategy.ikigai.engagementStrategique,
      fullMark: 100,
    },
    {
      dimension: l === 'fr' ? 'Expertise Distinctive' : 'Distinctive Expertise',
      value: strategy.ikigai.expertiseDistinctive,
      fullMark: 100,
    },
    {
      dimension: l === 'fr' ? 'Demande Critique' : 'Critical Demand',
      value: strategy.ikigai.demandeCritique,
      fullMark: 100,
    },
    {
      dimension: l === 'fr' ? 'Levier Économique' : 'Economic Leverage',
      value: strategy.ikigai.levierEconomique,
      fullMark: 100,
    },
  ], [strategy.ikigai, l]);

  // Score global Ikigai
  const globalScore = strategy.ikigai.alignmentScore;

  // Grouper les actions ERAC par catégorie
  const eracByCategory = useMemo(() => {
    const grouped: Record<string, typeof strategy.eracActions> = {
      eliminate: [],
      reduce: [],
      raise: [],
      create: [],
    };
    strategy.eracActions.forEach(action => {
      if (grouped[action.category]) {
        grouped[action.category].push(action);
      }
    });
    return grouped;
  }, [strategy.eracActions]);

  // Temps total libéré
  const totalTimeFreed = useMemo(() => {
    return strategy.eracActions.reduce((acc, a) => acc + (a.timeFreed || 0), 0);
  }, [strategy.eracActions]);

  const canProceed = strategy.generatedAt !== null;

  // Zone d'alignement styling
  const alignmentStyles = {
    optimal: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: l === 'fr' ? 'Zone Optimale' : 'Optimal Zone' },
    partial: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: l === 'fr' ? 'Alignement Partiel' : 'Partial Alignment' },
    misaligned: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: l === 'fr' ? 'Désalignement' : 'Misaligned' },
  };
  const alignmentStyle = alignmentStyles[strategy.ikigai.alignmentZone];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Parcours Badge */}
        <motion.div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${colors.bg} ${colors.text} border ${colors.border}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {isAugmentation ? <Zap className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
          {l === 'fr' 
            ? (isAugmentation ? 'Réingénierie du Poste Augmenté' : 'Stratégie de Pivot Résilient')
            : (isAugmentation ? 'Augmented Position Reengineering' : 'Resilient Pivot Strategy')}
        </motion.div>
        
        <h1 className="apex-title text-3xl mb-3">
          {l === 'fr' ? 'Matrice Ikigai Stratégique' : 'Strategic Ikigai Matrix'}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {l === 'fr' 
            ? 'Analyse de positionnement et stratégie de rupture basée sur le framework Blue Ocean.'
            : 'Positioning analysis and disruption strategy based on the Blue Ocean framework.'}
        </p>
      </motion.div>

      {/* =============================================== */}
      {/* FILTRE D'ASPIRATION - PIVOT UNIQUEMENT */}
      {/* Sélection des 2 Moteurs de Mutation */}
      {/* =============================================== */}
      <AnimatePresence>
        {isPivot && showMutationFilter && (
          <motion.div
            className="apex-card p-6 border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-purple-900/20"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-slate-200">
                  {l === 'fr' ? 'Filtre d\'Aspiration' : 'Aspiration Filter'}
                </h2>
                <p className="text-sm text-indigo-300">
                  {l === 'fr' 
                    ? 'Sélectionnez 2 Moteurs de Mutation pour calibrer votre trajectoire'
                    : 'Select 2 Mutation Drivers to calibrate your trajectory'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {MUTATION_DRIVERS.map((driver) => {
                const isSelected = selectedDrivers.includes(driver.id);
                const canSelect = selectedDrivers.length < 2 || isSelected;
                
                return (
                  <motion.button
                    key={driver.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDrivers(prev => prev.filter(d => d !== driver.id));
                      } else if (canSelect) {
                        setSelectedDrivers(prev => [...prev, driver.id]);
                      }
                    }}
                    disabled={!canSelect && !isSelected}
                    className={`p-3 rounded-lg text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-500/30 border-2 border-indigo-400 ring-2 ring-indigo-400/20'
                        : canSelect
                          ? 'bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50'
                          : 'bg-slate-800/30 border border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                    whileHover={canSelect ? { scale: 1.02 } : {}}
                    whileTap={canSelect ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{driver.icon}</span>
                      <span className={`text-sm font-medium ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {driver.label[l]}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 ml-auto" />}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {driver.description[l]}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${selectedDrivers.length >= 1 ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                <div className={`w-3 h-3 rounded-full ${selectedDrivers.length >= 2 ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                <span className="text-sm text-slate-400 ml-2">
                  {selectedDrivers.length}/2 {l === 'fr' ? 'sélectionnés' : 'selected'}
                </span>
              </div>
              
              <motion.button
                onClick={() => {
                  if (selectedDrivers.length === 2) {
                    setMutationDrivers(selectedDrivers);
                    setShowMutationFilter(false);
                    generateStrategy();
                  }
                }}
                disabled={selectedDrivers.length !== 2}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedDrivers.length === 2
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
                whileHover={selectedDrivers.length === 2 ? { scale: 1.02 } : {}}
                whileTap={selectedDrivers.length === 2 ? { scale: 0.98 } : {}}
              >
                {l === 'fr' ? 'Valider mes aspirations' : 'Validate my aspirations'}
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid - Ikigai Radar + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart - Ikigai Stratégique */}
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-slate-200">
              {l === 'fr' ? 'Profil Ikigai Stratégique' : 'Strategic Ikigai Profile'}
            </h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${alignmentStyle.bg}`}>
              <span className={`text-sm font-medium ${alignmentStyle.text}`}>
                {alignmentStyle.label}
              </span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={ikigaiData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis 
                dataKey="dimension" 
                stroke="#cbd5e1" 
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <PolarRadiusAxis 
                angle={45}
                domain={[0, 100]} 
                stroke="#334155" 
                tick={{ fill: '#64748b', fontSize: 10 }} 
              />
              <Radar
                name={l === 'fr' ? 'Votre Profil' : 'Your Profile'}
                dataKey="value"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>

          {/* Score Global */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                {l === 'fr' ? 'Score d\'Alignement Global' : 'Global Alignment Score'}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${colors.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${globalScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className={`text-2xl font-bold ${colors.text}`}>
                  {globalScore}
                </span>
              </div>
            </div>
          </div>

          {/* Bloc Transparence Algorithmique */}
          <div className="mt-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-start gap-2">
              <Brain className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  {l === 'fr' ? 'Logique du Diagnostic' : 'Diagnostic Logic'}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {l === 'fr'
                    ? 'Scores calculés par croisement : store.tasks (Vulnérabilité par dimension) × store.talents (Niveau de maîtrise). L\'alignement mesure l\'équilibre entre les 4 axes stratégiques.'
                    : 'Scores computed by intersection: store.tasks (Vulnerability by dimension) × store.talents (Mastery level). Alignment measures balance across 4 strategic axes.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Dimensions Detail */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Engagement Stratégique */}
          <div className="apex-card p-4 border-l-4 border-violet-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">
                    {l === 'fr' ? 'Engagement Stratégique' : 'Strategic Engagement'}
                  </h3>
                  <span className="text-violet-400 font-bold">{strategy.ikigai.engagementStrategique}%</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {l === 'fr' 
                    ? 'Niveau d\'investissement et motivation sur vos actifs clés.'
                    : 'Level of investment and motivation on your key assets.'}
                </p>
              </div>
            </div>
          </div>

          {/* Expertise Distinctive */}
          <div className="apex-card p-4 border-l-4 border-cyan-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">
                    {l === 'fr' ? 'Expertise Distinctive' : 'Distinctive Expertise'}
                  </h3>
                  <span className="text-cyan-400 font-bold">{strategy.ikigai.expertiseDistinctive}%</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {l === 'fr' 
                    ? 'Compétences différenciantes non-automatisables.'
                    : 'Non-automatable differentiating skills.'}
                </p>
              </div>
            </div>
          </div>

          {/* Demande Critique du Marché */}
          <div className="apex-card p-4 border-l-4 border-orange-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">
                    {l === 'fr' ? 'Demande Critique du Marché' : 'Critical Market Demand'}
                  </h3>
                  <span className="text-orange-400 font-bold">{strategy.ikigai.demandeCritique}%</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {l === 'fr' 
                    ? 'Besoin urgent du marché pour vos compétences.'
                    : 'Urgent market need for your skills.'}
                </p>
              </div>
            </div>
          </div>

          {/* Levier Économique */}
          <div className="apex-card p-4 border-l-4 border-emerald-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">
                    {l === 'fr' ? 'Levier Économique' : 'Economic Leverage'}
                  </h3>
                  <span className="text-emerald-400 font-bold">{strategy.ikigai.levierEconomique}%</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {l === 'fr' 
                    ? 'Potentiel de valorisation et monétisation.'
                    : 'Valuation and monetization potential.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Value Curve - Blue Ocean Strategy */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl text-slate-200">
              {l === 'fr' ? 'Courbe de Valeur — Stratégie de Rupture' : 'Value Curve — Disruption Strategy'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {l === 'fr'
                ? 'Comparaison de votre positionnement actuel vs cible (méthodologie Blue Ocean)'
                : 'Comparison of your current vs target positioning (Blue Ocean methodology)'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-500" />
              <span className="text-slate-400">{l === 'fr' ? 'Industrie' : 'Industry'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="text-slate-400">{l === 'fr' ? 'Actuel' : 'Current'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors.primary }} />
              <span className="text-slate-400">{l === 'fr' ? 'Cible' : 'Target'}</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={strategy.valueCurve} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="factor"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid #334155',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <ReferenceLine y={50} stroke="#475569" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="industry"
              fill="#475569"
              fillOpacity={0.2}
              stroke="#64748b"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ fill: '#f43f5e', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke={colors.primary}
              strokeWidth={3}
              dot={{ fill: colors.primary, r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* =============================================== */}
      {/* MODULE GPEC - Résultats de Matching */}
      {/* Affiché uniquement en mode Reclassement */}
      {/* =============================================== */}
      {isReclassement && (
        <motion.div
          className="apex-card p-6 border-2 border-rose-500/30 bg-gradient-to-br from-rose-900/10 to-violet-900/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-slate-200">
                {l === 'fr' ? 'Analyse de Réemployabilité GPEC' : 'GPEC Redeployability Analysis'}
              </h2>
              <p className="text-sm text-rose-300/70">
                {l === 'fr' 
                  ? 'Matching collaborateurs × Métiers de Demain avec Gap de Compétences'
                  : 'Employees × Future Jobs matching with Competency Gap'}
              </p>
            </div>
          </div>

          <EmployeeMatchResults />
        </motion.div>
      )}

      {/* ERAC Framework - Actions de Transformation */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl text-slate-200">
              {l === 'fr' ? 'Matrice ERAC — Actions de Transformation' : 'ERAC Matrix — Transformation Actions'}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {l === 'fr'
                ? 'Éliminer · Réduire · Augmenter · Créer'
                : 'Eliminate · Reduce · Raise · Create'}
            </p>
          </div>
          {totalTimeFreed > 0 && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${colors.bg}`}>
              <Zap className={`w-4 h-4 ${colors.text}`} />
              <span className={`font-medium ${colors.text}`}>
                {l === 'fr' ? `${totalTimeFreed}h/sem libérées` : `${totalTimeFreed}h/week freed`}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['eliminate', 'reduce', 'raise', 'create'] as const).map((category) => {
            const config = ERAC_LABELS[category];
            const Icon = config.icon;
            const actions = eracByCategory[category];

            return (
              <motion.div
                key={category}
                className={`p-4 rounded-lg border border-slate-700/50 ${config.bg}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (['eliminate', 'reduce', 'raise', 'create'].indexOf(category) * 0.1) }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <h3 className={`font-medium ${config.color}`}>
                    {config[l]}
                  </h3>
                  <span className="text-slate-500 text-sm">({actions.length})</span>
                </div>

                {actions.length > 0 ? (
                  <ul className="space-y-3">
                    {actions.map((action) => (
                      <li key={action.id} className="flex items-start gap-2 p-2 rounded bg-slate-900/30">
                        <Crosshair className="w-3 h-3 text-slate-500 mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-slate-300">{action.action}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{action.rationale}</p>
                          {/* Note technique de traçabilité */}
                          {action.sourceNote && (
                            <p className="text-[10px] text-slate-600 mt-1 font-mono">
                              {action.sourceNote}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            {action.timeFreed && (
                              <span className="text-xs text-emerald-400 font-medium">+{action.timeFreed}h/sem</span>
                            )}
                            {action.vulnerabilityScore !== undefined && action.category !== 'raise' && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                action.vulnerabilityScore >= 70 ? 'bg-rose-500/20 text-rose-400' :
                                action.vulnerabilityScore >= 50 ? 'bg-amber-500/20 text-amber-400' :
                                'bg-slate-500/20 text-slate-400'
                              }`}>
                                {action.vulnerabilityScore}% vuln.
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    {l === 'fr' ? 'Aucune action identifiée' : 'No action identified'}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Opportunités de Niche / Métiers Refuges */}
      {strategy.opportunitesNiche.length > 0 && (
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="font-serif text-xl text-slate-200 mb-2">
            {l === 'fr' ? 'Métiers Refuges — Niches de Résilience' : 'Safe Haven Careers — Resilience Niches'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {l === 'fr' 
              ? 'Secteurs où vos actifs stratégiques vous protègent de l\'automatisation.'
              : 'Sectors where your strategic assets protect you from automation.'}
          </p>
          
          <div className="space-y-6">
            {strategy.opportunitesNiche.slice(0, 3).map((opp, index) => (
              <motion.div
                key={opp.id}
                className={`p-5 rounded-xl border-2 transition-all ${
                  isPivot 
                    ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border-indigo-500/30 hover:border-indigo-400/50' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.15 }}
              >
                {/* Header du métier */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg text-slate-200 mb-1">{opp.name}</h3>
                    <p className="text-sm text-slate-400">{opp.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      opp.matchScore >= 66 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      opp.matchScore >= 33 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                    }`}>
                      {opp.matchScore}%
                    </span>
                    <span className="text-xs text-slate-500">
                      {l === 'fr' ? 'Compatibilité' : 'Match'}
                  </span>
                  </div>
                </div>

                {/* Core Transfer - Pourquoi ce talent est la clé */}
                {opp.coreTransfer && (
                  <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-medium text-indigo-300">
                        {l === 'fr' ? 'Clé de Transfert' : 'Transfer Key'}: {opp.coreTransfer.keyTalent}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{opp.coreTransfer.transferRationale}</p>
                <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-amber-300">{opp.coreTransfer.competitiveEdge}</span>
                    </div>
                  </div>
                )}

                {/* Mini Value Curve */}
                {opp.valueCurve && opp.valueCurve.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">
                        {l === 'fr' ? 'Courbe de Protection' : 'Protection Curve'}
                      </span>
                    </div>
                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={opp.valueCurve} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <defs>
                            <linearGradient id={`userGradient-${opp.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                            </linearGradient>
                            <linearGradient id={`threatGradient-${opp.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="factor" tick={{ fontSize: 8, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#e2e8f0', fontSize: '11px' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                          />
                          <Area type="monotone" dataKey="automationThreat" name={l === 'fr' ? 'Menace Auto.' : 'Auto. Threat'} stroke="#ef4444" fill={`url(#threatGradient-${opp.id})`} strokeWidth={1} />
                          <Area type="monotone" dataKey="userPosition" name={l === 'fr' ? 'Votre Position' : 'Your Position'} stroke="#6366f1" fill={`url(#userGradient-${opp.id})`} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Métriques du secteur */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-2 rounded-lg bg-slate-800/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <p className="text-lg font-bold text-blue-400">{opp.automationResistance}%</p>
                    <p className="text-[10px] text-slate-500">
                      {l === 'fr' ? 'Protection' : 'Protection'}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-lg font-bold text-emerald-400">{opp.marketDemand}%</p>
                    <p className="text-[10px] text-slate-500">
                      {l === 'fr' ? 'Demande' : 'Demand'}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-sm font-bold text-amber-400">
                      {opp.growthPotential === 'high' ? '↑↑' : opp.growthPotential === 'medium' ? '↑' : '→'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {l === 'fr' ? 'Croissance' : 'Growth'}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-800/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <p className="text-xs font-bold text-green-400">{opp.salaryRange}</p>
                    <p className="text-[10px] text-slate-500">
                      {l === 'fr' ? 'Rémunération' : 'Salary'}
                    </p>
                  </div>
                </div>

                {/* Métriques sectorielles (si disponibles) */}
                {opp.sectorMetrics && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{l === 'fr' ? `~${opp.sectorMetrics.jobOpenings} offres/an` : `~${opp.sectorMetrics.jobOpenings} jobs/year`}</span>
                      <span>{opp.sectorMetrics.growthRate}</span>
                      <span className={`px-2 py-0.5 rounded ${
                        opp.sectorMetrics.entryBarrier === 'low' ? 'bg-green-500/20 text-green-400' :
                        opp.sectorMetrics.entryBarrier === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                  }`}>
                    {l === 'fr' 
                          ? (opp.sectorMetrics.entryBarrier === 'low' ? 'Accès facile' : opp.sectorMetrics.entryBarrier === 'medium' ? 'Accès moyen' : 'Accès difficile')
                          : (opp.sectorMetrics.entryBarrier === 'low' ? 'Easy entry' : opp.sectorMetrics.entryBarrier === 'medium' ? 'Medium entry' : 'Hard entry')
                        }
                  </span>
                </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Signature Stratégique */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="font-serif text-xl text-slate-200 mb-4">
          {l === 'fr' ? 'Votre Signature Stratégique' : 'Your Strategic Signature'}
        </h2>
        <div className="flex flex-wrap gap-3">
          {selectedTalents.map((talent) => (
            <div
              key={talent.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700"
            >
              <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
              <span className="text-slate-200 text-sm">{talent.name}</span>
              <span className="text-amber-400 text-xs">
                {'★'.repeat(talent.level)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer Méthodologique */}
      <motion.div
        className="mt-8 pt-6 border-t border-slate-800/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
          <div className="w-1 h-1 rounded-full bg-slate-600" />
          <span>
            {l === 'fr'
              ? 'Méthodologie : ERAC (Blue Ocean Strategy) • Business Model You • Ikigai Stratégique'
              : 'Methodology: ERAC (Blue Ocean Strategy) • Business Model You • Strategic Ikigai'}
          </span>
          <div className="w-1 h-1 rounded-full bg-slate-600" />
        </div>
      </motion.div>

      {/* Navigation */}
      <NavigationButtons
        onPrev={() => {
          setStep(6);
          router.push('/audit');
        }}
        onNext={() => setStep(8)}
        canProceed={canProceed}
        nextLabel={l === 'fr' ? 'Voir le Plan d\'Action →' : 'View Action Plan →'}
        prevLabel={l === 'fr' ? '← Retour au Diagnostic' : '← Back to Diagnostic'}
      />
    </motion.div>
  );
}
