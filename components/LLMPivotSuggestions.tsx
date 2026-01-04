'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Compass, Sparkles, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Target, TrendingUp, Clock, DollarSign, ArrowRight, Briefcase, GraduationCap, XCircle, Lightbulb } from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// ============================================================================
// Types pour les réponses LLM
// ============================================================================

interface PivotSuggestions {
  analysis_summary: {
    transferable_skills: string[];
    hidden_strengths: string;
    market_positioning: string;
  };
  proposed_jobs: Array<{
    job_title: string;
    sector: string;
    resilience_score: number;
    match_score: number;
    why_this_job: {
      from_skills: string;
      from_talents: string;
      market_demand: string;
    };
    resilience_factors: string[];
    transition_path: {
      difficulty: 'easy' | 'medium' | 'hard';
      estimated_duration: string;
      key_steps: string[];
      required_training: string[];
      quick_start: string;
    };
    salary_range: {
      entry: string;
      experienced: string;
      trend: 'up' | 'stable' | 'down';
    };
    daily_reality: string;
    warning: string;
  }>;
  surprise_recommendation: {
    job_title: string;
    why_surprising: string;
    why_perfect: string;
  };
  avoid_these: Array<{
    job_title: string;
    why: string;
  }>;
  next_step: string;
}

// ============================================================================
// Composant : Suggestions de Métiers pour Pivot (LLM #4)
// ============================================================================

export function LLMPivotSuggestions() {
  const locale = useLocale();
  const { context, tasks, talents, getResilienceScore, getTalentScore, strategy } = useAuditStore();
  const [suggestions, setSuggestions] = useState<PivotSuggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedJob, setSelectedJob] = useState<number>(0);

  const resilienceScore = getResilienceScore();
  const talentScore = getTalentScore();
  const selectedTalents = talents.filter(t => t.selected);

  // Calcul du score d'une tâche
  const getTaskScore = (task: typeof tasks[0]): number => {
    const { donnees, decision, relationnel, creativite, execution } = task.resilience;
    return Math.round((donnees + decision + relationnel + creativite + execution) / 5);
  };

  const resilientTasks = tasks
    .map(t => ({ ...t, score: getTaskScore(t) }))
    .filter(t => t.score >= 50)
    .sort((a, b) => b.score - a.score);

  const fetchSuggestions = async () => {
    if (!context.jobTitle || !context.industry) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/suggest-pivot-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentJob: context.jobTitle,
          currentSector: context.industry,
          yearsExperience: context.yearsExperience,
          skills: selectedTalents.map(t => ({
            name: t.name,
            level: t.level,
            transferable: true,
          })),
          talents: selectedTalents.map(t => ({
            name: t.name,
            category: 'strategic', // Default category
            level: t.level,
          })),
          resilientTasks: resilientTasks.slice(0, 5).map(t => ({
            name: t.name,
            resilienceScore: t.score,
          })),
          // Ikigai scores (structure simplifiée)
          ikigai: strategy.ikigai ? {
            passions: [], // Non disponible dans le type actuel
            skills: [],
            worldNeeds: [],
            paidFor: [],
          } : undefined,
          scores: {
            globalResilience: resilienceScore,
            talentSignature: talentScore,
          },
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération des suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Ne pas auto-fetch, laisser l'utilisateur décider
  // useEffect(() => { ... }, []);

  // Si pas en mode pivot, ne rien afficher
  if (context.goal !== 'pivot') {
    return null;
  }

  const difficultyColors = {
    easy: 'bg-emerald-500/20 text-emerald-400',
    medium: 'bg-amber-500/20 text-amber-400',
    hard: 'bg-rose-500/20 text-rose-400',
  };

  const difficultyLabels = {
    easy: 'Accessible',
    medium: 'Modéré',
    hard: 'Exigeant',
  };

  return (
    <motion.div
      className="apex-card overflow-hidden border-2 border-indigo-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div 
        className="p-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-800/50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
              <Compass className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-slate-200 flex items-center gap-2">
                Métiers Résilients Suggérés
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  IA Gemini
                </span>
              </h3>
              <p className="text-sm text-slate-500">
                Basé sur vos talents, compétences et le marché 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {suggestions && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {suggestions.proposed_jobs.length} métiers
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-6">
              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 animate-pulse">
                    <Compass className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-slate-400 mb-2">Analyse du marché en cours...</p>
                  <p className="text-xs text-slate-600">L'IA identifie les meilleures opportunités pour votre profil</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mb-3" />
                  <p className="text-slate-400 mb-4">{error}</p>
                  <button
                    onClick={fetchSuggestions}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Réessayer
                  </button>
                </div>
              )}

              {/* Initial State */}
              {!suggestions && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Compass className="w-12 h-12 text-slate-600 mb-4" />
                  <h4 className="text-lg font-medium text-slate-300 mb-2">
                    Découvrez vos métiers d'avenir
                  </h4>
                  <p className="text-slate-500 mb-6 text-center max-w-md text-sm">
                    L'IA va analyser votre profil complet pour vous proposer des métiers résilients 
                    que vous n'auriez peut-être pas envisagés.
                  </p>
                  <button
                    onClick={fetchSuggestions}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                    Explorer mes opportunités
                  </button>
                </div>
              )}

              {/* Suggestions Results */}
              {suggestions && !isLoading && (
                <>
                  {/* Analysis Summary */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <h4 className="text-sm font-medium text-indigo-400 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Votre potentiel identifié
                    </h4>
                    <p className="text-sm text-slate-300 mb-3">{suggestions.analysis_summary.hidden_strengths}</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.analysis_summary.transferable_skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Job Selector Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {suggestions.proposed_jobs.map((job, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedJob(i)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                          selectedJob === i
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                        )}
                      >
                        {job.job_title}
                      </button>
                    ))}
                  </div>

                  {/* Selected Job Details */}
                  {suggestions.proposed_jobs[selectedJob] && (
                    <motion.div
                      key={selectedJob}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {(() => {
                        const job = suggestions.proposed_jobs[selectedJob];
                        return (
                          <>
                            {/* Job Header */}
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-xl font-serif text-slate-200">{job.job_title}</h3>
                                <p className="text-sm text-slate-500">{job.sector}</p>
                              </div>
                              <div className="flex gap-2">
                                <div className="text-center px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                  <p className="text-lg font-bold text-emerald-400">{job.resilience_score}%</p>
                                  <p className="text-xs text-slate-500">Résilience</p>
                                </div>
                                <div className="text-center px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                  <p className="text-lg font-bold text-indigo-400">{job.match_score}%</p>
                                  <p className="text-xs text-slate-500">Match</p>
                                </div>
                              </div>
                            </div>

                            {/* Why This Job */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                                <p className="text-xs text-emerald-400 font-medium mb-1">📚 Compétences</p>
                                <p className="text-sm text-slate-400">{job.why_this_job.from_skills}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                                <p className="text-xs text-amber-400 font-medium mb-1">✨ Talents</p>
                                <p className="text-sm text-slate-400">{job.why_this_job.from_talents}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                                <p className="text-xs text-blue-400 font-medium mb-1">📈 Marché</p>
                                <p className="text-sm text-slate-400">{job.why_this_job.market_demand}</p>
                              </div>
                            </div>

                            {/* Daily Reality */}
                            <div className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/30">
                              <p className="text-xs text-slate-500 mb-2">📅 Une journée type :</p>
                              <p className="text-sm text-slate-300 italic">{job.daily_reality}</p>
                            </div>

                            {/* Transition Path */}
                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium text-indigo-400 flex items-center gap-2">
                                  <ArrowRight className="w-4 h-4" />
                                  Chemin de transition
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className={cn('px-2 py-1 rounded text-xs font-medium', difficultyColors[job.transition_path.difficulty])}>
                                    {difficultyLabels[job.transition_path.difficulty]}
                                  </span>
                                  <span className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {job.transition_path.estimated_duration}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-2 mb-4">
                                {job.transition_path.key_steps.map((step, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 flex-shrink-0">
                                      {i + 1}
                                    </span>
                                    <p className="text-sm text-slate-400">{step}</p>
                                  </div>
                                ))}
                              </div>

                              {job.transition_path.required_training.length > 0 && (
                                <div className="pt-3 border-t border-slate-700/30">
                                  <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3" />
                                    Formations recommandées
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {job.transition_path.required_training.map((t, i) => (
                                      <span key={i} className="px-2 py-1 rounded text-xs bg-slate-800/50 text-slate-400">
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Quick Start */}
                              <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-xs text-emerald-400 font-medium mb-1">🚀 Action immédiate :</p>
                                <p className="text-sm text-slate-300">{job.transition_path.quick_start}</p>
                              </div>
                            </div>

                            {/* Salary */}
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                              <DollarSign className="w-5 h-5 text-green-400" />
                              <div className="flex-1">
                                <p className="text-sm text-slate-300">
                                  <span className="text-slate-500">Entrée:</span> {job.salary_range.entry}
                                  <span className="mx-2 text-slate-600">→</span>
                                  <span className="text-slate-500">Confirmé:</span> {job.salary_range.experienced}
                                </p>
                              </div>
                              <span className={cn(
                                'px-2 py-1 rounded text-xs',
                                job.salary_range.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
                                job.salary_range.trend === 'stable' ? 'bg-slate-500/20 text-slate-400' :
                                'bg-rose-500/20 text-rose-400'
                              )}>
                                {job.salary_range.trend === 'up' ? '↗️ En hausse' : job.salary_range.trend === 'stable' ? '→ Stable' : '↘️ En baisse'}
                              </span>
                            </div>

                            {/* Warning */}
                            {job.warning && (
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-300/80">{job.warning}</p>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </motion.div>
                  )}

                  {/* Surprise Recommendation */}
                  {suggestions.surprise_recommendation && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h4 className="font-medium text-purple-400">💡 Suggestion Surprise</h4>
                      </div>
                      <p className="text-lg font-serif text-slate-200 mb-2">{suggestions.surprise_recommendation.job_title}</p>
                      <p className="text-sm text-slate-400 mb-2">
                        <span className="text-purple-400">Pourquoi c'est inattendu :</span> {suggestions.surprise_recommendation.why_surprising}
                      </p>
                      <p className="text-sm text-slate-300">
                        <span className="text-emerald-400">Pourquoi c'est parfait :</span> {suggestions.surprise_recommendation.why_perfect}
                      </p>
                    </div>
                  )}

                  {/* Avoid These */}
                  {suggestions.avoid_these.length > 0 && (
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                      <h4 className="text-sm font-medium text-rose-400 mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Métiers à éviter
                      </h4>
                      <div className="space-y-2">
                        {suggestions.avoid_these.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-rose-400">✗</span>
                            <div>
                              <span className="text-sm text-slate-300 font-medium">{item.job_title}</span>
                              <p className="text-xs text-slate-500">{item.why}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Step CTA */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-sm text-emerald-400 font-medium mb-2">🎯 Prochaine étape</p>
                    <p className="text-slate-300">{suggestions.next_step}</p>
                  </div>

                  {/* Refresh Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={fetchSuggestions}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Régénérer les suggestions
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

