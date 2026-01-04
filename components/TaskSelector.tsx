'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuditStore } from '@/lib/store';
import { UI_MESSAGES } from '@/lib/prompts/generate-tasks';
import { 
  Loader2, CheckSquare, Square, Plus, X, 
  Sparkles, AlertCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

interface GeneratedTask {
  id: string;
  name: string;
  description: string;
}

interface TaskSelectorProps {
  onComplete?: () => void;
}

export function TaskSelector({ onComplete }: TaskSelectorProps) {
  const { context, setTasks, tasks } = useAuditStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [customTasks, setCustomTasks] = useState<GeneratedTask[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [hasGenerated, setHasGenerated] = useState(false);

  const jobTitle = context.jobTitle || '';
  const sector = context.industry || '';

  // Générer les tâches quand on a le métier et le secteur
  const generateTasks = async () => {
    if (!jobTitle || !sector) {
      setError('Veuillez d\'abord renseigner votre métier et votre secteur.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          sector,
          experience: context.yearsExperience,
          teamSize: context.teamSize
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération des tâches');
      }

      const data = await response.json();
      setGeneratedTasks(data.tasks || []);
      setHasGenerated(true);
      
      // Pré-sélectionner toutes les tâches par défaut
      const allIds = new Set((data.tasks || []).map((t: GeneratedTask) => t.id));
      setSelectedTaskIds(allIds);

    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de générer les tâches. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle sélection d'une tâche
  const toggleTask = (taskId: string) => {
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  // Toggle description étendue
  const toggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  // Ajouter une tâche personnalisée
  const addCustomTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: GeneratedTask = {
      id: `custom_${Date.now()}`,
      name: newTaskName.trim(),
      description: newTaskDescription.trim() || 'Tâche ajoutée manuellement'
    };

    setCustomTasks([...customTasks, newTask]);
    setSelectedTaskIds(new Set([...selectedTaskIds, newTask.id]));
    setNewTaskName('');
    setNewTaskDescription('');
    setShowAddForm(false);
  };

  // Supprimer une tâche personnalisée
  const removeCustomTask = (taskId: string) => {
    setCustomTasks(customTasks.filter(t => t.id !== taskId));
    const newSelected = new Set(selectedTaskIds);
    newSelected.delete(taskId);
    setSelectedTaskIds(newSelected);
  };

  // Valider et passer à la suite
  const validateTasks = () => {
    const allTasks = [...generatedTasks, ...customTasks];
    const selectedTasks = allTasks.filter(t => selectedTaskIds.has(t.id));

    // Convertir au format du store
    const storeTasks = selectedTasks.map((t, index) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: 'cognitive' as const,
      frequency: 'daily' as const,
      hoursPerWeek: 0,
      resilience: {
        donnees: 50,
        decision: 50,
        relationnel: 50,
        creativite: 50,
        execution: 50
      }
    }));

    setTasks(storeTasks);
    onComplete?.();
  };

  const allTasks = [...generatedTasks, ...customTasks];
  const selectedCount = selectedTaskIds.size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {UI_MESSAGES.title}
        </h2>
        {jobTitle && sector && (
          <p className="text-zinc-400">
            {UI_MESSAGES.intro
              .replace('{jobTitle}', jobTitle)
              .replace('{sector}', sector)}
          </p>
        )}
      </div>

      {/* Bouton de génération */}
      {!hasGenerated && (
        <div className="flex justify-center">
          <button
            onClick={generateTasks}
            disabled={loading || !jobTitle || !sector}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                       text-white font-medium rounded-xl hover:from-indigo-500 hover:to-purple-500 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyser mon métier
              </>
            )}
          </button>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Liste des tâches */}
      {hasGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Instruction */}
          <p className="text-sm text-zinc-400 text-center">
            {UI_MESSAGES.instruction}
          </p>

          {/* Tâches générées */}
          <div className="space-y-2">
            {allTasks.map((task) => {
              const isSelected = selectedTaskIds.has(task.id);
              const isExpanded = expandedTasks.has(task.id);
              const isCustom = task.id.startsWith('custom_');

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`
                    border rounded-xl overflow-hidden transition-all
                    ${isSelected 
                      ? 'bg-indigo-500/10 border-indigo-500/30' 
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}
                  `}
                >
                  <div className="flex items-start gap-3 p-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <Square className="w-5 h-5 text-zinc-600" />
                      )}
                    </button>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                          {task.name}
                        </span>
                        {isCustom && (
                          <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                            Ajoutée
                          </span>
                        )}
                      </div>
                      
                      {/* Description (toujours visible, ou expandable si longue) */}
                      <p className={`text-sm text-zinc-500 mt-1 ${!isExpanded && 'line-clamp-2'}`}>
                        {task.description}
                      </p>
                      
                      {task.description.length > 100 && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>Moins <ChevronUp className="w-3 h-3" /></>
                          ) : (
                            <>Plus <ChevronDown className="w-3 h-3" /></>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Supprimer (tâches custom uniquement) */}
                    {isCustom && (
                      <button
                        onClick={() => removeCustomTask(task.id)}
                        className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Ajouter une tâche */}
          <AnimatePresence>
            {showAddForm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-zinc-800 rounded-xl p-4 space-y-3"
              >
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Nom de la tâche"
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg 
                             text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Description (optionnel)"
                  rows={2}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg 
                             text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addCustomTask}
                    disabled={!newTaskName.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTaskName('');
                      setNewTaskDescription('');
                    }}
                    className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-dashed 
                           border-zinc-700 rounded-xl text-zinc-500 hover:text-zinc-300 
                           hover:border-zinc-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {UI_MESSAGES.addButton}
              </button>
            )}
          </AnimatePresence>

          {/* Footer avec validation */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <span className="text-sm text-zinc-500">
              {selectedCount} tâche{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
            </span>
            <button
              onClick={validateTasks}
              disabled={selectedCount === 0}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 
                         text-white font-medium rounded-xl hover:from-emerald-500 hover:to-teal-500 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {UI_MESSAGES.validateButton}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

