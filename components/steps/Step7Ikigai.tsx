'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Target, Shield, TrendingUp, Zap, 
  Sparkles, ArrowRight, CheckCircle2, AlertTriangle 
} from 'lucide-react';

export function Step7Ikigai() {
  const t = useTranslations('step7');
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { 
    context, 
    strategy, 
    generateStrategy, 
    nextStep, 
    prevStep,
    getSelectedTalents 
  } = useAuditStore();
  
  const selectedTalents = getSelectedTalents();
  const isAugmentation = context.goal === 'augmentation';

  // Générer la stratégie au montage si pas encore fait
  useEffect(() => {
    if (!strategy.generatedAt) {
      generateStrategy();
    }
  }, [strategy.generatedAt, generateStrategy]);

  // Données pour le Radar Ikigai 2.0
  const ikigaiData = useMemo(() => [
    {
      dimension: l === 'fr' ? 'Capital Actif' : 'Active Capital',
      value: strategy.capitalActif,
      fullMark: 100,
    },
    {
      dimension: l === 'fr' ? 'Résilience' : 'Resilience',
      value: 100 - strategy.zoneRisque,
      fullMark: 100,
    },
    {
      dimension: l === 'fr' ? 'Opportunités' : 'Opportunities',
      value: strategy.opportunitesNiche.length > 0 
        ? Math.round(strategy.opportunitesNiche.reduce((a, b) => a + b.matchScore, 0) / strategy.opportunitesNiche.length)
        : 0,
      fullMark: 100,
    },
    {
      dimension: l === 'fr' ? 'Levier Éco.' : 'Econ. Leverage',
      value: strategy.levierEconomique,
      fullMark: 100,
    },
  ], [strategy, l]);

  // Score global
  const globalScore = useMemo(() => {
    const avg = ikigaiData.reduce((acc, d) => acc + d.value, 0) / ikigaiData.length;
    return Math.round(avg);
  }, [ikigaiData]);

  const canProceed = strategy.generatedAt !== null;

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
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            isAugmentation 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {isAugmentation ? <Zap className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          {l === 'fr' 
            ? (isAugmentation ? 'Parcours Augmentation' : 'Parcours Pivot') 
            : (isAugmentation ? 'Augmentation Path' : 'Pivot Path')}
        </motion.div>
        
        <h1 className="apex-title text-3xl mb-3">
          {l === 'fr' ? 'Matrice Ikigai 2.0' : 'Ikigai Matrix 2.0'}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {l === 'fr' 
            ? 'Visualisation stratégique de votre positionnement face à l\'automatisation intelligente.'
            : 'Strategic visualization of your positioning against intelligent automation.'}
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart - Ikigai 2.0 */}
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-slate-200">
              {l === 'fr' ? 'Profil Stratégique' : 'Strategic Profile'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Score Global</span>
              <span className={`text-2xl font-bold ${
                globalScore >= 60 ? 'text-emerald-400' : globalScore >= 40 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {globalScore}
              </span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={ikigaiData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis 
                dataKey="dimension" 
                stroke="#cbd5e1" 
                tick={{ fill: '#cbd5e1', fontSize: 12 }} 
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                stroke="#334155" 
                tick={{ fill: '#64748b', fontSize: 10 }} 
              />
              <Radar
                name={l === 'fr' ? 'Votre Profil' : 'Your Profile'}
                dataKey="value"
                stroke={isAugmentation ? '#10b981' : '#f59e0b'}
                fill={isAugmentation ? '#10b981' : '#f59e0b'}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 4 Dimensions Detail */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Capital Actif */}
          <div className="apex-card p-4 border-l-4 border-emerald-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">
                    {l === 'fr' ? 'Capital Actif' : 'Active Capital'}
                  </h3>
                  <span className="text-emerald-400 font-bold">{strategy.capitalActif}%</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {l === 'fr' 
                    ? 'Force combinée de vos 5 talents critiques et maîtrise technologique.'
                    : 'Combined strength of your 5 critical talents and tech mastery.'}
                </p>
              </div>
            </div>
          </div>

          {/* Zone de Risque */}
          <div className="apex-card p-4 border-l-4 border-rose-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">
                    {l === 'fr' ? 'Zone de Risque' : 'Risk Zone'}
                  </h3>
                  <span className="text-rose-400 font-bold">{strategy.zoneRisque}%</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {l === 'fr' 
                    ? 'Exposition de vos tâches à l\'automatisation (IA + robotique).'
                    : 'Exposure of your tasks to automation (AI + robotics).'}
                </p>
              </div>
            </div>
          </div>

          {/* Opportunités */}
          <div className="apex-card p-4 border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">
                    {l === 'fr' ? 'Opportunités de Niche' : 'Niche Opportunities'}
                  </h3>
                  <span className="text-blue-400 font-bold">{strategy.opportunitesNiche.length}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {l === 'fr' 
                    ? 'Secteurs résilients correspondant à votre signature.'
                    : 'Resilient sectors matching your signature.'}
                </p>
              </div>
            </div>
          </div>

          {/* Levier Économique */}
          <div className="apex-card p-4 border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-200">
                    {l === 'fr' ? 'Levier Économique' : 'Economic Leverage'}
                  </h3>
                  <span className="text-amber-400 font-bold">{strategy.levierEconomique}%</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {l === 'fr' 
                    ? 'Potentiel de valorisation sur le marché transformé.'
                    : 'Valuation potential in the transformed market.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Opportunités de Niche */}
      {strategy.opportunitesNiche.length > 0 && (
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-serif text-xl text-slate-200 mb-4">
            {l === 'fr' ? 'Métiers Refuges Identifiés' : 'Identified Safe Haven Careers'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {l === 'fr' 
              ? 'Fonctions à haute valeur humaine correspondant à vos actifs stratégiques.'
              : 'High human-value functions matching your strategic assets.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategy.opportunitesNiche.map((opp, index) => (
              <motion.div
                key={opp.id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-200">{opp.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    opp.matchScore >= 66 ? 'bg-emerald-500/20 text-emerald-400' :
                    opp.matchScore >= 33 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {opp.matchScore}% match
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">{opp.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    opp.growthPotential === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                    opp.growthPotential === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {l === 'fr' 
                      ? (opp.growthPotential === 'high' ? 'Forte croissance' : opp.growthPotential === 'medium' ? 'Croissance moyenne' : 'Croissance faible')
                      : (opp.growthPotential === 'high' ? 'High growth' : opp.growthPotential === 'medium' ? 'Medium growth' : 'Low growth')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Talents sélectionnés - Rappel */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
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
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200">{talent.name}</span>
              <span className="text-amber-400 text-sm">
                {'★'.repeat(talent.level)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        canProceed={canProceed}
        nextLabel={l === 'fr' ? 'Voir le Plan d\'Action →' : 'View Action Plan →'}
        prevLabel={l === 'fr' ? '← Retour au Verdict' : '← Back to Verdict'}
      />
    </motion.div>
  );
}

