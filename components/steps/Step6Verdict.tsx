'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingUp, Brain, Heart, Sparkles, Database, Star, Monitor, RefreshCw } from 'lucide-react';
import { useAuditStore, Task } from '@/lib/store';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn, getResilienceColor, getResilienceLabel, getTemporalityLabel, getLevelLabel } from '@/lib/utils';

export function Step6Verdict() {
  const { context, tasks, getSelectedTalents, software, getResilienceScore, getTalentScore, reset, setStep } = useAuditStore();
  
  const resilienceScore = getResilienceScore();
  const talentScore = getTalentScore();
  const selectedTalents = getSelectedTalents();
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round((resilienceScore * 0.6) + (talentScore * 0.4));
  
  // Find most vulnerable and most resilient tasks
  const getTaskScore = (task: Task): number => {
    const { donnees, decision, relationnel, creativite } = task.resilience;
    return Math.round((donnees + decision + relationnel + creativite) / 4);
  };
  
  const sortedTasks = [...tasks].sort((a, b) => getTaskScore(a) - getTaskScore(b));
  const vulnerableTasks = sortedTasks.slice(0, Math.min(3, sortedTasks.length));
  const resilientTasks = sortedTasks.slice(-Math.min(3, sortedTasks.length)).reverse();

  const scoreColor = getResilienceColor(overallScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          className="apex-title text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Le Verdict
        </motion.h1>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Votre diagnostic de résilience face à l'IA
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
          <ScoreRing score={overallScore} size="lg" label="Score Global" />
          
          <div className="text-left space-y-4">
            <div>
              <h2 className={cn(
                'text-3xl font-serif font-bold',
                scoreColor === 'emerald' && 'text-emerald-400',
                scoreColor === 'amber' && 'text-amber-400',
                scoreColor === 'rose' && 'text-rose-400'
              )}>
                {getResilienceLabel(overallScore)}
              </h2>
              <p className="text-slate-400 mt-1">
                {context.jobTitle} • {context.industry}
              </p>
            </div>
            
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Tâches</p>
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
                <p className="text-xs text-slate-500 uppercase tracking-wider">Talents</p>
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

      {/* Two Column Layout */}
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
            <h3 className="text-lg font-medium text-slate-200">Zones Vulnérables</h3>
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
                    <p className="text-xs text-slate-500">{getTemporalityLabel(task.temporality)}</p>
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
            <h3 className="text-lg font-medium text-slate-200">Zones Résilientes</h3>
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
                    <p className="text-xs text-slate-500">{getTemporalityLabel(task.temporality)}</p>
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

      {/* Resilience Breakdown */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-medium text-slate-200 mb-6">Répartition de la Résilience</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'donnees', label: 'Données', icon: <Database className="w-5 h-5" /> },
            { key: 'decision', label: 'Décision', icon: <Brain className="w-5 h-5" /> },
            { key: 'relationnel', label: 'Relationnel', icon: <Heart className="w-5 h-5" /> },
            { key: 'creativite', label: 'Créativité', icon: <Sparkles className="w-5 h-5" /> },
          ].map(({ key, label, icon }) => {
            const avg = tasks.length > 0
              ? Math.round(tasks.reduce((acc, t) => acc + t.resilience[key as keyof typeof t.resilience], 0) / tasks.length)
              : 0;
            const color = getResilienceColor(avg);
            
            return (
              <div key={key} className="text-center p-4 bg-slate-800/30 rounded-lg">
                <div className={cn(
                  'w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center',
                  color === 'emerald' && 'bg-emerald-500/20 text-emerald-400',
                  color === 'amber' && 'bg-amber-500/20 text-amber-400',
                  color === 'rose' && 'bg-rose-500/20 text-rose-400'
                )}>
                  {icon}
                </div>
                <p className="text-sm text-slate-400 mb-1">{label}</p>
                <p className={cn(
                  'text-2xl font-bold',
                  color === 'emerald' && 'text-emerald-400',
                  color === 'amber' && 'text-amber-400',
                  color === 'rose' && 'text-rose-400'
                )}>
                  {avg}%
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Talents & Software */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Talents */}
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-medium text-slate-200">Votre Signature</h3>
          </div>
          
          <div className="space-y-2">
            {selectedTalents.map((talent) => (
              <div
                key={talent.id}
                className="flex items-center justify-between p-2 bg-slate-800/30 rounded"
              >
                <span className="text-slate-300">{talent.name}</span>
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
            <h3 className="text-lg font-medium text-slate-200">Stack Technique</h3>
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

      {/* Call to Action */}
      <motion.div
        className="apex-card p-8 text-center bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border-blue-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-serif text-slate-100 mb-2">
          Prêt pour l'Étape 2 : Ikigai Professionnel
        </h3>
        <p className="text-slate-400 mb-6 max-w-xl mx-auto">
          Utilisez ce diagnostic pour construire votre trajectoire idéale, alignée sur vos talents et les opportunités de demain.
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
            Recommencer l'audit
          </motion.button>
          
          <motion.button
            className="apex-button flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Accéder à l'Ikigai
            <span className="text-xs opacity-75">(Bientôt)</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

