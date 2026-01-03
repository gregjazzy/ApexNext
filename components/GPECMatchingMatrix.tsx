'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  Users,
  Briefcase,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Filter,
  BarChart3,
  Clock,
  GraduationCap,
  Shield,
  Zap,
  X,
  Star,
  Award
} from 'lucide-react';
import { useAuditStore, EmployeeMatch, CompetenceCategory } from '@/lib/store';

// ===============================================
// MATRICE DE MATCHING GPEC
// Vue décideur RH : quel salarié pour quel poste ?
// ===============================================

const CATEGORY_COLORS: Record<CompetenceCategory, { bg: string; text: string; border: string }> = {
  haptique: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  relationnelle: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  technique: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
};

const RECOMMENDATION_CONFIG = {
  ideal: { 
    label: { fr: 'Candidat Idéal', en: 'Ideal Candidate' },
    color: 'emerald',
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    icon: Star
  },
  good: { 
    label: { fr: 'Bonne Affinité', en: 'Good Fit' },
    color: 'blue',
    bgClass: 'bg-blue-500/20',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    icon: CheckCircle2
  },
  possible: { 
    label: { fr: 'Possible avec Formation', en: 'Possible with Training' },
    color: 'amber',
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    icon: TrendingUp
  },
  difficult: { 
    label: { fr: 'Transition Difficile', en: 'Difficult Transition' },
    color: 'rose',
    bgClass: 'bg-rose-500/20',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/30',
    icon: AlertTriangle
  },
};

interface MatchingMatrixProps {
  onSelectMatch?: (match: EmployeeMatch) => void;
}

export function GPECMatchingMatrix({ onSelectMatch }: MatchingMatrixProps) {
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { enterpriseTargets, cohortData } = useAuditStore();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<EmployeeMatch | null>(null);

  const matches = enterpriseTargets.employeeMatches;
  const futureJobs = enterpriseTargets.futureJobs;
  const members = cohortData.members;

  // Filtrer les matches
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (selectedJob && m.futureJobId !== selectedJob) return false;
      if (selectedRecommendation && m.recommendation !== selectedRecommendation) return false;
      return true;
    });
  }, [matches, selectedJob, selectedRecommendation]);

  // Grouper par poste cible
  const matchesByJob = useMemo(() => {
    const grouped: Record<string, EmployeeMatch[]> = {};
    for (const job of futureJobs) {
      grouped[job.id] = filteredMatches
        .filter(m => m.futureJobId === job.id)
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }
    return grouped;
  }, [filteredMatches, futureJobs]);

  // Statistiques globales
  const stats = useMemo(() => {
    const total = matches.length;
    const ideal = matches.filter(m => m.recommendation === 'ideal').length;
    const good = matches.filter(m => m.recommendation === 'good').length;
    const possible = matches.filter(m => m.recommendation === 'possible').length;
    const difficult = matches.filter(m => m.recommendation === 'difficult').length;
    const avgScore = total > 0 ? Math.round(matches.reduce((acc, m) => acc + m.compatibilityScore, 0) / total) : 0;
    const totalTrainingHours = matches.reduce((acc, m) => 
      acc + m.competenceGaps.reduce((a, g) => a + g.trainingHours, 0), 0
    );
    
    return { total, ideal, good, possible, difficult, avgScore, totalTrainingHours };
  }, [matches]);

  // Meilleur candidat par poste
  const bestCandidatesByJob = useMemo(() => {
    const best: Record<string, EmployeeMatch | null> = {};
    for (const job of futureJobs) {
      const jobMatches = matches.filter(m => m.futureJobId === job.id);
      best[job.id] = jobMatches.length > 0 
        ? jobMatches.reduce((a, b) => a.compatibilityScore > b.compatibilityScore ? a : b)
        : null;
    }
    return best;
  }, [matches, futureJobs]);

  if (matches.length === 0) {
    return (
      <div className="bg-slate-900/30 rounded-2xl border border-dashed border-slate-700 p-12 text-center">
        <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-slate-300 mb-2">
          {l === 'fr' ? 'Aucun matching disponible' : 'No matching available'}
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {l === 'fr'
            ? "Ajoutez des collaborateurs à la cohorte et définissez des Métiers de Demain pour voir la matrice de matching."
            : "Add team members to the cohort and define Jobs of Tomorrow to see the matching matrix."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec KPIs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center border border-emerald-500/30">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-white">
              {l === 'fr' ? 'Matrice de Matching GPEC' : 'GPEC Matching Matrix'}
            </h2>
            <p className="text-sm text-slate-400">
              {l === 'fr' 
                ? `${members.length} collaborateur(s) × ${futureJobs.length} poste(s) cible(s)`
                : `${members.length} employee(s) × ${futureJobs.length} target position(s)`
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <span className="text-2xl font-bold text-emerald-400">{stats.avgScore}%</span>
            <span className="text-xs text-slate-400 ml-2">
              {l === 'fr' ? 'Score moyen' : 'Avg Score'}
            </span>
          </div>
        </div>
      </div>

      {/* Statistiques Rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(['ideal', 'good', 'possible', 'difficult'] as const).map((rec) => {
          const config = RECOMMENDATION_CONFIG[rec];
          const Icon = config.icon;
          const count = stats[rec];
          const isSelected = selectedRecommendation === rec;
          
          return (
            <motion.button
              key={rec}
              onClick={() => setSelectedRecommendation(isSelected ? null : rec)}
              className={`p-3 rounded-xl border transition-all ${
                isSelected
                  ? `${config.bgClass} ${config.borderClass} ring-2 ring-${config.color}-400/30`
                  : `bg-slate-900/50 border-slate-800/50 hover:border-slate-700`
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-5 h-5 ${config.textClass} mb-2`} />
              <div className={`text-2xl font-bold ${isSelected ? config.textClass : 'text-white'}`}>
                {count}
              </div>
              <div className="text-xs text-slate-500">{config.label[l]}</div>
            </motion.button>
          );
        })}
        
        {/* Total heures formation */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
          <Clock className="w-5 h-5 text-violet-400 mb-2" />
          <div className="text-2xl font-bold text-violet-400">{stats.totalTrainingHours}h</div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'Formation totale' : 'Total Training'}
          </div>
        </div>
      </div>

      {/* Filtre par poste */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <span className="text-sm text-slate-500 flex items-center gap-1 flex-shrink-0">
          <Filter className="w-4 h-4" />
          {l === 'fr' ? 'Poste:' : 'Position:'}
        </span>
        <button
          onClick={() => setSelectedJob(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
            !selectedJob 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          {l === 'fr' ? 'Tous' : 'All'}
        </button>
        {futureJobs.map(job => (
          <button
            key={job.id}
            onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
              selectedJob === job.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
            }`}
          >
            {job.title}
          </button>
        ))}
      </div>

      {/* Vue Matrice par Poste */}
      <div className="space-y-6">
        {futureJobs.map((job) => {
          const jobMatches = matchesByJob[job.id] || [];
          const bestCandidate = bestCandidatesByJob[job.id];
          
          if (selectedJob && selectedJob !== job.id) return null;
          
          return (
            <motion.div
              key={job.id}
              className="bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header du poste */}
              <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.headcount} {l === 'fr' ? 'poste(s)' : 'position(s)'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-emerald-400" />
                          {job.automationResistance}% {l === 'fr' ? 'résilience' : 'resilience'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Meilleur candidat */}
                  {bestCandidate && (
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-400">
                          {l === 'fr' ? 'Meilleur candidat' : 'Best candidate'}
                        </div>
                        <div className="text-white font-semibold">
                          {bestCandidate.employeeName} ({bestCandidate.compatibilityScore}%)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Liste des candidats */}
              <div className="divide-y divide-slate-800/50">
                {jobMatches.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      {l === 'fr' ? 'Aucun candidat trouvé avec ces filtres' : 'No candidates found with these filters'}
                    </p>
                  </div>
                ) : (
                  jobMatches.slice(0, 5).map((match, index) => {
                    const recConfig = RECOMMENDATION_CONFIG[match.recommendation];
                    const RecIcon = recConfig.icon;
                    const isTopCandidate = index === 0;
                    
                    return (
                      <motion.div
                        key={`${match.employeeId}-${match.futureJobId}`}
                        className={`p-4 flex items-center justify-between hover:bg-slate-800/30 cursor-pointer transition-colors ${
                          isTopCandidate ? 'bg-emerald-500/5' : ''
                        }`}
                        onClick={() => {
                          setSelectedMatch(match);
                          onSelectMatch?.(match);
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rang */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            isTopCandidate ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-slate-500'
                          }`}>
                            #{index + 1}
                          </div>
                          
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                            {match.employeeName.charAt(0).toUpperCase()}
                          </div>
                          
                          {/* Infos */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{match.employeeName}</span>
                              {isTopCandidate && (
                                <Sparkles className="w-4 h-4 text-amber-400" />
                              )}
                            </div>
                            {match.strengths.length > 0 && (
                              <div className="flex items-center gap-1 mt-0.5">
                                {match.strengths.slice(0, 2).map((strength, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-400"
                                  >
                                    {strength.length > 20 ? strength.slice(0, 20) + '...' : strength}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {/* Gaps */}
                          {match.competenceGaps.length > 0 && (
                            <div className="text-right">
                              <div className="text-sm text-amber-400 font-medium">
                                {match.competenceGaps.length} {l === 'fr' ? 'gap(s)' : 'gap(s)'}
                              </div>
                              <div className="text-xs text-slate-500">
                                {match.competenceGaps.reduce((a, g) => a + g.trainingHours, 0)}h {l === 'fr' ? 'formation' : 'training'}
                              </div>
                            </div>
                          )}
                          
                          {/* Score */}
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
                                className={recConfig.textClass}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-sm font-bold ${recConfig.textClass}`}>
                                {match.compatibilityScore}%
                              </span>
                            </div>
                          </div>
                          
                          {/* Badge */}
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${recConfig.bgClass} border ${recConfig.borderClass}`}>
                            <RecIcon className={`w-4 h-4 ${recConfig.textClass}`} />
                            <span className={`text-xs font-medium ${recConfig.textClass}`}>
                              {recConfig.label[l]}
                            </span>
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-slate-600" />
                        </div>
                      </motion.div>
                    );
                  })
                )}
                
                {jobMatches.length > 5 && (
                  <div className="p-3 text-center text-sm text-slate-500">
                    + {jobMatches.length - 5} {l === 'fr' ? 'autres candidats' : 'more candidates'}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Détail Match */}
      <AnimatePresence>
        {selectedMatch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 z-[99]"
              onClick={() => setSelectedMatch(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-20 z-[100] bg-slate-900 rounded-2xl border border-slate-700 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-white text-xl font-bold">
                      {selectedMatch.employeeName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedMatch.employeeName}</h3>
                      <p className="text-slate-400 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        {selectedMatch.futureJobTitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Score et Recommandation */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-slate-800/50 text-center">
                    <div className="text-4xl font-bold text-emerald-400 mb-1">
                      {selectedMatch.compatibilityScore}%
                    </div>
                    <div className="text-sm text-slate-400">
                      {l === 'fr' ? 'Score de Compatibilité' : 'Compatibility Score'}
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${RECOMMENDATION_CONFIG[selectedMatch.recommendation].bgClass} text-center`}>
                    <div className={`text-xl font-bold ${RECOMMENDATION_CONFIG[selectedMatch.recommendation].textClass} mb-1`}>
                      {RECOMMENDATION_CONFIG[selectedMatch.recommendation].label[l]}
                    </div>
                    <div className="text-sm text-slate-400">
                      {l === 'fr' ? 'Recommandation' : 'Recommendation'}
                    </div>
                  </div>
                </div>

                {/* Points Forts */}
                {selectedMatch.strengths.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      {l === 'fr' ? 'Points Forts Identifiés' : 'Identified Strengths'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMatch.strengths.map((strength, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gap de Compétences */}
                {selectedMatch.competenceGaps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      {l === 'fr' ? 'Gap de Compétences — Plan de Reskilling' : 'Competency Gap — Reskilling Plan'}
                    </h4>
                    <div className="space-y-3">
                      {selectedMatch.competenceGaps.map((gap) => {
                        const catColor = CATEGORY_COLORS[gap.category];
                        return (
                          <div
                            key={gap.competenceId}
                            className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${catColor.bg} ${catColor.text}`}>
                                  {gap.category === 'haptique' ? (l === 'fr' ? 'Haptique' : 'Haptic') :
                                   gap.category === 'relationnelle' ? (l === 'fr' ? 'Relationnelle' : 'Relational') :
                                   (l === 'fr' ? 'Technique' : 'Technical')}
                                </span>
                                <span className="font-medium text-white">{gap.competenceName}</span>
                              </div>
                              <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium">
                                {gap.trainingHours}h
                              </span>
                            </div>
                            
                            {/* Barre de progression niveau */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500 w-24">
                                Niveau {gap.currentLevel} → {gap.requiredLevel}
                              </span>
                              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
                                  style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-rose-400">
                                -{Math.abs(gap.gap)} niveau(x)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Total Formation */}
                    <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                      <span className="text-amber-400 font-medium">
                        {l === 'fr' ? 'Formation totale estimée' : 'Estimated total training'}
                      </span>
                      <span className="text-2xl font-bold text-amber-400">
                        {selectedMatch.competenceGaps.reduce((a, g) => a + g.trainingHours, 0)} {l === 'fr' ? 'heures' : 'hours'}
                      </span>
                    </div>
                  </div>
                )}

                {selectedMatch.competenceGaps.length === 0 && (
                  <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-emerald-400 mb-1">
                      {l === 'fr' ? 'Aucun gap détecté' : 'No gap detected'}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {l === 'fr' 
                        ? 'Ce collaborateur possède toutes les compétences requises pour ce poste.'
                        : 'This employee has all the required skills for this position.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

