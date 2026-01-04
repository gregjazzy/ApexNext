'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Sparkles, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, 
  Target, Clock, CheckCircle2, ArrowRight, Zap, BookOpen, 
  Calendar, TrendingUp, Wrench, Users, Trophy, Play
} from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// ============================================================================
// Types pour les réponses LLM #3
// ============================================================================

interface MicroTask {
  task_id: string;
  description: string;
  duration: string;
  deliverable: string;
  tool?: string;
  tip?: string;
}

interface KeyAction {
  action_id: string;
  title: string;
  category: 'SKILL' | 'TOOL' | 'NETWORK' | 'MINDSET' | 'PROJECT';
  priority: 'P1' | 'P2' | 'P3';
  total_duration: string;
  why_now: string;
  micro_tasks: MicroTask[];
  success_criteria: string;
  failure_mode?: string;
}

interface Phase {
  phase_number: number;
  phase_name: string;
  duration: string;
  objective: string;
  weekly_hours: string;
  key_actions: KeyAction[];
  phase_checkpoint: {
    questions_to_ask: string[];
    minimum_achievements: string[];
    celebration_milestone: string;
  };
}

interface ActionPlan {
  plan_overview: {
    title: string;
    tagline: string;
    total_duration: string;
    weekly_commitment: string;
    expected_outcome: string;
  };
  quick_wins: {
    description: string;
    actions: Array<{
      action_id: string;
      title: string;
      duration: string;
      description: string;
      immediate_benefit: string;
      tool_or_resource?: string;
    }>;
  };
  phases: Phase[];
  tools_stack: {
    essential_tools: Array<{
      tool_name: string;
      category: string;
      why_this_one: string;
      cost: string;
      learning_time: string;
      alternative?: string;
    }>;
  };
  learning_resources: {
    must_do: Array<{
      resource_name: string;
      type: string;
      platform: string;
      duration: string;
      cost: string;
      why_essential: string;
    }>;
  };
  kpis_tracking: {
    weekly_metrics: Array<{
      metric_name: string;
      how_to_measure: string;
      target_week_4: string;
      target_week_8: string;
      target_week_12: string;
    }>;
  };
  contingency_plan: {
    if_falling_behind: string;
    if_losing_motivation: string;
    minimum_viable_plan: string;
  };
  final_deliverable: {
    description: string;
    tangible_outputs: string[];
    market_positioning: string;
  };
}

// ============================================================================
// Composant : Plan d'Action Opérationnel (LLM #3)
// ============================================================================

export function LLMActionPlan() {
  const { context, tasks, talents, getResilienceScore, getTalentScore, phantomCharge } = useAuditStore();
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activePhase, setActivePhase] = useState(0);
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  const resilienceScore = getResilienceScore();
  const talentScore = getTalentScore();
  const selectedTalents = talents.filter(t => t.selected);

  // Calcul du score d'une tâche
  const getTaskScore = (task: typeof tasks[0]): number => {
    const { donnees, decision, relationnel, creativite, execution } = task.resilience;
    return Math.round((donnees + decision + relationnel + creativite + execution) / 5);
  };

  const vulnerableTasks = tasks
    .map(t => ({ ...t, score: getTaskScore(t) }))
    .filter(t => t.score < 50)
    .sort((a, b) => a.score - b.score);

  const resilientTasks = tasks
    .map(t => ({ ...t, score: getTaskScore(t) }))
    .filter(t => t.score >= 50)
    .sort((a, b) => b.score - a.score);

  const fetchActionPlan = async () => {
    if (!context.jobTitle || !context.industry) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: context.jobTitle,
          sector: context.industry,
          yearsExperience: context.yearsExperience,
          goal: context.goal || 'augmentation',
          vulnerableTasks: vulnerableTasks.slice(0, 5).map(t => ({
            name: t.name,
            resilienceScore: t.score,
          })),
          resilientTasks: resilientTasks.slice(0, 5).map(t => ({
            name: t.name,
            resilienceScore: t.score,
          })),
          topTalents: selectedTalents.slice(0, 5).map(t => ({
            name: t.name,
            level: t.level,
          })),
          scores: {
            globalResilience: resilienceScore,
            talentSignature: talentScore,
          },
          availableTime: phantomCharge.isEnabled ? {
            weeklyHoursGained: phantomCharge.potentialGainHours || 0,
          } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du plan');
      }

      const data = await response.json();
      setActionPlan(data.actionPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAction = (actionId: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedActions(newExpanded);
  };

  const categoryIcons: Record<string, typeof Target> = {
    SKILL: BookOpen,
    TOOL: Wrench,
    NETWORK: Users,
    MINDSET: Target,
    PROJECT: Trophy,
  };

  const categoryColors: Record<string, string> = {
    SKILL: 'text-blue-400 bg-blue-500/20',
    TOOL: 'text-emerald-400 bg-emerald-500/20',
    NETWORK: 'text-purple-400 bg-purple-500/20',
    MINDSET: 'text-amber-400 bg-amber-500/20',
    PROJECT: 'text-rose-400 bg-rose-500/20',
  };

  const priorityColors: Record<string, string> = {
    P1: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    P2: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    P3: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  return (
    <motion.div
      className="apex-card overflow-hidden border-2 border-emerald-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div 
        className="p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-slate-800/50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-slate-200 flex items-center gap-2">
                Plan d'Action Opérationnel
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  IA Gemini
                </span>
              </h3>
              <p className="text-sm text-slate-500">
                Roadmap 12 semaines avec micro-tâches actionnables
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actionPlan && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {actionPlan.phases.length} phases
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
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 animate-pulse">
                    <Rocket className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-slate-400 mb-2">Construction du plan en cours...</p>
                  <p className="text-xs text-slate-600">L'IA prépare votre roadmap personnalisée</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mb-3" />
                  <p className="text-slate-400 mb-4">{error}</p>
                  <button
                    onClick={fetchActionPlan}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Réessayer
                  </button>
                </div>
              )}

              {/* Initial State */}
              {!actionPlan && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Rocket className="w-12 h-12 text-slate-600 mb-4" />
                  <h4 className="text-lg font-medium text-slate-300 mb-2">
                    Générez votre plan d'action
                  </h4>
                  <p className="text-slate-500 mb-6 text-center max-w-md text-sm">
                    L'IA va créer une roadmap détaillée avec des actions concrètes et des micro-tâches 
                    de 30 minutes maximum que vous pouvez commencer dès demain.
                  </p>
                  <button
                    onClick={fetchActionPlan}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                    Créer mon plan d'action
                  </button>
                </div>
              )}

              {/* Action Plan Results */}
              {actionPlan && !isLoading && (
                <>
                  {/* Plan Overview */}
                  <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <h4 className="text-xl font-serif text-emerald-400 mb-2">{actionPlan.plan_overview.title}</h4>
                    <p className="text-slate-300 italic mb-4">{actionPlan.plan_overview.tagline}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-slate-800/50">
                        <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-200">{actionPlan.plan_overview.total_duration}</p>
                        <p className="text-xs text-slate-500">Durée totale</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-slate-800/50">
                        <Calendar className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-200">{actionPlan.plan_overview.weekly_commitment}</p>
                        <p className="text-xs text-slate-500">Par semaine</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-slate-800/50">
                        <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-200">{actionPlan.phases.length}</p>
                        <p className="text-xs text-slate-500">Phases</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs text-emerald-400 font-medium mb-1">🎯 Résultat attendu :</p>
                      <p className="text-sm text-slate-300">{actionPlan.plan_overview.expected_outcome}</p>
                    </div>
                  </div>

                  {/* Quick Wins */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <h4 className="font-medium text-amber-400">⚡ Quick Wins (48h)</h4>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{actionPlan.quick_wins.description}</p>
                    <div className="space-y-3">
                      {actionPlan.quick_wins.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Play className="w-3 h-3 text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-200">{action.title}</span>
                              <span className="text-xs text-slate-500">({action.duration})</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{action.description}</p>
                            <p className="text-xs text-emerald-400">✓ {action.immediate_benefit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {actionPlan.phases.map((phase, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhase(i)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                          activePhase === i
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
                        )}
                      >
                        Phase {phase.phase_number}: {phase.phase_name}
                      </button>
                    ))}
                  </div>

                  {/* Active Phase Content */}
                  {actionPlan.phases[activePhase] && (
                    <motion.div
                      key={activePhase}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-serif text-slate-200">
                            Phase {actionPlan.phases[activePhase].phase_number}: {actionPlan.phases[activePhase].phase_name}
                          </h3>
                          <p className="text-sm text-slate-500">{actionPlan.phases[activePhase].objective}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 rounded-full text-xs bg-slate-800 text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {actionPlan.phases[activePhase].duration}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                            {actionPlan.phases[activePhase].weekly_hours}/semaine
                          </span>
                        </div>
                      </div>

                      {/* Key Actions */}
                      <div className="space-y-3">
                        {actionPlan.phases[activePhase].key_actions.map((action) => {
                          const Icon = categoryIcons[action.category] || Target;
                          const isActionExpanded = expandedActions.has(action.action_id);
                          
                          return (
                            <div 
                              key={action.action_id} 
                              className="rounded-xl bg-slate-800/30 border border-slate-700/30 overflow-hidden"
                            >
                              {/* Action Header */}
                              <div 
                                className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                                onClick={() => toggleAction(action.action_id)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', categoryColors[action.category])}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-slate-200">{action.title}</span>
                                      <span className={cn('px-2 py-0.5 rounded text-xs border', priorityColors[action.priority])}>
                                        {action.priority}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2">{action.why_now}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {action.total_duration}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        {action.micro_tasks.length} micro-tâches
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowRight className={cn(
                                    'w-5 h-5 text-slate-500 transition-transform',
                                    isActionExpanded && 'rotate-90'
                                  )} />
                                </div>
                              </div>

                              {/* Action Details (Expanded) */}
                              <AnimatePresence>
                                {isActionExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-700/30"
                                  >
                                    <div className="p-4 space-y-4">
                                      {/* Micro Tasks */}
                                      <div>
                                        <p className="text-xs text-slate-500 mb-3 font-medium">📋 Micro-tâches (30 min max chacune)</p>
                                        <div className="space-y-2">
                                          {action.micro_tasks.map((task, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50">
                                              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 flex-shrink-0">
                                                {i + 1}
                                              </span>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <span className="text-sm text-slate-300">{task.description}</span>
                                                  <span className="text-xs text-slate-600">({task.duration})</span>
                                                </div>
                                                {task.deliverable && (
                                                  <p className="text-xs text-emerald-400/80">→ {task.deliverable}</p>
                                                )}
                                                {task.tool && (
                                                  <p className="text-xs text-blue-400/60 mt-1">🔧 {task.tool}</p>
                                                )}
                                                {task.tip && (
                                                  <p className="text-xs text-amber-400/60 mt-1">💡 {task.tip}</p>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Success Criteria */}
                                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                        <p className="text-xs text-emerald-400 font-medium mb-1">✅ Critère de succès</p>
                                        <p className="text-sm text-slate-300">{action.success_criteria}</p>
                                      </div>

                                      {/* Failure Mode */}
                                      {action.failure_mode && (
                                        <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20">
                                          <p className="text-xs text-rose-400 font-medium mb-1">⚠️ Piège à éviter</p>
                                          <p className="text-sm text-slate-400">{action.failure_mode}</p>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      {/* Phase Checkpoint */}
                      <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                        <h5 className="text-sm font-medium text-indigo-400 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Checkpoint fin de phase
                        </h5>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-2">Questions à se poser :</p>
                            <ul className="space-y-1">
                              {actionPlan.phases[activePhase].phase_checkpoint.questions_to_ask.map((q, i) => (
                                <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                  <span className="text-indigo-400">?</span>
                                  {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-2 border-t border-slate-700/30">
                            <p className="text-xs text-emerald-400 font-medium mb-1">
                              🎉 {actionPlan.phases[activePhase].phase_checkpoint.celebration_milestone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tools Stack */}
                  {actionPlan.tools_stack.essential_tools.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                      <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-emerald-400" />
                        Outils essentiels
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {actionPlan.tools_stack.essential_tools.map((tool, i) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-900/50">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-slate-200 text-sm">{tool.tool_name}</span>
                              <span className="text-xs text-emerald-400">{tool.cost}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">{tool.why_this_one}</p>
                            <p className="text-xs text-slate-600">⏱️ {tool.learning_time} pour être opérationnel</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contingency Plan */}
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <h4 className="text-sm font-medium text-amber-400 mb-3">🆘 Plan de secours</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-400">
                        <span className="text-amber-400/80">Si retard :</span> {actionPlan.contingency_plan.if_falling_behind}
                      </p>
                      <p className="text-slate-400">
                        <span className="text-amber-400/80">Si démotivation :</span> {actionPlan.contingency_plan.if_losing_motivation}
                      </p>
                      <p className="text-slate-400">
                        <span className="text-amber-400/80">Plan minimum :</span> {actionPlan.contingency_plan.minimum_viable_plan}
                      </p>
                    </div>
                  </div>

                  {/* Final Deliverable */}
                  <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <h4 className="font-medium text-emerald-400 mb-2 flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Ce que vous aurez accompli
                    </h4>
                    <p className="text-slate-300 mb-4">{actionPlan.final_deliverable.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {actionPlan.final_deliverable.tangible_outputs.map((output, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ✓ {output}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-slate-400 italic">{actionPlan.final_deliverable.market_positioning}</p>
                  </div>

                  {/* Refresh Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={fetchActionPlan}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Régénérer le plan
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

