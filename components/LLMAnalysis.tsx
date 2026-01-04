'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Brain, Sparkles, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Target, Shield, Zap, Clock, Wrench } from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// ============================================================================
// Types pour les réponses LLM
// ============================================================================

interface VulnerabilityAnalysis {
  global_diagnostic: {
    headline: string;
    summary: string;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    opportunity_score: number;
  };
  vulnerability_analysis: {
    main_exposure: string;
    timeline: string;
    sectors_comparison: string;
  };
  strengths_identified: Array<{
    strength: string;
    why_resilient: string;
    how_to_leverage: string;
  }>;
  critical_tasks: {
    to_abandon: Array<{ task: string; reason: string; replacement: string }>;
    to_augment: Array<{ task: string; how: string; tool_suggestion: string }>;
    to_protect: Array<{ task: string; why: string }>;
  };
  strategic_recommendations: Array<{
    priority: number;
    action: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    timeframe: string;
  }>;
  closing_message: string;
}

// ============================================================================
// Composant : Analyse de Vulnérabilité LLM (Step 6)
// ============================================================================

export function LLMVulnerabilityAnalysis() {
  const locale = useLocale();
  const { context, tasks, talents, getResilienceScore, getTalentScore, phantomCharge, getPhantomChargeGain } = useAuditStore();
  const [analysis, setAnalysis] = useState<VulnerabilityAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const resilienceScore = getResilienceScore();
  const talentScore = getTalentScore();
  const phantomGain = getPhantomChargeGain();

  // Calcul du score d'une tâche
  const getTaskScore = (task: typeof tasks[0]): number => {
    const { donnees, decision, relationnel, creativite, execution } = task.resilience;
    return Math.round((donnees + decision + relationnel + creativite + execution) / 5);
  };

  const fetchAnalysis = async () => {
    if (!context.jobTitle || !context.industry || tasks.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-vulnerability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: context.jobTitle,
          sector: context.industry,
          yearsExperience: context.yearsExperience,
          teamSize: context.teamSize,
          tasks: tasks.map(t => ({
            name: t.name,
            resilienceScore: getTaskScore(t),
            timeAllocation: t.hoursPerWeek,
          })),
          talents: talents.filter(t => t.selected).map(t => ({
            name: t.name,
            level: t.level,
            category: 'strategic', // Default category
          })),
          scores: {
            globalResilience: resilienceScore,
            talentSignature: talentScore,
            iaExposition: 100 - resilienceScore,
          },
          goal: context.goal || 'augmentation',
          phantomCharge: phantomCharge.isEnabled ? {
            weeklyEmailHours: phantomGain.weeklyHours,
            potentialGainHours: phantomGain.weeklyHours * (phantomGain.weeklyHours > 0 ? 0.7 : 0),
          } : undefined,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch au montage si données disponibles
  useEffect(() => {
    if (context.jobTitle && context.industry && tasks.length > 0 && !analysis) {
      fetchAnalysis();
    }
  }, [context.jobTitle, context.industry, tasks.length]);

  if (!context.jobTitle || !context.industry || tasks.length === 0) {
    return null;
  }

  const riskColors = {
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <motion.div
      className="apex-card overflow-hidden"
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-200 flex items-center gap-2">
                Analyse Stratégique IA
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Gemini 2.0
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Commentaires personnalisés basés sur votre diagnostic
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analysis && (
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border',
                riskColors[analysis.global_diagnostic.risk_level]
              )}>
                {analysis.global_diagnostic.risk_level === 'critical' ? '⚠️ Critique' :
                 analysis.global_diagnostic.risk_level === 'high' ? '⚡ Élevé' :
                 analysis.global_diagnostic.risk_level === 'medium' ? '〰️ Modéré' : '✓ Faible'}
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
                    <Brain className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-slate-400 mb-2">Analyse en cours...</p>
                  <p className="text-xs text-slate-600">L'IA examine votre profil</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mb-3" />
                  <p className="text-slate-400 mb-4">{error}</p>
                  <button
                    onClick={fetchAnalysis}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Réessayer
                  </button>
                </div>
              )}

              {/* Analysis Results */}
              {analysis && !isLoading && (
                <>
                  {/* Headline */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <p className="text-lg font-medium text-slate-200 mb-2">
                      {analysis.global_diagnostic.headline}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {analysis.global_diagnostic.summary}
                    </p>
                  </div>

                  {/* Vulnerability Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <h4 className="text-sm font-medium text-rose-400">Exposition Principale</h4>
                      </div>
                      <p className="text-sm text-slate-400">{analysis.vulnerability_analysis.main_exposure}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Horizon : {analysis.vulnerability_analysis.timeline}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-medium text-emerald-400">Forces Identifiées</h4>
                      </div>
                      <ul className="space-y-2">
                        {analysis.strengths_identified.slice(0, 2).map((s, i) => (
                          <li key={i} className="text-sm text-slate-400">
                            <span className="text-emerald-400 font-medium">{s.strength}</span>
                            <span className="text-slate-500 text-xs block">{s.why_resilient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Critical Tasks */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Actions sur vos Tâches
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* À Abandonner */}
                      {analysis.critical_tasks.to_abandon.slice(0, 1).map((t, i) => (
                        <div key={i} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                          <p className="text-xs text-rose-400 font-medium mb-1">🚫 À Déléguer</p>
                          <p className="text-sm text-slate-300 font-medium">{t.task}</p>
                          <p className="text-xs text-slate-500 mt-1">→ {t.replacement}</p>
                        </div>
                      ))}

                      {/* À Augmenter */}
                      {analysis.critical_tasks.to_augment.slice(0, 1).map((t, i) => (
                        <div key={i} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                          <p className="text-xs text-amber-400 font-medium mb-1">⚡ À Augmenter</p>
                          <p className="text-sm text-slate-300 font-medium">{t.task}</p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Wrench className="w-3 h-3" /> {t.tool_suggestion}
                          </p>
                        </div>
                      ))}

                      {/* À Protéger */}
                      {analysis.critical_tasks.to_protect.slice(0, 1).map((t, i) => (
                        <div key={i} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                          <p className="text-xs text-emerald-400 font-medium mb-1">🛡️ À Protéger</p>
                          <p className="text-sm text-slate-300 font-medium">{t.task}</p>
                          <p className="text-xs text-slate-500 mt-1">{t.why}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Recommendations */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Recommandations Prioritaires
                    </h4>
                    <div className="space-y-2">
                      {analysis.strategic_recommendations.slice(0, 3).map((rec, i) => (
                        <div 
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
                        >
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                            rec.priority === 1 ? 'bg-rose-500/20 text-rose-400' :
                            rec.priority === 2 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          )}>
                            {rec.priority}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-200 font-medium">{rec.action}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span>Impact: {rec.impact}</span>
                              <span>•</span>
                              <span>Effort: {rec.effort === 'low' ? 'Faible' : rec.effort === 'medium' ? 'Moyen' : 'Élevé'}</span>
                              <span>•</span>
                              <span>{rec.timeframe}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Closing Message */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      "{analysis.closing_message}"
                    </p>
                  </div>

                  {/* Refresh Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={fetchAnalysis}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Régénérer l'analyse
                    </button>
                  </div>
                </>
              )}

              {/* Initial State - No Analysis Yet */}
              {!analysis && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Brain className="w-10 h-10 text-slate-600 mb-4" />
                  <p className="text-slate-400 mb-4 text-center">
                    Obtenez une analyse stratégique personnalisée de votre profil
                  </p>
                  <button
                    onClick={fetchAnalysis}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Lancer l'analyse IA
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

