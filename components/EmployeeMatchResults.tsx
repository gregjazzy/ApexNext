'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  Target,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useState } from 'react';
import { useAuditStore, EmployeeMatch, CompetenceCategory } from '@/lib/store';

// ===============================================
// RÉSULTATS DE MATCHING GPEC
// Affiche le score de compatibilité et les gaps
// ===============================================

const CATEGORY_COLORS: Record<CompetenceCategory, { bg: string; text: string; border: string }> = {
  haptique: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  relationnelle: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  technique: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
};

const CATEGORY_LABELS: Record<CompetenceCategory, { fr: string; en: string }> = {
  haptique: { fr: 'Haptique', en: 'Haptic' },
  relationnelle: { fr: 'Relationnelle', en: 'Relational' },
  technique: { fr: 'Technique', en: 'Technical' },
};

const RECOMMENDATION_CONFIG = {
  ideal: { 
    label: { fr: 'Candidat Idéal', en: 'Ideal Candidate' },
    color: 'emerald',
    icon: Sparkles
  },
  good: { 
    label: { fr: 'Bonne Affinité', en: 'Good Fit' },
    color: 'blue',
    icon: CheckCircle2
  },
  possible: { 
    label: { fr: 'Possible avec Formation', en: 'Possible with Training' },
    color: 'amber',
    icon: TrendingUp
  },
  difficult: { 
    label: { fr: 'Transition Difficile', en: 'Difficult Transition' },
    color: 'rose',
    icon: AlertTriangle
  },
};

export function EmployeeMatchResults() {
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { enterpriseTargets, cohortData } = useAuditStore();
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const matches = enterpriseTargets.employeeMatches;
  const futureJobs = enterpriseTargets.futureJobs;

  // Filtrer par poste si sélectionné
  const filteredMatches = selectedJob 
    ? matches.filter(m => m.futureJobId === selectedJob)
    : matches;

  // Grouper par recommandation
  const groupedMatches = {
    ideal: filteredMatches.filter(m => m.recommendation === 'ideal'),
    good: filteredMatches.filter(m => m.recommendation === 'good'),
    possible: filteredMatches.filter(m => m.recommendation === 'possible'),
    difficult: filteredMatches.filter(m => m.recommendation === 'difficult'),
  };

  if (matches.length === 0) {
    return (
      <div className="bg-slate-900/30 rounded-2xl border border-dashed border-slate-700 p-8 text-center">
        <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-400 mb-2">
          {l === 'fr' ? 'Aucun matching calculé' : 'No matching calculated'}
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {l === 'fr'
            ? "Configurez d'abord les Métiers de Demain dans le module GPEC pour calculer les correspondances."
            : "First configure the Jobs of Tomorrow in the GPEC module to calculate matches."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {l === 'fr' ? 'Analyse de Compatibilité' : 'Compatibility Analysis'}
            </h3>
            <p className="text-sm text-slate-400">
              {l === 'fr' 
                ? `${matches.length} correspondances analysées`
                : `${matches.length} matches analyzed`
              }
            </p>
          </div>
        </div>

        {/* Filtre par poste */}
        <select
          value={selectedJob || ''}
          onChange={(e) => setSelectedJob(e.target.value || null)}
          className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
        >
          <option value="">{l === 'fr' ? 'Tous les postes' : 'All positions'}</option>
          {futureJobs.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>
      </div>

      {/* Résumé KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {(['ideal', 'good', 'possible', 'difficult'] as const).map((rec) => {
          const config = RECOMMENDATION_CONFIG[rec];
          const Icon = config.icon;
          const count = groupedMatches[rec].length;
          
          return (
            <div 
              key={rec}
              className={`p-3 rounded-xl bg-${config.color}-500/10 border border-${config.color}-500/20`}
            >
              <Icon className={`w-5 h-5 text-${config.color}-400 mb-2`} />
              <div className={`text-2xl font-bold text-${config.color}-400`}>{count}</div>
              <div className="text-xs text-slate-400">{config.label[l]}</div>
            </div>
          );
        })}
      </div>

      {/* Liste des matches */}
      <div className="space-y-3">
        {filteredMatches.slice(0, 10).map((match) => {
          const recConfig = RECOMMENDATION_CONFIG[match.recommendation];
          const RecIcon = recConfig.icon;
          const isExpanded = expandedMatch === `${match.employeeId}-${match.futureJobId}`;
          const totalTrainingHours = match.competenceGaps.reduce((sum, g) => sum + g.trainingHours, 0);

          return (
            <motion.div
              key={`${match.employeeId}-${match.futureJobId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 rounded-xl border border-slate-800/50 overflow-hidden"
            >
              {/* Match Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                onClick={() => setExpandedMatch(isExpanded ? null : `${match.employeeId}-${match.futureJobId}`)}
              >
                <div className="flex items-center gap-4">
                  {/* Score circulaire */}
                  <div className="relative w-14 h-14">
                    <svg className="w-14 h-14 -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-slate-700"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${match.compatibilityScore * 1.51} 151`}
                        className={`text-${recConfig.color}-400`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-sm font-bold text-${recConfig.color}-400`}>
                        {match.compatibilityScore}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{match.employeeName}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${recConfig.color}-500/20 text-${recConfig.color}-400`}>
                        <RecIcon className="w-3 h-3 inline mr-1" />
                        {recConfig.label[l]}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      {match.futureJobTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {match.competenceGaps.length > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-amber-400 font-medium">
                        {match.competenceGaps.length} {l === 'fr' ? 'écart(s)' : 'gap(s)'}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {totalTrainingHours}h {l === 'fr' ? 'formation' : 'training'}
                      </div>
                    </div>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Détails (Expanded) */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-slate-800/50 p-4 space-y-4"
                >
                  {/* Points forts */}
                  {match.strengths.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        {l === 'fr' ? 'Points Forts Identifiés' : 'Identified Strengths'}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {match.strengths.map((strength, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gap de Compétences */}
                  {match.competenceGaps.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        {l === 'fr' ? 'Gap de Compétences à Combler' : 'Competency Gaps to Fill'}
                      </h5>
                      <div className="space-y-2">
                        {match.competenceGaps.map((gap) => {
                          const catColor = CATEGORY_COLORS[gap.category];
                          return (
                            <div
                              key={gap.competenceId}
                              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs ${catColor.bg} ${catColor.text}`}>
                                  {CATEGORY_LABELS[gap.category][l]}
                                </span>
                                <span className="text-sm text-white">{gap.competenceName}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-sm">
                                    <span className="text-slate-400">Niveau</span>
                                    <span className="text-rose-400">{gap.currentLevel}</span>
                                    <span className="text-slate-600">→</span>
                                    <span className="text-emerald-400">{gap.requiredLevel}</span>
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    Écart: {Math.abs(gap.gap)} niveau(x)
                                  </div>
                                </div>
                                <div className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs">
                                  {gap.trainingHours}h
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Total formation */}
                      <div className="mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center justify-between">
                        <span className="text-sm text-amber-400">
                          {l === 'fr' ? 'Formation totale estimée' : 'Estimated total training'}
                        </span>
                        <span className="text-lg font-bold text-amber-400">
                          {totalTrainingHours} {l === 'fr' ? 'heures' : 'hours'}
                        </span>
                      </div>
                    </div>
                  )}

                  {match.competenceGaps.length === 0 && (
                    <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm text-emerald-400">
                        {l === 'fr' 
                          ? 'Aucun écart de compétence détecté — Transition immédiate possible'
                          : 'No competency gap detected — Immediate transition possible'
                        }
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {filteredMatches.length > 10 && (
          <p className="text-center text-sm text-slate-500 py-2">
            {l === 'fr' 
              ? `... et ${filteredMatches.length - 10} autres correspondances`
              : `... and ${filteredMatches.length - 10} more matches`
            }
          </p>
        )}
      </div>
    </div>
  );
}

