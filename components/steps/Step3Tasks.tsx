'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Trash2, ChevronDown, ChevronUp, Cpu, Users, Lightbulb, Brain, Cog, Timer, Sparkles, Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuditStore, Temporality, Task } from '@/lib/store';
import { ResilienceSlider } from '@/components/ui/ResilienceSlider';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { PhantomChargeScanner } from '@/components/PhantomChargeScanner';
import { TaskSelector } from '@/components/TaskSelector';
import { cn, getResilienceColor } from '@/lib/utils';
import { tasksLexicon, getLexiconValue, personaLabels } from '@/lib/lexicon';

const TEMPORALITIES: Temporality[] = ['quotidien', 'hebdomadaire', 'mensuel', 'strategique'];

export function Step3Tasks() {
  const t = useTranslations('step3');
  const locale = useLocale();
  const { context, tasks, addTask, addTasksFromAI, clearTasks, removeTask, updateTask, nextStep, prevStep } = useAuditStore();
  
  const [newTaskName, setNewTaskName] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const canProceed = tasks.length > 0;
  const persona = context.persona || 'salarie';
  const goal = context.goal;
  const l = locale === 'en' ? 'en' : 'fr';
  
  // ===============================================
  // LOGIQUE D'AFFICHAGE DU SCANNER DE CHARGE FANTÔME
  // ===============================================
  // Obligatoire : salarie, freelance, ou leader + augmentation
  // Toggle (optionnel) : leader + pivot ou reclassement
  const showPhantomScanner = useMemo(() => {
    if (persona === 'salarie' || persona === 'freelance') {
      return { show: true, isToggle: false };
    }
    if (persona === 'leader') {
      if (goal === 'augmentation') {
        return { show: true, isToggle: false };
      }
      if (goal === 'pivot' || goal === 'reclassement') {
        return { show: true, isToggle: true };
      }
    }
    return { show: false, isToggle: false };
  }, [persona, goal]);

  const temporalityLabels: Record<Temporality, string> = {
    quotidien: t('temporality.daily'),
    hebdomadaire: t('temporality.weekly'),
    mensuel: t('temporality.monthly'),
    strategique: t('temporality.strategic'),
  };

  const handleAddTask = () => {
    if (newTaskName.trim()) {
      const newTaskId = addTask(newTaskName.trim());
      setNewTaskName('');
      // Auto-déplier la nouvelle tâche pour montrer les curseurs à renseigner
      setExpandedTaskId(newTaskId);
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

  // Calcul sur 5 dimensions maintenant
  const getTaskAverage = (task: Task): number => {
    const { donnees, decision, relationnel, creativite, execution } = task.resilience;
    return Math.round((donnees + decision + relationnel + creativite + execution) / 5);
  };

  // Moyenne pondérée par les heures/semaine
  const getOverallAverage = (): number => {
    if (tasks.length === 0) return 0;
    const totalHours = tasks.reduce((acc, task) => acc + (task.hoursPerWeek || 4), 0);
    if (totalHours === 0) return 0;
    const weightedSum = tasks.reduce((acc, task) => {
      const weight = (task.hoursPerWeek || 4) / totalHours;
      return acc + getTaskAverage(task) * weight;
    }, 0);
    return Math.round(weightedSum);
  };

  // Total des heures/semaine (pour affichage)
  const getTotalHours = (): number => {
    return tasks.reduce((acc, task) => acc + (task.hoursPerWeek || 4), 0);
  };

  // Analyse automatique du document
  const handleAnalyzeWithAI = async () => {
    if (!context.jobDescription && !context.jobTitle) {
      setAnalyzeError(l === 'fr' 
        ? 'Retournez à l\'étape 2 pour ajouter une description de poste.' 
        : 'Go back to step 2 to add a job description.');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: context.jobDescription,
          jobTitle: context.jobTitle,
          industry: context.industry,
          persona: context.persona,
        }),
      });

      const data = await response.json();

      if (data.success && data.tasks.length > 0) {
        // Optionnel: effacer les tâches existantes avant d'ajouter
        // clearTasks();
        addTasksFromAI(data.tasks);
        // Déplier la première tâche ajoutée
        if (data.tasks.length > 0) {
          // Les nouvelles tâches seront en haut (triées par createdAt desc)
        }
      } else {
        setAnalyzeError(data.error || (l === 'fr' ? 'Aucune tâche identifiée.' : 'No tasks identified.'));
      }
    } catch (error) {
      console.error('Error analyzing job:', error);
      setAnalyzeError(l === 'fr' ? 'Erreur de connexion. Réessayez.' : 'Connection error. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      {/* Header with Dynamic Title */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Mode Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Mode Diagnostic : {personaLabels[persona][l]}
          </span>
          
          <h1 className="apex-title text-4xl md:text-5xl">
            {getLexiconValue(tasksLexicon.title, persona, locale)}
          </h1>
        </motion.div>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getLexiconValue(tasksLexicon.subtitle, persona, locale)}
        </motion.p>
      </div>

      {/* =============================================== */}
      {/* SCANNER DE CHARGE FANTÔME (Emails & Flux) */}
      {/* Quantification de la charge administrative invisible */}
      {/* =============================================== */}
      {showPhantomScanner.show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <PhantomChargeScanner isToggleMode={showPhantomScanner.isToggle} />
        </motion.div>
      )}

      {/* =============================================== */}
      {/* SÉLECTEUR DE TÂCHES (via LLM) */}
      {/* Génération automatique des tâches typiques du métier/secteur */}
      {/* =============================================== */}
      {context.jobTitle && context.industry && tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="apex-card p-6"
        >
          <TaskSelector />
        </motion.div>
      )}

      {/* AI Analysis Button (legacy - pour fiche de poste uploadée) */}
      {context.jobDescription && tasks.length === 0 && (
        <motion.div
          className="apex-card p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-200">
                  {l === 'fr' ? 'Analyse automatique disponible' : 'Automatic analysis available'}
                </h3>
                <p className="text-sm text-slate-400">
                  {l === 'fr' 
                    ? 'Générez automatiquement vos tâches depuis votre fiche de poste' 
                    : 'Automatically generate tasks from your job description'}
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzing}
              className="apex-button flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {l === 'fr' ? 'Analyse...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {l === 'fr' ? 'Générer les tâches' : 'Generate tasks'}
                </>
              )}
            </motion.button>
          </div>
          
          {analyzeError && (
            <motion.p 
              className="mt-3 text-sm text-rose-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {analyzeError}
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Add Task Input */}
      <motion.div
        className="apex-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="apex-label">
          {getLexiconValue(tasksLexicon.addTaskLabel, persona, locale)}
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getLexiconValue(tasksLexicon.taskPlaceholder, persona, locale)}
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
              <p className="text-slate-400">
                {getLexiconValue(tasksLexicon.noTasksMessage, persona, locale)}
              </p>
            </motion.div>
          ) : (
            [...tasks].sort((a, b) => b.createdAt - a.createdAt).map((task, index) => {
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
                      <div className="flex items-center gap-3 flex-wrap">
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
                        {/* Indicateur heures */}
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {task.hoursPerWeek || 4}h/{l === 'fr' ? 'sem' : 'wk'}
                        </span>
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

                  {/* Expanded Resilience Sliders - 5 Dimensions */}
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
                          
                          {/* Temps + 5 Curseurs de Résilience */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* 0. Temps consacré (slider style) */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Timer className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-medium text-slate-200">
                                  {l === 'fr' ? 'Heures / semaine' : 'Hours / week'}
                                </span>
                                <span className="ml-auto text-lg font-bold text-blue-400">
                                  {task.hoursPerWeek || 4}h
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">
                                {l === 'fr' ? 'Temps moyen consacré à cette tâche' : 'Average time spent on this task'}
                              </p>
                              <input
                                type="range"
                                min="0.5"
                                max="20"
                                step="0.5"
                                value={task.hoursPerWeek || 4}
                                onChange={(e) => updateTask(task.id, { hoursPerWeek: parseFloat(e.target.value) })}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                              />
                              <div className="flex justify-between text-xs text-slate-600">
                                <span>0.5h</span>
                                <span>20h</span>
                              </div>
                            </div>
                            {/* 1. Données (Automatisation) */}
                            <ResilienceSlider
                              label={t('resilience.data')}
                              description={t('resilience.dataDesc')}
                              value={task.resilience.donnees}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, donnees: value }
                              })}
                              icon={<Cpu className="w-4 h-4" />}
                            />
                            
                            {/* 2. Décision */}
                            <ResilienceSlider
                              label={t('resilience.decision')}
                              description={t('resilience.decisionDesc')}
                              value={task.resilience.decision}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, decision: value }
                              })}
                              icon={<Brain className="w-4 h-4" />}
                            />
                            
                            {/* 3. Relationnel */}
                            <ResilienceSlider
                              label={t('resilience.relational')}
                              description={t('resilience.relationalDesc')}
                              value={task.resilience.relationnel}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, relationnel: value }
                              })}
                              icon={<Users className="w-4 h-4" />}
                            />
                            
                            {/* 4. Créativité */}
                            <ResilienceSlider
                              label={t('resilience.creativity')}
                              description={t('resilience.creativityDesc')}
                              value={task.resilience.creativite}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, creativite: value }
                              })}
                              icon={<Lightbulb className="w-4 h-4" />}
                            />
                            
                            {/* 5. Exécution Physique (NOUVEAU) */}
                            <ResilienceSlider
                              label={t('resilience.execution')}
                              description={t('resilience.executionDesc')}
                              value={task.resilience.execution}
                              onChange={(value) => updateTask(task.id, {
                                resilience: { ...task.resilience, execution: value }
                              })}
                              icon={<Cog className="w-4 h-4" />}
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
          className="apex-card p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                {tasks.length}
              </div>
              <span className="text-slate-300">
                {getLexiconValue(tasksLexicon.registeredLabel, persona, locale)}
              </span>
            </div>
            
            {/* Total heures/semaine */}
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-slate-500" />
              <span className={cn(
                'text-sm font-medium',
                getTotalHours() >= 35 && getTotalHours() <= 45 ? 'text-emerald-400' : 
                getTotalHours() > 50 ? 'text-rose-400' : 'text-amber-400'
              )}>
                {getTotalHours()}h/{l === 'fr' ? 'semaine' : 'week'}
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
