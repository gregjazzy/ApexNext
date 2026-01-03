'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { 
  Radar, 
  Heart, 
  Target, 
  Map, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  ChevronRight,
  Zap,
  Compass,
  Sparkles,
  LayoutGrid,
  ArrowRight,
  Info,
  Star,
  Users,
  Shield
} from 'lucide-react';
import { useAuditStore } from '@/lib/store';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { UserMenu } from '@/components/ui/UserMenu';
import { ResetButton } from '@/components/ui/ResetButton';

// ===============================================
// CONFIGURATION DU HUB STRATÉGIQUE
// ===============================================

type NodeStatus = 'completed' | 'todo' | 'locked' | 'optional' | 'required' | 'current';

interface HubNode {
  id: string;
  step: number;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  description: { fr: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

const HUB_NODES: HubNode[] = [
  {
    id: 'diagnostic',
    step: 1,
    title: { fr: 'Diagnostic de Vulnérabilité', en: 'Vulnerability Diagnostic' },
    subtitle: { fr: 'Audit des processus métier', en: 'Business Process Audit' },
    description: { fr: 'Analyse de vos tâches, talents et outils face à l\'automatisation', en: 'Analysis of your tasks, talents and tools against automation' },
    icon: Radar,
    route: '/audit',
    color: 'emerald',
    gradientFrom: 'from-emerald-500',
    gradientTo: 'to-teal-500',
  },
  {
    id: 'portrait',
    step: 2,
    title: { fr: 'Portrait de Mutation', en: 'Mutation Portrait' },
    subtitle: { fr: 'Identité & Aspirations', en: 'Identity & Aspirations' },
    description: { fr: 'Passions concrètes, talents naturels et vision de l\'avenir', en: 'Concrete passions, natural talents and vision for the future' },
    icon: Heart,
    route: '/portrait',
    color: 'violet',
    gradientFrom: 'from-violet-500',
    gradientTo: 'to-purple-500',
  },
  {
    id: 'strategy',
    step: 3,
    title: { fr: 'Arbitrage Stratégique', en: 'Strategic Arbitrage' },
    subtitle: { fr: 'Matrice ERAC & Ikigai', en: 'ERAC Matrix & Ikigai' },
    description: { fr: 'Éliminer, Réduire, Augmenter, Créer — Trouvez votre position unique', en: 'Eliminate, Reduce, Augment, Create — Find your unique position' },
    icon: Target,
    route: '/strategy',
    color: 'indigo',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-blue-500',
  },
  {
    id: 'roadmap',
    step: 4,
    title: { fr: 'Roadmap Opérationnelle', en: 'Operational Roadmap' },
    subtitle: { fr: 'Plan d\'action concret', en: 'Concrete Action Plan' },
    description: { fr: 'Actions immédiates, KPIs de résilience et outils suggérés', en: 'Immediate actions, resilience KPIs and suggested tools' },
    icon: Map,
    route: '/strategy?step=8',
    color: 'amber',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-500',
  },
];

// Node spécial pour le mode Reclassement/PSE (remplace Portrait)
const COHORT_NODE: HubNode = {
  id: 'cohort',
  step: 2,
  title: { fr: 'Tableau de Bord de Cohorte', en: 'Cohort Dashboard' },
  subtitle: { fr: 'Cellule de Reclassement', en: 'Outplacement Cell' },
  description: { fr: 'Suivi de la progression des portraits de mutation de vos équipes', en: 'Track your teams\' mutation portrait progress' },
  icon: Users,
  route: '/cohort',
  color: 'violet',
  gradientFrom: 'from-violet-500',
  gradientTo: 'to-indigo-500',
};

// ===============================================
// COMPOSANT PRINCIPAL
// ===============================================

export function StrategyHub() {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { 
    context, 
    tasks, 
    talents,
    getSelectedTalents,
    strategy,
    userIntention,
    cohortData
  } = useAuditStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // ===============================================
    // SÉQUENÇAGE : Hub accessible uniquement après Step 1
    // ===============================================
    // Si le persona n'est pas défini, rediriger vers l'audit
    if (!context.persona || !context.goal) {
      router.push('/audit');
    }
  }, [context.persona, context.goal, router]);

  // ===============================================
  // CALCUL DES ÉTATS DES NŒUDS
  // ===============================================

  const getNodeStatus = (nodeId: string): NodeStatus => {
    const selectedTalents = getSelectedTalents();
    const hasDiagnostic = tasks.length > 0 && selectedTalents.length === 5 && context.persona && context.goal;
    const hasPortrait = userIntention.isComplete;
    const hasStrategy = strategy.generatedAt !== null;
    const isPivot = context.goal === 'pivot';
    const isReclassement = context.goal === 'reclassement';

    switch (nodeId) {
      case 'diagnostic':
        return hasDiagnostic ? 'completed' : 'todo';
      
      case 'portrait':
        if (!hasDiagnostic) return 'locked';
        if (!isPivot) return 'optional';
        // Si Pivot : afficher "Requis" tant que non complété
        return hasPortrait ? 'completed' : 'required';
      
      case 'cohort':
        // Mode Reclassement : Tableau de bord de cohorte
        if (!hasDiagnostic) return 'locked';
        const hasCompletedMembers = cohortData.stats.completedCount > 0;
        const allMembersCompleted = cohortData.members.length > 0 && 
          cohortData.stats.completedCount === cohortData.members.length;
        if (allMembersCompleted) return 'completed';
        if (hasCompletedMembers) return 'current';
        return 'todo';
      
      case 'strategy':
        if (!hasDiagnostic) return 'locked';
        if (isPivot && !hasPortrait) return 'locked';
        // En mode reclassement, stratégie débloquée après ajout de membres
        if (isReclassement && cohortData.members.length === 0) return 'locked';
        return hasStrategy ? 'completed' : 'todo';
      
      case 'roadmap':
        if (!hasStrategy) return 'locked';
        return strategy.roadmap.some(a => a.completed) ? 'completed' : 'todo';
      
      default:
        return 'locked';
    }
  };

  const getStatusBadge = (status: NodeStatus) => {
    const badges = {
      completed: {
        label: { fr: 'Terminé', en: 'Completed' },
        icon: CheckCircle2,
        className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      },
      todo: {
        label: { fr: 'À faire', en: 'To do' },
        icon: AlertCircle,
        className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      },
      locked: {
        label: { fr: 'Verrouillé', en: 'Locked' },
        icon: Lock,
        className: 'bg-slate-700/50 text-slate-500 border-slate-600/30',
      },
      optional: {
        label: { fr: 'Optionnel', en: 'Optional' },
        icon: Info,
        className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      },
      required: {
        label: { fr: 'Requis', en: 'Required' },
        icon: Star,
        className: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      },
      current: {
        label: { fr: 'En cours', en: 'In progress' },
        icon: Sparkles,
        className: 'bg-violet-500/20 text-violet-400 border-violet-500/30 animate-pulse',
      },
    };
    return badges[status];
  };

  const handleNodeClick = (node: HubNode) => {
    const status = getNodeStatus(node.id);
    // Seul le statut 'locked' empêche de cliquer
    // 'required', 'todo', 'optional', 'completed' sont tous cliquables
    if (status === 'locked') return;
    router.push(node.route);
  };

  // ===============================================
  // CALCUL DES STATISTIQUES
  // ===============================================

  const isAugmentation = context.goal === 'augmentation';
  const isPivot = context.goal === 'pivot';
  const isReclassement = context.goal === 'reclassement';
  
  // Filtrer et remplacer les nodes selon le goal
  const visibleNodes = HUB_NODES
    .filter(node => {
      // Augmentation : pas de portrait
      if (node.id === 'portrait' && isAugmentation) return false;
      // Reclassement : pas de portrait (remplacé par cohort)
      if (node.id === 'portrait' && isReclassement) return false;
      return true;
    })
    .map(node => {
      // Pour Reclassement, insérer le node Cohort après diagnostic
      return node;
    });
  
  // En mode Reclassement, ajouter le node Cohort après Diagnostic
  if (isReclassement) {
    const diagnosticIndex = visibleNodes.findIndex(n => n.id === 'diagnostic');
    if (diagnosticIndex !== -1) {
      visibleNodes.splice(diagnosticIndex + 1, 0, COHORT_NODE);
    }
  }
  
  const completedCount = visibleNodes.filter(n => getNodeStatus(n.id) === 'completed').length;
  // Nombre d'étapes : 3 pour Augmentation, 4 pour Pivot/Reclassement
  const totalSteps = isAugmentation ? 3 : 4;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  // Labels personnalisés par persona
  const personaLabels: Record<string, { fr: string; en: string }> = {
    salarie: { fr: 'Salarié', en: 'Employee' },
    freelance: { fr: 'Freelance', en: 'Freelancer' },
    leader: { fr: 'Leader / RH', en: 'Leader / HR' },
  };
  
  const personaLabel = context.persona ? personaLabels[context.persona]?.[l] || context.persona : '';

  // ===============================================
  // RENDER
  // ===============================================

  // Affichage du loading ou redirection si pas de persona
  if (!isClient || !context.persona || !context.goal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto animate-pulse">
            <LayoutGrid className="w-10 h-10 text-white" />
          </div>
          <p className="text-slate-400">
            {l === 'fr' ? 'Chargement du Centre de Commandement...' : 'Loading Command Center...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <LayoutGrid className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-slate-100">
                  {l === 'fr' ? `Trajectoire de Mutation : ${personaLabel}` : `Mutation Trajectory: ${personaLabel}`}
                </h1>
                <p className="text-sm text-slate-500">
                  {l === 'fr' ? 'Centre de Commandement Stratégique' : 'Strategic Command Center'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Parcours Badge */}
              {context.goal && (
                <div className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full border
                  ${isAugmentation 
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                    : isReclassement
                      ? 'bg-violet-500/20 border-violet-500/30 text-violet-400'
                      : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                  }
                `}>
                  {isAugmentation ? <Zap className="w-4 h-4" /> : isReclassement ? <Shield className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {isAugmentation 
                      ? (l === 'fr' ? 'Augmentation' : 'Augmentation')
                      : isReclassement
                        ? (l === 'fr' ? 'Reclassement' : 'Outplacement')
                        : (l === 'fr' ? 'Pivot' : 'Pivot')
                    }
                  </span>
                </div>
              )}

              <ResetButton variant="text" />

              <LanguageSwitcher />

              {session?.user && (
                <UserMenu user={session.user} />
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">
                {l === 'fr' ? 'Progression globale' : 'Overall progress'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {completedCount} / {totalSteps} {l === 'fr' ? 'étapes' : 'steps'}
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-40 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Intro Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-serif font-bold text-white mb-3">
              {l === 'fr' ? 'Votre parcours stratégique' : 'Your strategic journey'}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {l === 'fr' 
                ? 'Naviguez entre les différentes étapes de votre transformation professionnelle. Chaque nœud représente une étape clé vers votre nouvelle trajectoire.'
                : 'Navigate between the different stages of your professional transformation. Each node represents a key step towards your new trajectory.'
              }
            </p>
          </motion.div>

          {/* Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HUB_NODES
              // Filtrer : masquer "Portrait de Mutation" si goal !== 'pivot'
              .filter(node => {
                if (node.id === 'portrait' && context.goal !== 'pivot') {
                  return false;
                }
                return true;
              })
              .map((node, index) => {
              const status = getNodeStatus(node.id);
              const badge = getStatusBadge(status);
              const isLocked = status === 'locked';
              const NodeIcon = node.icon;
              const BadgeIcon = badge.icon;

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => handleNodeClick(node)}
                    disabled={isLocked}
                    className={`
                      w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group
                      ${isLocked 
                        ? 'bg-slate-900/30 border-slate-800/50 cursor-not-allowed opacity-60' 
                        : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50 cursor-pointer'
                      }
                    `}
                    whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                  >
                    {/* Gradient background on hover */}
                    {!isLocked && (
                      <div className={`
                        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        bg-gradient-to-br ${node.gradientFrom} ${node.gradientTo}
                      `} style={{ opacity: 0.05 }} />
                    )}

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`
                          w-14 h-14 rounded-xl flex items-center justify-center
                          ${isLocked 
                            ? 'bg-slate-800/50' 
                            : `bg-gradient-to-br ${node.gradientFrom} ${node.gradientTo}`
                          }
                        `}>
                          <NodeIcon className={`w-7 h-7 ${isLocked ? 'text-slate-500' : 'text-white'}`} />
                        </div>

                        {/* Status Badge */}
                        <div className={`
                          flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          ${badge.className}
                        `}>
                          <BadgeIcon className="w-3 h-3" />
                          {badge.label[l]}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`
                            text-xs font-medium px-2 py-0.5 rounded
                            ${isLocked ? 'bg-slate-800/50 text-slate-500' : 'bg-slate-800 text-slate-400'}
                          `}>
                            {l === 'fr' ? 'Étape' : 'Step'} {index + 1}
                          </span>
                        </div>
                        <h3 className={`text-xl font-semibold ${isLocked ? 'text-slate-500' : 'text-white'}`}>
                          {node.title[l]}
                        </h3>
                        <p className={`text-sm ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>
                          {node.subtitle[l]}
                        </p>
                        <p className={`text-xs ${isLocked ? 'text-slate-700' : 'text-slate-500'}`}>
                          {node.description[l]}
                        </p>
                      </div>

                      {/* Action */}
                      {!isLocked && (
                        <div className={`
                          mt-4 flex items-center gap-2 text-sm font-medium
                          text-${node.color}-400 group-hover:text-${node.color}-300
                        `}>
                          <span>{status === 'completed' ? (l === 'fr' ? 'Revoir' : 'Review') : (l === 'fr' ? 'Commencer' : 'Start')}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}

                      {/* Locked message */}
                      {isLocked && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                          <Lock className="w-3 h-3" />
                          <span>
                            {l === 'fr' 
                              ? 'Complétez les étapes précédentes pour débloquer'
                              : 'Complete previous steps to unlock'
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Context Summary */}
          {context.persona && context.goal && (
            <motion.div 
              className="mt-12 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-sm font-medium text-slate-400 mb-3">
                {l === 'fr' ? 'Contexte de votre audit' : 'Your audit context'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs mb-1">
                    {l === 'fr' ? 'Profil' : 'Profile'}
                  </span>
                  <span className="text-white font-medium capitalize">{context.persona}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs mb-1">
                    {l === 'fr' ? 'Objectif' : 'Goal'}
                  </span>
                  <span className={`font-medium ${
                    isAugmentation ? 'text-emerald-400' : 
                    isReclassement ? 'text-violet-400' : 
                    'text-indigo-400'
                  }`}>
                    {isAugmentation 
                      ? (l === 'fr' ? 'Augmentation' : 'Augmentation')
                      : isReclassement
                        ? (l === 'fr' ? 'Reclassement' : 'Outplacement')
                        : (l === 'fr' ? 'Pivot' : 'Pivot')
                    }
                  </span>
                </div>
                {context.jobTitle && (
                  <div>
                    <span className="text-slate-500 block text-xs mb-1">
                      {l === 'fr' ? 'Poste' : 'Position'}
                    </span>
                    <span className="text-white font-medium">{context.jobTitle}</span>
                  </div>
                )}
                {tasks.length > 0 && (
                  <div>
                    <span className="text-slate-500 block text-xs mb-1">
                      {l === 'fr' ? 'Tâches analysées' : 'Tasks analyzed'}
                    </span>
                    <span className="text-white font-medium">{tasks.length}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-3 backdrop-blur-md bg-slate-950/90 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              APEX Strategy Hub • {l === 'fr' ? 'Centre de Commandement Stratégique' : 'Strategic Command Center'}
            </p>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-indigo-500/10">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs text-indigo-400">
                {l === 'fr' ? 'Navigation active' : 'Navigation active'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StrategyHub;

