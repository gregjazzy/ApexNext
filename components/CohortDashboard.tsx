'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Clock,
  CircleDashed,
  FileText,
  Pencil,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { useAuditStore, CohortMember } from '@/lib/store';
import { BackToHub } from '@/components/ui/BackToHub';

// ===============================================
// TABLEAU DE BORD DE COHORTE - SUIVI MANUEL
// Mode simplifié : le RH gère sa liste et les statuts
// Les employés envoient leur PDF en dehors du logiciel
// ===============================================

// Statuts simplifiés
type SimpleStatus = 'pending' | 'invited' | 'in_progress' | 'received';

const STATUS_CONFIG = {
  pending: {
    label: { fr: 'À contacter', en: 'To Contact' },
    color: 'bg-slate-700/50 text-slate-400 border-slate-600/30',
    icon: CircleDashed,
  },
  invited: {
    label: { fr: 'Invité', en: 'Invited' },
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Clock,
  },
  in_progress: {
    label: { fr: 'En cours', en: 'In Progress' },
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Clock,
  },
  received: {
    label: { fr: 'PDF reçu', en: 'PDF Received' },
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
  },
};

export function CohortDashboard() {
  const locale = useLocale();
  const l = locale === 'fr' ? 'fr' : 'en';
  
  const { 
    context,
    cohortData,
    setCohortName,
    addCohortMember,
    updateCohortMember,
    removeCohortMember,
  } = useAuditStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    department: '',
    currentRole: '',
    notes: '',
  });

  // Déterminer le mode de la cohorte basé sur le goal du contexte
  const cohortMode = context.goal === 'augmentation' ? 'augmentation' : 'pivot';
  const modeLabel = cohortMode === 'augmentation' 
    ? (l === 'fr' ? 'Augmentation' : 'Augmentation')
    : (l === 'fr' ? 'Pivot' : 'Pivot');

  // Calcul des statistiques
  const totalMembers = cohortData.members.length;
  const receivedCount = cohortData.members.filter(m => m.status === 'completed' || m.status === 'received').length;
  const inProgressCount = cohortData.members.filter(m => m.status === 'in_progress' || m.status === 'invited').length;
  const pendingCount = cohortData.members.filter(m => m.status === 'pending').length;
  
  const progressPercent = totalMembers > 0 
    ? Math.round((receivedCount / totalMembers) * 100) 
    : 0;

  // Handlers
  const handleAddMember = () => {
    if (newMember.name) {
      addCohortMember({
        ...newMember,
        mode: cohortMode,
      });
      setNewMember({ name: '', email: '', department: '', currentRole: '', notes: '' });
      setShowAddModal(false);
    }
  };

  const handleUpdateStatus = (memberId: string, newStatus: SimpleStatus) => {
    // Map to store status
    const storeStatus = newStatus === 'received' ? 'completed' : newStatus;
    updateCohortMember(memberId, { status: storeStatus as CohortMember['status'] });
  };

  const handleUpdateNotes = (memberId: string, notes: string) => {
    updateCohortMember(memberId, { notes });
    setEditingId(null);
  };

  const getDisplayStatus = (status: CohortMember['status']): SimpleStatus => {
    if (status === 'completed') return 'received';
    return status as SimpleStatus;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          cohortMode === 'augmentation' 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
        }`}>
          <Users className="w-4 h-4" />
          {l === 'fr' ? `Cohorte ${modeLabel}` : `${modeLabel} Cohort`}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-white">
          {l === 'fr' ? 'Suivi de Cohorte' : 'Cohort Tracking'}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {cohortMode === 'augmentation' 
            ? (l === 'fr' 
                ? "Gérez les collaborateurs qui optimisent leur poste. Suivez leur progression et récupérez leurs PDF."
                : "Manage employees optimizing their position. Track progress and collect their PDFs.")
            : (l === 'fr' 
                ? "Pilotez la transition de vos collaborateurs. Suivez leur diagnostic Pivot pour préparer les dossiers."
                : "Manage your employees' transition. Track their Pivot diagnostic to prepare documentation.")
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
          placeholder={cohortMode === 'augmentation'
            ? (l === 'fr' ? "Ex: Équipe Comptabilité - Q1 2024" : "Ex: Accounting Team - Q1 2024")
            : (l === 'fr' ? "Ex: PSE Q1 2024 - Site Lyon" : "Ex: Restructuring Q1 2024 - Lyon Site")
          }
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
        <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{totalMembers}</div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'Total' : 'Total'}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-800/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
              <CircleDashed className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-400">{pendingCount}</div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'À contacter' : 'To Contact'}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-amber-500/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400">{inProgressCount}</div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'En attente' : 'In Progress'}
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-emerald-500/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{receivedCount}</div>
          <div className="text-xs text-slate-500">
            {l === 'fr' ? 'PDF reçus' : 'PDFs Received'}
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
            {l === 'fr' ? 'Progression' : 'Progress'}
          </span>
          <span className="text-lg font-bold text-white">
            {receivedCount}/{totalMembers}
            <span className="text-sm text-slate-500 ml-2">
              {l === 'fr' ? 'PDFs collectés' : 'PDFs collected'}
            </span>
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              cohortMode === 'augmentation' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-400'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium transition-colors ${
            cohortMode === 'augmentation'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus className="w-5 h-5" />
          {l === 'fr' ? 'Ajouter un collaborateur' : 'Add Team Member'}
        </motion.button>
      </motion.div>

      {/* Members Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            {l === 'fr' ? 'Liste de suivi' : 'Tracking List'}
          </h3>
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
                ? "Ajoutez les collaborateurs à suivre, puis contactez-les en dehors du logiciel pour qu'ils fassent leur diagnostic."
                : "Add team members to track, then contact them outside the software to complete their diagnostic."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {l === 'fr' ? 'Nom' : 'Name'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {l === 'fr' ? 'Poste' : 'Role'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {l === 'fr' ? 'Statut' : 'Status'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {l === 'fr' ? 'Notes' : 'Notes'}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {l === 'fr' ? 'Actions' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {cohortData.members.map((member) => {
                  const displayStatus = getDisplayStatus(member.status);
                  const StatusIcon = STATUS_CONFIG[displayStatus].icon;
                  
                  return (
                    <tr key={member.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">{member.name}</div>
                            {member.email && (
                              <div className="text-xs text-slate-500">{member.email}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-slate-300">{member.currentRole || '—'}</div>
                        {member.department && (
                          <div className="text-xs text-slate-500">{member.department}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={displayStatus}
                          onChange={(e) => handleUpdateStatus(member.id, e.target.value as SimpleStatus)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer bg-transparent ${STATUS_CONFIG[displayStatus].color}`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <option key={key} value={key} className="bg-slate-800 text-white">
                              {config.label[l]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        {editingId === member.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              defaultValue={member.notes || ''}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateNotes(member.id, (e.target as HTMLInputElement).value);
                                }
                              }}
                              className="flex-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                handleUpdateNotes(member.id, input.value);
                              }}
                              className="p-1 text-emerald-400 hover:text-emerald-300"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400 truncate max-w-[200px]">
                              {member.notes || '—'}
                            </span>
                            <button
                              onClick={() => setEditingId(member.id)}
                              className="p-1 text-slate-500 hover:text-slate-300"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => removeCohortMember(member.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                          title={l === 'fr' ? 'Supprimer' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4"
      >
        <p className="text-sm text-slate-400">
          💡 {l === 'fr' 
            ? "Les collaborateurs font leur diagnostic sur leur propre session APEX et vous envoient le PDF par email. Mettez à jour le statut manuellement quand vous recevez leur document."
            : "Team members complete their diagnostic on their own APEX session and send you the PDF by email. Update the status manually when you receive their document."
          }
        </p>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-violet-400" />
                    {l === 'fr' ? 'Ajouter un collaborateur' : 'Add Team Member'}
                  </h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-1 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Nom' : 'Name'} *
                    </label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder={l === 'fr' ? "Jean Dupont" : "John Doe"}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Email' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="jean.dupont@entreprise.com"
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {l === 'fr' ? 'Service' : 'Department'}
                      </label>
                      <input
                        type="text"
                        value={newMember.department}
                        onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                        placeholder={l === 'fr' ? "Comptabilité" : "Accounting"}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        {l === 'fr' ? 'Poste' : 'Role'}
                      </label>
                      <input
                        type="text"
                        value={newMember.currentRole}
                        onChange={(e) => setNewMember({ ...newMember, currentRole: e.target.value })}
                        placeholder={l === 'fr' ? "Analyste" : "Analyst"}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {l === 'fr' ? 'Notes' : 'Notes'}
                    </label>
                    <input
                      type="text"
                      value={newMember.notes}
                      onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                      placeholder={l === 'fr' ? "Ex: Prioritaire, à recontacter..." : "Ex: Priority, follow up..."}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
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
                    disabled={!newMember.name}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-white transition-colors disabled:opacity-50 ${
                      cohortMode === 'augmentation'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
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
