'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuditStore, Temporality, Task } from '@/lib/store';
import { ResilienceSlider } from '@/components/ui/ResilienceSlider';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { cn, getResilienceColor } from '@/lib/utils';

const TEMPORALITIES: Temporality[] = ['quotidien', 'hebdomadaire', 'mensuel', 'strategique'];

export function Step3Tasks() {
  const t = useTranslations('step3');
  const { tasks, addTask, removeTask, updateTask, nextStep, prevStep } = useAuditStore();
  
  const [newTaskName, setNewTaskName] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const canProceed = tasks.length > 0;

  const temporalityLabels: Record<Temporality, string> = {
    quotidien: t('temporality.daily'),
    hebdomadaire: t('temporality.weekly'),
    mensuel: t('temporality.monthly'),
    strategique: t('temporality.strategic'),
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      addTask(newTaskName.trim());
      setNewTaskName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const getTaskAverage = (task: Task): number => {
    const { donnees, decision, relationnel, creativite } = task.resilience;
    return Math.round((donnees + decision + relationnel + creativite) / 4);
  };

  const getOverallAverage = (): number => {
    if (tasks.length === 0) return 0;
    const sum = tasks.reduce((acc, task) => acc + getTaskAverage(task), 0);
    return Math.round(sum / tasks.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          className="apex-title text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t('title')}
        </motion.h1>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>
      </div>

      {/* Add Task Input */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="apex-label">{t('addTask')}</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('taskPlaceholder')}
            className="apex-input flex-1"
          />
          <motion.button
            onClick={handleAddTask}
            disabled={!newTaskName.trim()}
            className="apex-button flex items-center gap-2 whitespace-nowrap"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            {t('add')}
          </motion.button>
        </div>
      </motion.div>

      {/* Tasks List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="apex-card p-8 text-center"
            >
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">{t('noTasks')}</p>
            </motion.div>
          ) : (
            tasks.map((task, index) => {
              const isExpanded = expandedTaskId === task.id;
              const avgScore = getTaskAverage(task);
              const color = getResilienceColor(avgScore);

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
                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                    onClick={() => toggleExpand(task.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-slate-200">{task.name}</span>
                        <select
                          value={task.temporalite}
                          onChange={(e) => updateTask(task.id, { temporalite: e.target.value as Temporality })}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-400"
                        >
                          {TEMPORALITIES.map((temp) => (
                            <option key={temp} value={temp}>
                              {temporalityLabels[temp]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'text-lg font-bold tabular-nums',
                        color === 'emerald' && 'text-emerald-400',
                        color === 'amber' && 'text-amber-400',
                        color === 'rose' && 'text-rose-400'
                      )}>
                        {avgScore}%
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTask(task.id);
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Resilience Sliders */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-800"
                      >
                        <div className="p-6 space-y-6">
                          <p className="text-sm text-slate-500">
                            {t('resilienceHint')}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ResilienceSlider
                              label={t('resilience.data')}
                              description={t('resilience.dataDesc')}
                              value={task.resilience.donnees}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, donnees: value }
                              })}
                            />
                            <ResilienceSlider
                              label={t('resilience.decision')}
                              description={t('resilience.decisionDesc')}
                              value={task.resilience.decision}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, decision: value }
                              })}
                            />
                            <ResilienceSlider
                              label={t('resilience.relational')}
                              description={t('resilience.relationalDesc')}
                              value={task.resilience.relationnel}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, relationnel: value }
                              })}
                            />
                            <ResilienceSlider
                              label={t('resilience.creativity')}
                              description={t('resilience.creativityDesc')}
                              value={task.resilience.creativite}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, creativite: value }
                              })}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Summary */}
      {tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="apex-card p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              {tasks.length}
            </div>
            <span className="text-slate-300">
              {tasks.length === 1 ? t('taskRegistered') : t('tasksRegistered')}
            </span>
          </div>
          
          <div className="text-right">
            <span className="text-sm text-slate-500">{t('averageScore')}</span>
            <span className={cn(
              'ml-2 text-xl font-bold',
              getResilienceColor(getOverallAverage()) === 'emerald' && 'text-emerald-400',
              getResilienceColor(getOverallAverage()) === 'amber' && 'text-amber-400',
              getResilienceColor(getOverallAverage()) === 'rose' && 'text-rose-400'
            )}>
              {getOverallAverage()}%
            </span>
          </div>
        </motion.div>
      )}

      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel={t('nextButton')}
      />
    </motion.div>
  );
}
