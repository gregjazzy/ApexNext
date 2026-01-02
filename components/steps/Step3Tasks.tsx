'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Database, Brain, Heart, Sparkles, Clock, Calendar, CalendarDays, Target } from 'lucide-react';
import { useAuditStore, Task, Temporality, ResilienceScores } from '@/lib/store';
import { ResilienceSlider } from '@/components/ui/ResilienceSlider';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { cn, getTemporalityLabel, getResilienceColor } from '@/lib/utils';

const temporalities: { id: Temporality; label: string; icon: React.ReactNode }[] = [
  { id: 'daily', label: 'Quotidien', icon: <Clock className="w-4 h-4" /> },
  { id: 'weekly', label: 'Hebdomadaire', icon: <Calendar className="w-4 h-4" /> },
  { id: 'monthly', label: 'Mensuel', icon: <CalendarDays className="w-4 h-4" /> },
  { id: 'strategic', label: 'Stratégique', icon: <Target className="w-4 h-4" /> },
];

const defaultResilience: ResilienceScores = {
  donnees: 50,
  decision: 50,
  relationnel: 50,
  creativite: 50,
};

export function Step3Tasks() {
  const { tasks, addTask, updateTask, removeTask, nextStep, prevStep } = useAuditStore();
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskTemp, setNewTaskTemp] = useState<Temporality>('daily');
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const canProceed = tasks.length >= 1;

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    
    addTask({
      name: newTaskName.trim(),
      temporality: newTaskTemp,
      resilience: { ...defaultResilience },
    });
    
    setNewTaskName('');
    setNewTaskTemp('daily');
  };

  const handleUpdateResilience = (taskId: string, key: keyof ResilienceScores, value: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    updateTask(taskId, {
      resilience: { ...task.resilience, [key]: value }
    });
  };

  const getTaskScore = (task: Task): number => {
    const { donnees, decision, relationnel, creativite } = task.resilience;
    return Math.round((donnees + decision + relationnel + creativite) / 4);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          className="apex-title text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Audit Temporel
        </motion.h1>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Listez vos tâches principales et évaluez leur vulnérabilité à l'automatisation.
        </motion.p>
      </div>

      {/* Add Task Form */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-medium text-slate-200 mb-4">Ajouter une tâche</h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Ex: Rédaction de rapports, Gestion d'équipe..."
              className="apex-input"
            />
          </div>
          
          <div className="flex gap-2">
            {temporalities.map((t) => (
              <button
                key={t.id}
                onClick={() => setNewTaskTemp(t.id)}
                className={cn(
                  'px-3 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-sm',
                  newTaskTemp === t.id
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                )}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
          
          <motion.button
            onClick={handleAddTask}
            disabled={!newTaskName.trim()}
            className="apex-button flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </motion.button>
        </div>
      </motion.div>

      {/* Tasks List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => {
            const taskScore = getTaskScore(task);
            const scoreColor = getResilienceColor(taskScore);
            const isEditing = editingTask === task.id;

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="apex-card overflow-hidden"
              >
                {/* Task Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => setEditingTask(isEditing ? null : task.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg',
                      scoreColor === 'emerald' && 'bg-emerald-500/20 text-emerald-400',
                      scoreColor === 'amber' && 'bg-amber-500/20 text-amber-400',
                      scoreColor === 'rose' && 'bg-rose-500/20 text-rose-400'
                    )}>
                      {taskScore}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-100">{task.name}</h4>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        {temporalities.find(t => t.id === task.temporality)?.icon}
                        {getTemporalityLabel(task.temporality)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTask(task.id);
                      }}
                      className="p-2 hover:bg-rose-500/20 rounded-lg transition-colors text-slate-400 hover:text-rose-400"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                    <motion.div
                      animate={{ rotate: isEditing ? 180 : 0 }}
                      className="text-slate-400"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Resilience Sliders */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-800"
                    >
                      <div className="p-6 space-y-6">
                        <p className="text-sm text-slate-400">
                          Évaluez la résilience de cette tâche face à l'IA (100 = très résilient, humain essentiel)
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <ResilienceSlider
                            label="Données"
                            description="Complexité des données manipulées"
                            icon={<Database className="w-4 h-4" />}
                            value={task.resilience.donnees}
                            onChange={(v) => handleUpdateResilience(task.id, 'donnees', v)}
                          />
                          
                          <ResilienceSlider
                            label="Décision"
                            description="Jugement et prise de décision"
                            icon={<Brain className="w-4 h-4" />}
                            value={task.resilience.decision}
                            onChange={(v) => handleUpdateResilience(task.id, 'decision', v)}
                          />
                          
                          <ResilienceSlider
                            label="Relationnel"
                            description="Interactions humaines requises"
                            icon={<Heart className="w-4 h-4" />}
                            value={task.resilience.relationnel}
                            onChange={(v) => handleUpdateResilience(task.id, 'relationnel', v)}
                          />
                          
                          <ResilienceSlider
                            label="Créativité"
                            description="Innovation et pensée originale"
                            icon={<Sparkles className="w-4 h-4" />}
                            value={task.resilience.creativite}
                            onChange={(v) => handleUpdateResilience(task.id, 'creativite', v)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-slate-500"
          >
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Ajoutez au moins une tâche pour continuer</p>
          </motion.div>
        )}
      </div>

      {/* Summary */}
      {tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="apex-card p-4 flex items-center justify-between"
        >
          <span className="text-slate-400">
            {tasks.length} tâche{tasks.length > 1 ? 's' : ''} enregistrée{tasks.length > 1 ? 's' : ''}
          </span>
          <span className="text-slate-300 font-medium">
            Score moyen :{' '}
            <span className={cn(
              'font-bold',
              getResilienceColor(Math.round(tasks.reduce((acc, t) => acc + getTaskScore(t), 0) / tasks.length)) === 'emerald' && 'text-emerald-400',
              getResilienceColor(Math.round(tasks.reduce((acc, t) => acc + getTaskScore(t), 0) / tasks.length)) === 'amber' && 'text-amber-400',
              getResilienceColor(Math.round(tasks.reduce((acc, t) => acc + getTaskScore(t), 0) / tasks.length)) === 'rose' && 'text-rose-400'
            )}>
              {Math.round(tasks.reduce((acc, t) => acc + getTaskScore(t), 0) / tasks.length)}%
            </span>
          </span>
        </motion.div>
      )}

      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel="Définir vos talents"
      />
    </motion.div>
  );
}

