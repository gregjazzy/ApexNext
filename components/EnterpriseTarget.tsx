'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Target,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Users,
  Clock,
  Shield,
  Sparkles,
  GraduationCap,
  Wrench,
  Heart,
  Check,
  X,
  ArrowRight,
  Info,
  Zap
} from 'lucide-react';
import { useAuditStore, FutureJob, TargetCompetence, CompetenceCategory } from '@/lib/store';
import { BackToHub } from '@/components/ui/BackToHub';

// ===============================================
// MODULE JOB DESIGNER
// Interface RH pour concevoir les "Postes de Demain"
// ===============================================

const COMPETENCE_CATEGORIES: { 
  id: CompetenceCategory; 
  label: { fr: string; en: string }; 
  icon: React.ReactNode; 
  color: string;
  description: { fr: string; en: string };
  examples: { fr: string; en: string };
  resilience: string;
}[] = [
  { 
    id: 'haptique', 
    label: { fr: 'Haptique / Gestuelle', en: 'Haptic / Gestural' },
    icon: <Wrench className="w-4 h-4" />,
    color: 'amber',
    description: {
      fr: 'Compétences liées au toucher, à la dextérité manuelle et à la coordination physique.',
      en: 'Skills related to touch, manual dexterity and physical coordination.'
    },
    examples: {
      fr: 'Chirurgie, artisanat, kinésithérapie, soudure de précision',
      en: 'Surgery, craftsmanship, physiotherapy, precision welding'
    },
    resilience: '95%'
  },
  { 
    id: 'relationnelle', 
    label: { fr: 'Relationnelle / Humaine', en: 'Relational / Human' },
    icon: <Heart className="w-4 h-4" />,
    color: 'rose',
    description: {
      fr: 'Compétences d\'interaction humaine : empathie, négociation, leadership.',
      en: 'Human interaction skills: empathy, negotiation, leadership.'
    },
    examples: {
      fr: 'Management, vente complexe, médiation, coaching',
      en: 'Management, complex sales, mediation, coaching'
    },
    resilience: '90%'
  },
  { 
    id: 'technique', 
    label: { fr: 'Technique / Analytique', en: 'Technical / Analytical' },
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'blue',
    description: {
      fr: 'Compétences analytiques et techniques : programmation, data, ingénierie.',
      en: 'Analytical and technical skills: programming, data, engineering.'
    },
    examples: {
      fr: 'Python, analyse de données, architecture système',
      en: 'Python, data analysis, system architecture'
    },
    resilience: '60%'
  },
];

const URGENCY_OPTIONS = [
  { id: 'immediate' as const, label: { fr: 'Immédiat (< 3 mois)', en: 'Immediate (< 3 months)' } },
  { id: 'short_term' as const, label: { fr: 'Court terme (3-12 mois)', en: 'Short term (3-12 months)' } },
  { id: 'medium_term' as const, label: { fr: 'Moyen terme (1-3 ans)', en: 'Medium term (1-3 years)' } },
];

const HORIZON_OPTIONS = [
  { id: '6_months' as const, label: { fr: '6 mois', en: '6 months' } },
  { id: '1_year' as const, label: { fr: '1 an', en: '1 year' } },
  { id: '3_years' as const, label: { fr: '3 ans', en: '3 years' } },
];

// ===============================================
// CALCUL AUTOMATIQUE DE LA RÉSISTANCE À L'IA
// Basé sur les types de compétences du poste
// ===============================================
const calculateAutomationResistance = (competences: { category: CompetenceCategory }[]) => {
  if (competences.length === 0) return { score: 0, breakdown: null };
  
  const BASE_SCORE = 40;
  const CATEGORY_BONUS = {
    haptique: 30,      // +30% par compétence haptique
    relationnelle: 25, // +25% par compétence relationnelle
    technique: 10,     // +10% par compétence technique
  };
  
  let bonus = 0;
  const counts = { haptique: 0, relationnelle: 0, technique: 0 };
  
  competences.forEach(comp => {
    counts[comp.category]++;
    bonus += CATEGORY_BONUS[comp.category];
  });
  
  // Plafonner à 95% max
  const score = Math.min(95, BASE_SCORE + bonus);
  
  return { 
    score, 
    breakdown: counts,
    bonusDetails: {
      haptique: counts.haptique * CATEGORY_BONUS.haptique,
      relationnelle: counts.relationnelle * CATEGORY_BONUS.relationnelle,
      technique: counts.technique * CATEGORY_BONUS.technique,
    }
  };
};

export function EnterpriseTarget() {
  const locale = useLocale();
  const router = useRouter();
  const l = locale === 'fr' ? 'fr' : 'en';

  const {
    enterpriseTargets,
    setOrganizationName,
    setStrategicHorizon,
    addFutureJob,
    updateFutureJob,
    removeFutureJob,
    addCompetenceToJob,
    removeCompetenceFromJob,
    calculateEmployeeMatches,
    markEnterpriseTargetsConfigured,
  } = useAuditStore();

  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddCompetenceModal, setShowAddCompetenceModal] = useState<string | null>(null);

  // Formulaire nouveau métier
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    description: '',
    headcount: 1,
    urgency: 'short_term' as const,
    automationResistance: 70,
  });

  // Formulaire nouvelle compétence
  const [newCompetence, setNewCompetence] = useState({
    name: '',
    category: 'technique' as CompetenceCategory,
    requiredLevel: 3,
    description: '',
    criticalityScore: 70,
  });

  const handleAddJob = () => {
    if (newJob.title) {
      addFutureJob({
        ...newJob,
        requiredCompetences: [],
      });
      setNewJob({
        title: '',
        department: '',
        description: '',
        headcount: 1,
        urgency: 'short_term',
        automationResistance: 70,
      });
      setShowAddJobModal(false);
    }
  };

  const handleAddCompetence = (jobId: string) => {
    if (newCompetence.name) {
      addCompetenceToJob(jobId, newCompetence);
      setNewCompetence({
        name: '',
        category: 'technique',
        requiredLevel: 3,
        description: '',
        criticalityScore: 70,
      });
      setShowAddCompetenceModal(null);
    }
  };

  const handleValidate = () => {
    // Calculer les matches employés × postes cibles
    calculateEmployeeMatches();
    // Marquer comme configuré
    markEnterpriseTargetsConfigured();
    router.push('/hub');
  };

  const totalHeadcount = enterpriseTargets.futureJobs.reduce((acc, j) => acc + j.headcount, 0);
  const totalCompetences = enterpriseTargets.futureJobs.reduce((acc, j) => acc + j.requiredCompetences.length, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 text-sm font-medium">
          <Building2 className="w-4 h-4" />
          {l === 'fr' ? 'Job Designer — Architecture de Poste' : 'Job Designer — Position Architecture'}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-white">
          {l === 'fr' ? 'Métiers de Demain' : 'Jobs of Tomorrow'}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {l === 'fr'
            ? "Définissez les postes cibles de votre organisation et les compétences clés associées pour calculer les parcours de mobilité optimaux."
            : "Define your organization's target positions and associated key competencies to calculate optimal mobility paths."
          }
        </p>
      </motion.div>

      {/* Configuration Organisation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          {l === 'fr' ? 'Configuration Organisation' : 'Organization Configuration'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {l === 'fr' ? "Nom de l'organisation" : "Organization Name"}
            </label>
            <input
              type="text"
              value={enterpriseTargets.organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder={l === 'fr' ? "Ex: Groupe ACME Industries" : "Ex: ACME Industries Group"}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {l === 'fr' ? "Horizon stratégique" : "Strategic Horizon"}
            </label>
            <select
              value={enterpriseTargets.strategicHorizon}
              onChange={(e) => setStrategicHorizon(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
            >
              {HORIZON_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label[l]}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* KPI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-4 text-center">
          <Briefcase className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{enterpriseTargets.futureJobs.length}</div>
          <div className="text-xs text-slate-500">{l === 'fr' ? 'Métiers définis' : 'Jobs defined'}</div>
        </div>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-4 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{totalHeadcount}</div>
          <div className="text-xs text-slate-500">{l === 'fr' ? 'Postes à pourvoir' : 'Positions to fill'}</div>
        </div>
        <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-4 text-center">
          <GraduationCap className="w-8 h-8 text-violet-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{totalCompetences}</div>
          <div className="text-xs text-slate-500">{l === 'fr' ? 'Compétences clés' : 'Key competencies'}</div>
        </div>
      </motion.div>

      {/* Liste des Métiers de Demain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            {l === 'fr' ? 'Métiers Cibles' : 'Target Jobs'}
          </h2>
          <motion.button
            onClick={() => setShowAddJobModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            {l === 'fr' ? 'Ajouter un métier' : 'Add a job'}
          </motion.button>
        </div>

        {enterpriseTargets.futureJobs.length === 0 ? (
          <div className="bg-slate-900/30 rounded-2xl border border-dashed border-slate-700 p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">
              {l === 'fr' ? 'Aucun métier défini' : 'No jobs defined'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {l === 'fr'
                ? "Commencez par définir les métiers de demain de votre organisation pour permettre le calcul des parcours de mobilité."
                : "Start by defining your organization's jobs of tomorrow to enable mobility path calculation."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {enterpriseTargets.futureJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 rounded-xl border border-slate-800/50 overflow-hidden"
              >
                {/* Job Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{job.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.headcount} {l === 'fr' ? 'poste(s)' : 'position(s)'}</span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          job.urgency === 'immediate' ? 'bg-rose-500/20 text-rose-400' :
                          job.urgency === 'short_term' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {URGENCY_OPTIONS.find(o => o.id === job.urgency)?.label[l]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-slate-400">
                        {job.requiredCompetences.length} {l === 'fr' ? 'compétences' : 'competencies'}
                      </div>
                      {(() => {
                        const resistance = calculateAutomationResistance(job.requiredCompetences);
                        if (resistance.score === 0) {
                          return (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Shield className="w-3 h-3" />
                              {l === 'fr' ? 'Ajoutez des compétences' : 'Add competencies'}
                            </div>
                          );
                        }
                        const colorClass = resistance.score >= 70 ? 'text-emerald-400' : resistance.score >= 50 ? 'text-amber-400' : 'text-rose-400';
                        return (
                          <div className={`flex items-center gap-1 text-xs ${colorClass}`}>
                            <Shield className="w-3 h-3" />
                            {resistance.score}% {l === 'fr' ? 'résilience' : 'resilience'}
                          </div>
                        );
                      })()}
                    </div>
                    {expandedJob === job.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Job Details (Expanded) */}
                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-800/50"
                    >
                      <div className="p-4 space-y-4">
                        {job.description && (
                          <p className="text-sm text-slate-400">{job.description}</p>
                        )}

                        {/* Compétences requises */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-slate-300">
                              {l === 'fr' ? 'Compétences requises' : 'Required competencies'}
                            </h4>
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowAddCompetenceModal(job.id); }}
                              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              {l === 'fr' ? 'Ajouter' : 'Add'}
                            </button>
                          </div>

                          {job.requiredCompetences.length === 0 ? (
                            <p className="text-sm text-slate-500 italic">
                              {l === 'fr' ? 'Aucune compétence définie' : 'No competencies defined'}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {job.requiredCompetences.map((comp) => {
                                const catInfo = COMPETENCE_CATEGORIES.find(c => c.id === comp.category);
                                return (
                                  <div
                                    key={comp.id}
                                    className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-lg bg-${catInfo?.color}-500/20 flex items-center justify-center text-${catInfo?.color}-400`}>
                                        {catInfo?.icon}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-white">{comp.name}</div>
                                        <div className="text-xs text-slate-500">
                                          {catInfo?.label[l]} • Niveau {comp.requiredLevel}/5
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-slate-400">
                                        {comp.criticalityScore}% {l === 'fr' ? 'criticité' : 'criticality'}
                                      </span>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); removeCompetenceFromJob(job.id, comp.id); }}
                                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Résistance calculée */}
                        {(() => {
                          const resistance = calculateAutomationResistance(job.requiredCompetences);
                          if (resistance.score === 0) return null;
                          
                          const colorClass = resistance.score >= 70 ? 'emerald' : resistance.score >= 50 ? 'amber' : 'rose';
                          
                          return (
                            <div className={`p-3 rounded-lg bg-${colorClass}-500/10 border border-${colorClass}-500/30`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Shield className={`w-5 h-5 text-${colorClass}-400`} />
                                  <span className={`font-medium text-${colorClass}-400`}>
                                    {resistance.score}% {l === 'fr' ? 'Résilience IA' : 'AI Resilience'}
                                  </span>
                                </div>
                                <span className={`text-xs text-${colorClass}-400/70`}>
                                  {l === 'fr' ? 'Calculé automatiquement' : 'Auto-calculated'}
                                </span>
                              </div>
                              {resistance.breakdown && (
                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                  {resistance.breakdown.haptique > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                                      🔧 {resistance.breakdown.haptique} haptique{resistance.breakdown.haptique > 1 ? 's' : ''} (+{resistance.bonusDetails?.haptique}%)
                                    </span>
                                  )}
                                  {resistance.breakdown.relationnelle > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                                      💗 {resistance.breakdown.relationnelle} relationnelle{resistance.breakdown.relationnelle > 1 ? 's' : ''} (+{resistance.bonusDetails?.relationnelle}%)
                                    </span>
                                  )}
                                  {resistance.breakdown.technique > 0 && (
                                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                      📊 {resistance.breakdown.technique} technique{resistance.breakdown.technique > 1 ? 's' : ''} (+{resistance.bonusDetails?.technique}%)
                                    </span>
                                  )}
                                  <span className="px-2 py-0.5 rounded bg-slate-500/20 text-slate-400">
                                    Base: 40%
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Actions */}
                        <div className="flex justify-end pt-2 border-t border-slate-800/50">
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFutureJob(job.id); }}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            {l === 'fr' ? 'Supprimer ce métier' : 'Delete this job'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center pt-4"
      >
        <BackToHub variant="secondary" />
        <motion.button
          onClick={handleValidate}
          disabled={enterpriseTargets.futureJobs.length === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Check className="w-5 h-5" />
          {l === 'fr' ? 'Valider les exigences' : 'Validate requirements'}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Modal Ajouter Métier */}
      <AnimatePresence>
        {showAddJobModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 z-[99]"
              onClick={() => setShowAddJobModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-emerald-400" />
                  {l === 'fr' ? 'Nouveau Métier de Demain' : 'New Job of Tomorrow'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Intitulé du poste' : 'Job Title'} *
                    </label>
                    <input
                      type="text"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      placeholder={l === 'fr' ? "Ex: Superviseur IA de Production" : "Ex: AI Production Supervisor"}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Service / Département' : 'Department'}
                    </label>
                    <input
                      type="text"
                      value={newJob.department}
                      onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                      placeholder={l === 'fr' ? "Ex: Production, Logistique" : "Ex: Production, Logistics"}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Description du poste' : 'Job Description'}
                    </label>
                    <textarea
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      placeholder={l === 'fr' ? "Décrivez les missions principales..." : "Describe the main responsibilities..."}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {l === 'fr' ? 'Postes à pourvoir' : 'Positions to fill'}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={newJob.headcount}
                        onChange={(e) => setNewJob({ ...newJob, headcount: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {l === 'fr' ? 'Urgence' : 'Urgency'}
                      </label>
                      <select
                        value={newJob.urgency}
                        onChange={(e) => setNewJob({ ...newJob, urgency: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        {URGENCY_OPTIONS.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label[l]}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Info : La résistance sera calculée automatiquement */}
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">
                        {l === 'fr' ? 'Résistance calculée automatiquement' : 'Resistance calculated automatically'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 pl-6">
                      {l === 'fr' 
                        ? 'La résilience face à l\'IA sera calculée selon les compétences que vous ajouterez (Haptiques = +30%, Relationnelles = +25%, Techniques = +10%).'
                        : 'AI resilience will be calculated based on the competencies you add (Haptic = +30%, Relational = +25%, Technical = +10%).'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    onClick={() => setShowAddJobModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {l === 'fr' ? 'Annuler' : 'Cancel'}
                  </motion.button>
                  <motion.button
                    onClick={handleAddJob}
                    disabled={!newJob.title}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {l === 'fr' ? 'Créer le métier' : 'Create job'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Ajouter Compétence */}
      <AnimatePresence>
        {showAddCompetenceModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 z-[99]"
              onClick={() => setShowAddCompetenceModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 max-w-lg w-full">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-violet-400" />
                  {l === 'fr' ? 'Nouvelle Compétence Clé' : 'New Key Competency'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Nom de la compétence' : 'Competency Name'} *
                    </label>
                    <input
                      type="text"
                      value={newCompetence.name}
                      onChange={(e) => setNewCompetence({ ...newCompetence, name: e.target.value })}
                      placeholder={l === 'fr' ? "Ex: Calibration de machines CNC" : "Ex: CNC Machine Calibration"}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Catégorie' : 'Category'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {COMPETENCE_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setNewCompetence({ ...newCompetence, category: cat.id })}
                          className={`relative group flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                            newCompetence.category === cat.id
                              ? `bg-${cat.color}-500/20 border-${cat.color}-500/50 text-${cat.color}-400`
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          {cat.icon}
                          <span className="text-xs">{cat.label[l]}</span>
                          
                          {/* Tooltip informatif */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                            <div className="text-xs text-slate-300 mb-2">{cat.description[l]}</div>
                            <div className="text-xs text-slate-500 mb-2">
                              <span className="font-medium">{l === 'fr' ? 'Ex:' : 'Ex:'}</span> {cat.examples[l]}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Zap className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">{cat.resilience} {l === 'fr' ? 'résilience IA' : 'AI resilience'}</span>
                            </div>
                            {/* Flèche du tooltip */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-slate-700" />
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Info-bulle de la catégorie sélectionnée */}
                    {newCompetence.category && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                      >
                        {(() => {
                          const selectedCat = COMPETENCE_CATEGORIES.find(c => c.id === newCompetence.category);
                          if (!selectedCat) return null;
                          return (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-300">{selectedCat.description[l]}</span>
                              </div>
                              <div className="text-xs text-slate-500 pl-6">
                                <span className="font-medium">{l === 'fr' ? 'Exemples :' : 'Examples:'}</span> {selectedCat.examples[l]}
                              </div>
                              <div className="flex items-center gap-1 text-xs pl-6">
                                <Zap className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">{selectedCat.resilience} {l === 'fr' ? 'résilience face à l\'IA' : 'resilience against AI'}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {l === 'fr' ? 'Niveau requis' : 'Required Level'}: {newCompetence.requiredLevel}/5
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={newCompetence.requiredLevel}
                        onChange={(e) => setNewCompetence({ ...newCompetence, requiredLevel: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {l === 'fr' ? 'Criticité' : 'Criticality'}: {newCompetence.criticalityScore}%
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={newCompetence.criticalityScore}
                        onChange={(e) => setNewCompetence({ ...newCompetence, criticalityScore: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Description' : 'Description'}
                    </label>
                    <textarea
                      value={newCompetence.description}
                      onChange={(e) => setNewCompetence({ ...newCompetence, description: e.target.value })}
                      placeholder={l === 'fr' ? "Décrivez cette compétence..." : "Describe this competency..."}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    onClick={() => setShowAddCompetenceModal(null)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {l === 'fr' ? 'Annuler' : 'Cancel'}
                  </motion.button>
                  <motion.button
                    onClick={() => handleAddCompetence(showAddCompetenceModal)}
                    disabled={!newCompetence.name}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {l === 'fr' ? 'Ajouter la compétence' : 'Add competency'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

