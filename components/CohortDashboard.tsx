'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserPlus, 
  Mail, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Send,
  ChevronRight,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuditStore, CohortMember } from '@/lib/store';
import { BackToHub } from '@/components/ui/BackToHub';

// ===============================================
// TABLEAU DE BORD DE COHORTE
// Mode Reclassement/PSE pour Leader RH
// "Cellule de reclassement stratégique"
// ===============================================

export function CohortDashboard() {
  const locale = useLocale();
  const router = useRouter();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { 
    cohortData,
    setCohortName,
    addCohortMember,
    inviteCohortMembers,
    updateCohortStats,
  } = useAuditStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    department: '',
    currentRole: '',
  });

  // Calcul des statistiques
  const totalMembers = cohortData.members.length;
  const completedCount = cohortData.members.filter(m => m.status === 'completed').length;
  const inProgressCount = cohortData.members.filter(m => m.status === 'in_progress').length;
  const pendingCount = cohortData.members.filter(m => m.status === 'pending').length;
  const invitedCount = cohortData.members.filter(m => m.status === 'invited').length;
  
  const progressPercent = totalMembers > 0 
    ? Math.round((completedCount / totalMembers) * 100) 
    : 0;

  // Handlers
  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      addCohortMember(newMember);
      setNewMember({ name: '', email: '', department: '', currentRole: '' });
      setShowAddModal(false);
      updateCohortStats();
    }
  };

  const handleInviteAll = () => {
    const pendingIds = cohortData.members
      .filter(m => m.status === 'pending')
      .map(m => m.id);
    inviteCohortMembers(pendingIds);
    updateCohortStats();
  };

  const getStatusColor = (status: CohortMember['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'in_progress': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'invited': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
    }
  };

  const getStatusLabel = (status: CohortMember['status']) => {
    const labels = {
      pending: { fr: 'En attente', en: 'Pending' },
      invited: { fr: 'Invité', en: 'Invited' },
      in_progress: { fr: 'En cours', en: 'In Progress' },
      completed: { fr: 'Complété', en: 'Completed' },
    };
    return labels[status][l];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 text-sm font-medium">
          <Shield className="w-4 h-4" />
          {l === 'fr' ? 'Cellule de Reclassement Stratégique' : 'Strategic Outplacement Cell'}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-white">
          {l === 'fr' ? 'Tableau de Bord de Cohorte' : 'Cohort Dashboard'}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {l === 'fr' 
            ? "Audit de transition collective — Pilotez le reclassement stratégique de vos équipes."
            : "Collective transition audit — Lead the strategic redeployment of your teams."
          }
        </p>
      </motion.div>

      {/* Cohort Name Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6"
      >
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {l === 'fr' ? "Nom de la cohorte" : "Cohort Name"}
        </label>
        <input
          type="text"
          value={cohortData.cohortName}
          onChange={(e) => setCohortName(e.target.value)}
          placeholder={l === 'fr' ? "Ex: PSE Q1 2024 - Site Lyon" : "Ex: Restructuring Q1 2024 - Lyon Site"}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
        />
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Total Members */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{totalMembers}</div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'Collaborateurs' : 'Team Members'}
          </div>
        </div>

        {/* Completed */}
        <div className="bg-slate-900/50 rounded-xl border border-emerald-500/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'Portraits complétés' : 'Portraits Completed'}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-slate-900/50 rounded-xl border border-amber-500/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{inProgressCount}</div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'En cours' : 'In Progress'}
          </div>
        </div>

        {/* Employability Index */}
        <div className="bg-slate-900/50 rounded-xl border border-violet-500/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-violet-400">
            {cohortData.stats.averageEmployabilityIndex || '—'}%
          </div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'Indice de Réemployabilité' : 'Employability Index'}
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-300">
            {l === 'fr' ? 'Progression globale' : 'Overall Progress'}
          </span>
          <span className="text-2xl font-bold text-white">
            {completedCount}/{totalMembers}
            <span className="text-sm text-slate-500 ml-2">
              {l === 'fr' ? 'salariés ont complété leur portrait' : 'employees completed their portrait'}
            </span>
          </span>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>{progressPercent}%</span>
          <span>{l === 'fr' ? 'Objectif: 100%' : 'Target: 100%'}</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-4"
      >
        <motion.button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus className="w-5 h-5" />
          {l === 'fr' ? 'Ajouter un collaborateur' : 'Add Team Member'}
        </motion.button>

        <motion.button
          onClick={handleInviteAll}
          disabled={pendingCount === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="w-5 h-5" />
          {l === 'fr' ? `Envoyer ${pendingCount} invitations` : `Send ${pendingCount} invitations`}
        </motion.button>
      </motion.div>

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            {l === 'fr' ? 'Membres de la cohorte' : 'Cohort Members'}
          </h3>
          <span className="text-sm text-slate-500">{totalMembers} {l === 'fr' ? 'personnes' : 'people'}</span>
        </div>

        {cohortData.members.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <h4 className="text-lg font-medium text-slate-300 mb-2">
              {l === 'fr' ? 'Aucun collaborateur' : 'No Team Members'}
            </h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {l === 'fr' 
                ? "Commencez par ajouter les collaborateurs concernés par le plan de reclassement."
                : "Start by adding the team members involved in the redeployment plan."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {cohortData.members.map((member) => (
              <div 
                key={member.id}
                className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-white">{member.name}</div>
                    <div className="text-sm text-slate-500">{member.currentRole} • {member.department}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {member.employabilityIndex !== null && (
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        member.employabilityIndex >= 70 ? 'text-emerald-400' :
                        member.employabilityIndex >= 40 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {member.employabilityIndex}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {l === 'fr' ? 'Réemployabilité' : 'Employability'}
                      </div>
                    </div>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                    {getStatusLabel(member.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-start pt-4"
      >
        <BackToHub />
      </motion.div>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 z-[99]"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-violet-400" />
                  {l === 'fr' ? 'Ajouter un collaborateur' : 'Add Team Member'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Nom complet' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Email professionnel' : 'Professional Email'} *
                    </label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Service / Département' : 'Department'}
                    </label>
                    <input
                      type="text"
                      value={newMember.department}
                      onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Poste actuel' : 'Current Role'}
                    </label>
                    <input
                      type="text"
                      value={newMember.currentRole}
                      onChange={(e) => setNewMember({ ...newMember, currentRole: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {l === 'fr' ? 'Annuler' : 'Cancel'}
                  </motion.button>
                  <motion.button
                    onClick={handleAddMember}
                    disabled={!newMember.name || !newMember.email}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {l === 'fr' ? 'Ajouter' : 'Add'}
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

