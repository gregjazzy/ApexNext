'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, TrendingUp, Brain, Heart, Sparkles, Database, Star, Monitor, RefreshCw, Cpu, Cog, Users, Lightbulb, ChevronLeft, Radar, Rocket, Zap, Compass } from 'lucide-react';
import { ResilienceRadar } from '@/components/ui/ResilienceRadar';
import { useLocale, useTranslations } from 'next-intl';
import { useAuditStore, Task } from '@/lib/store';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn, getResilienceColor } from '@/lib/utils';
import { verdictLexicon, getLexiconValue, personaLabels } from '@/lib/lexicon';

export function Step6Verdict() {
  const t = useTranslations('step6');
  const tStep4 = useTranslations('step4');
  const tStep5 = useTranslations('step5');
  const locale = useLocale();
  const router = useRouter();
  const { context, tasks, getSelectedTalents, software, getResilienceScore, getTalentScore, reset, setStep, prevStep } = useAuditStore();
  
  const resilienceScore = getResilienceScore();
  const talentScore = getTalentScore();
  const selectedTalents = getSelectedTalents();
  const persona = context.persona || 'salarie';
  const l = locale === 'en' ? 'en' : 'fr';
  
  // Score final : Vulnérabilité Tâches vs Force Signature
  // Vulnérabilité = 100 - resilienceScore (plus le score est bas, plus c'est vulnérable)
  const taskVulnerability = 100 - resilienceScore;
  const signatureStrength = talentScore;
  
  // Score global : combinaison résilience + signature
  const overallScore = Math.round((resilienceScore * 0.6) + (talentScore * 0.4));
  
  // Calcul du score d'une tâche sur 5 dimensions
  const getTaskScore = (task: Task): number => {
    const { donnees, decision, relationnel, creativite, execution } = task.resilience;
    return Math.round((donnees + decision + relationnel + creativite + execution) / 5);
  };
  
  const sortedTasks = [...tasks].sort((a, b) => getTaskScore(a) - getTaskScore(b));
  const vulnerableTasks = sortedTasks.slice(0, Math.min(3, sortedTasks.length));
  const resilientTasks = sortedTasks.slice(-Math.min(3, sortedTasks.length)).reverse();

  const scoreColor = getResilienceColor(overallScore);

  const getStatusLabel = (score: number): string => {
    if (score >= 70) return t('status.resilient');
    if (score >= 40) return t('status.vulnerable');
    return t('status.critical');
  };

  const getLevelLabel = (level: string): string => {
    const labels: Record<string, string> = {
      debutant: tStep5('levels.debutant'),
      avance: tStep5('levels.avance'),
      expert: tStep5('levels.expert'),
    };
    return labels[level] || level;
  };

  // Obtenir le label traduit pour un actif
  const getAssetLabel = (assetId: string): string => {
    try {
      return tStep4(`assets.${assetId}` as any) || assetId;
    } catch {
      return assetId;
    }
  };

  // 5 Dimensions de résilience
  const dimensions = [
    { key: 'donnees', label: t('dimensions.data'), icon: <Cpu className="w-5 h-5" />, color: 'blue' },
    { key: 'decision', label: t('dimensions.decision'), icon: <Brain className="w-5 h-5" />, color: 'purple' },
    { key: 'relationnel', label: t('dimensions.relational'), icon: <Users className="w-5 h-5" />, color: 'pink' },
    { key: 'creativite', label: t('dimensions.creativity'), icon: <Lightbulb className="w-5 h-5" />, color: 'yellow' },
    { key: 'execution', label: t('dimensions.execution'), icon: <Cog className="w-5 h-5" />, color: 'orange' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header with Dynamic Title */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Mode Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mode Diagnostic : {personaLabels[persona][l]}
          </span>
          
          <h1 className="apex-title text-4xl md:text-5xl">
            {getLexiconValue(verdictLexicon.title, persona, locale)}
          </h1>
        </motion.div>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getLexiconValue(verdictLexicon.subtitle, persona, locale)}
        </motion.p>
      </div>

      {/* Main Score Card */}
      <motion.div
        className={cn(
          'apex-card p-8 text-center',
          scoreColor === 'emerald' && 'glow-emerald',
          scoreColor === 'amber' && 'glow-amber',
          scoreColor === 'rose' && 'glow-rose'
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <ScoreRing score={overallScore} size="lg" label={t('globalScore')} />
          
          <div className="text-left space-y-4">
            <div>
              <h2 className={cn(
                'text-3xl font-serif font-bold',
                scoreColor === 'emerald' && 'text-emerald-400',
                scoreColor === 'amber' && 'text-amber-400',
                scoreColor === 'rose' && 'text-rose-400'
              )}>
                {getStatusLabel(overallScore)}
              </h2>
              <p className="text-slate-400 mt-1">
                {context.jobTitle} • {context.industry}
              </p>
            </div>
            
            {/* Vulnérabilité vs Force Signature */}
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('tasks')}</p>
                <p className={cn(
                  'text-2xl font-bold',
                  getResilienceColor(resilienceScore) === 'emerald' && 'text-emerald-400',
                  getResilienceColor(resilienceScore) === 'amber' && 'text-amber-400',
                  getResilienceColor(resilienceScore) === 'rose' && 'text-rose-400'
                )}>
                  {resilienceScore}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('talents')}</p>
                <p className={cn(
                  'text-2xl font-bold',
                  getResilienceColor(talentScore) === 'emerald' && 'text-emerald-400',
                  getResilienceColor(talentScore) === 'amber' && 'text-amber-400',
                  getResilienceColor(talentScore) === 'rose' && 'text-rose-400'
                )}>
                  {talentScore}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout - Vulnerable vs Resilient */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerable Tasks */}
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-lg font-medium text-slate-200">{t('vulnerableZones')}</h3>
          </div>
          
          <div className="space-y-3">
            {vulnerableTasks.map((task, index) => {
              const score = getTaskScore(task);
              const color = getResilienceColor(score);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-200">{task.name}</p>
                  </div>
                  <span className={cn(
                    'text-lg font-bold tabular-nums',
                    color === 'rose' && 'text-rose-400',
                    color === 'amber' && 'text-amber-400',
                    color === 'emerald' && 'text-emerald-400'
                  )}>
                    {score}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Resilient Tasks */}
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-medium text-slate-200">{t('resilientZones')}</h3>
          </div>
          
          <div className="space-y-3">
            {resilientTasks.map((task, index) => {
              const score = getTaskScore(task);
              const color = getResilienceColor(score);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-200">{task.name}</p>
                  </div>
                  <span className={cn(
                    'text-lg font-bold tabular-nums',
                    color === 'emerald' && 'text-emerald-400',
                    color === 'amber' && 'text-amber-400',
                    color === 'rose' && 'text-rose-400'
                  )}>
                    {score}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* 5 Dimensions Resilience Breakdown with Radar */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Radar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-medium text-slate-200">{t('resilienceBreakdown')}</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Radar Chart */}
          <div className="order-2 lg:order-1">
            <ResilienceRadar 
              data={{
                donnees: tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + t.resilience.donnees, 0) / tasks.length) : 0,
                decision: tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + t.resilience.decision, 0) / tasks.length) : 0,
                relationnel: tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + t.resilience.relationnel, 0) / tasks.length) : 0,
                creativite: tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + t.resilience.creativite, 0) / tasks.length) : 0,
                execution: tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + t.resilience.execution, 0) / tasks.length) : 0,
              }}
            />
          </div>
          
          {/* Dimension Cards */}
          <div className="order-1 lg:order-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {dimensions.map(({ key, label, icon }) => {
              const avg = tasks.length > 0
                ? Math.round(tasks.reduce((acc, t) => acc + t.resilience[key as keyof typeof t.resilience], 0) / tasks.length)
                : 0;
              const color = getResilienceColor(avg);
              
              return (
                <motion.div 
                  key={key} 
                  className="text-center p-3 bg-slate-800/30 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center',
                    color === 'emerald' && 'bg-emerald-500/20 text-emerald-400',
                    color === 'amber' && 'bg-amber-500/20 text-amber-400',
                    color === 'rose' && 'bg-rose-500/20 text-rose-400'
                  )}>
                    {icon}
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{label}</p>
                  <p className={cn(
                    'text-xl font-bold',
                    color === 'emerald' && 'text-emerald-400',
                    color === 'amber' && 'text-amber-400',
                    color === 'rose' && 'text-rose-400'
                  )}>
                    {avg}%
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Actifs Stratégiques & Software */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actifs Stratégiques (Talents) */}
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-medium text-slate-200">{t('yourSignature')}</h3>
          </div>
          
          <div className="space-y-2">
            {selectedTalents.map((talent) => (
              <div
                key={talent.id}
                className="flex items-center justify-between p-2 bg-slate-800/30 rounded"
              >
                <span className="text-slate-300">{getAssetLabel(talent.id)}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < talent.level
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-700'
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Software */}
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-medium text-slate-200">{t('techStack')}</h3>
          </div>
          
          <div className="space-y-2">
            {software.map((sw) => (
              <div
                key={sw.id}
                className="flex items-center justify-between p-2 bg-slate-800/30 rounded"
              >
                <span className="text-slate-300">{sw.name}</span>
                <span className={cn(
                  'text-sm font-medium px-2 py-0.5 rounded',
                  sw.level === 'expert' && 'bg-amber-500/20 text-amber-400',
                  sw.level === 'avance' && 'bg-blue-500/20 text-blue-400',
                  sw.level === 'debutant' && 'bg-slate-700 text-slate-400'
                )}>
                  {getLevelLabel(sw.level)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation - Retour à l'étape précédente */}
      <motion.div
        className="flex items-center justify-between pt-8 border-t border-slate-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
      >
        <motion.button
          onClick={prevStep}
          className="apex-button-outline flex items-center gap-2"
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-4 h-4" />
          {l === 'fr' ? 'Retour au Tech Scan' : 'Back to Tech Scan'}
        </motion.button>
        
        <div />
      </motion.div>

      {/* Call to Action - Transition vers Phase 2 */}
      <motion.div
        className={cn(
          "apex-card p-8 text-center relative overflow-hidden",
          context.goal === 'augmentation' 
            ? "bg-gradient-to-br from-emerald-500/10 via-slate-900/50 to-teal-500/10 border-emerald-500/30"
            : "bg-gradient-to-br from-indigo-500/10 via-slate-900/50 to-purple-500/10 border-indigo-500/30"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={cn(
            "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20",
            context.goal === 'augmentation' ? "bg-emerald-500" : "bg-indigo-500"
          )} />
          <div className={cn(
            "absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20",
            context.goal === 'augmentation' ? "bg-teal-500" : "bg-purple-500"
          )} />
        </div>
        
        <div className="relative z-10">
          {/* Phase 2 Badge */}
          <motion.div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4",
              context.goal === 'augmentation'
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
            )}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Rocket className="w-4 h-4" />
            {l === 'fr' ? 'Phase 2 Disponible' : 'Phase 2 Available'}
          </motion.div>

          <div className={cn(
            "w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center",
            context.goal === 'augmentation'
              ? "bg-gradient-to-br from-emerald-600 to-teal-600"
              : "bg-gradient-to-br from-indigo-600 to-purple-600"
          )}>
            {context.goal === 'augmentation' 
              ? <Zap className="w-8 h-8 text-white" />
              : <Compass className="w-8 h-8 text-white" />
            }
          </div>

          <h3 className="text-2xl font-serif text-slate-100 mb-2">
            {context.goal === 'augmentation'
              ? (l === 'fr' ? 'Prêt pour la Réingénierie' : 'Ready for Reengineering')
              : (l === 'fr' ? 'Prêt pour le Pivot Stratégique' : 'Ready for Strategic Pivot')
            }
          </h3>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            {t('readyForStep2Desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => {
                reset();
                setStep(1);
              }}
              className="apex-button-outline flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              {t('restartAudit')}
            </motion.button>
            
            <motion.button
              onClick={() => {
                setStep(7);
                router.push('/strategy');
              }}
              className={cn(
                "apex-button flex items-center justify-center gap-2 text-white font-medium",
                context.goal === 'augmentation'
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Rocket className="w-4 h-4" />
              {l === 'fr' ? 'Lancer la Phase 2' : 'Launch Phase 2'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
