'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Plus, Trash2, Award } from 'lucide-react';
import { useAuditStore, SkillLevel } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { cn, getLevelLabel } from '@/lib/utils';

const levels: { id: SkillLevel; label: string; color: string }[] = [
  { id: 'debutant', label: 'Débutant', color: 'text-slate-400 border-slate-600' },
  { id: 'avance', label: 'Avancé', color: 'text-blue-400 border-blue-500' },
  { id: 'expert', label: 'Expert', color: 'text-amber-400 border-amber-500' },
];

const suggestedSoftware = [
  'Excel / Google Sheets',
  'PowerPoint / Slides',
  'Slack / Teams',
  'Notion / Confluence',
  'Salesforce',
  'SAP',
  'Photoshop / Figma',
  'VS Code / IDE',
  'Python / R',
  'ChatGPT / Claude',
  'Tableau / Power BI',
  'Jira / Asana',
];

export function Step5Software() {
  const { software, addSoftware, updateSoftware, removeSoftware, nextStep, prevStep } = useAuditStore();
  const [newSoftwareName, setNewSoftwareName] = useState('');
  const [newSoftwareLevel, setNewSoftwareLevel] = useState<SkillLevel>('avance');

  const canProceed = software.length >= 1;
  const canAddMore = software.length < 3;

  const handleAddSoftware = () => {
    if (!newSoftwareName.trim() || !canAddMore) return;
    
    addSoftware({
      name: newSoftwareName.trim(),
      level: newSoftwareLevel,
    });
    
    setNewSoftwareName('');
    setNewSoftwareLevel('avance');
  };

  const handleQuickAdd = (name: string) => {
    if (!canAddMore || software.some(s => s.name === name)) return;
    addSoftware({ name, level: 'avance' });
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
          Tech Scan
        </motion.h1>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Identifiez vos 3 outils principaux et votre niveau de maîtrise.
        </motion.p>
      </div>

      {/* Counter */}
      <motion.div
        className="apex-card p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-blue-400" />
          <span className="text-slate-300">Outils ajoutés</span>
        </div>
        <div className="flex items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-3 h-3 rounded-full transition-all duration-300',
                i < software.length ? 'bg-blue-500' : 'bg-slate-700'
              )}
            />
          ))}
          <span className={cn(
            'ml-2 font-bold tabular-nums',
            software.length === 3 ? 'text-blue-400' : 'text-slate-400'
          )}>
            {software.length}/3
          </span>
        </div>
      </motion.div>

      {/* Current Software */}
      <AnimatePresence mode="popLayout">
        {software.map((sw, index) => (
          <motion.div
            key={sw.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="apex-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-100">{sw.name}</h4>
                  <span className={cn(
                    'text-sm font-medium',
                    sw.level === 'expert' && 'text-amber-400',
                    sw.level === 'avance' && 'text-blue-400',
                    sw.level === 'debutant' && 'text-slate-400'
                  )}>
                    {getLevelLabel(sw.level)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Level Selector */}
                <div className="flex gap-1">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => updateSoftware(sw.id, { level: level.id })}
                      className={cn(
                        'px-3 py-1 rounded text-xs font-medium border transition-all duration-200',
                        sw.level === level.id
                          ? level.color + ' bg-opacity-20'
                          : 'border-slate-700 text-slate-500 hover:border-slate-600'
                      )}
                      style={{
                        backgroundColor: sw.level === level.id 
                          ? level.id === 'expert' ? 'rgba(245, 158, 11, 0.1)' 
                          : level.id === 'avance' ? 'rgba(59, 130, 246, 0.1)' 
                          : 'rgba(148, 163, 184, 0.1)'
                          : undefined
                      }}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>

                {/* Delete */}
                <motion.button
                  onClick={() => removeSoftware(sw.id)}
                  className="p-2 hover:bg-rose-500/20 rounded-lg transition-colors text-slate-400 hover:text-rose-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Software Form */}
      {canAddMore && (
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-slate-200 mb-4">Ajouter un outil</h3>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={newSoftwareName}
                onChange={(e) => setNewSoftwareName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSoftware()}
                placeholder="Ex: Excel, Figma, Python..."
                className="apex-input"
              />
            </div>
            
            <div className="flex gap-2">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setNewSoftwareLevel(level.id)}
                  className={cn(
                    'px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium',
                    newSoftwareLevel === level.id
                      ? level.color + ' bg-opacity-20'
                      : 'border-slate-700 text-slate-500 hover:border-slate-600'
                  )}
                  style={{
                    backgroundColor: newSoftwareLevel === level.id 
                      ? level.id === 'expert' ? 'rgba(245, 158, 11, 0.1)' 
                      : level.id === 'avance' ? 'rgba(59, 130, 246, 0.1)' 
                      : 'rgba(148, 163, 184, 0.1)'
                      : undefined
                  }}
                >
                  {level.label}
                </button>
              ))}
            </div>
            
            <motion.button
              onClick={handleAddSoftware}
              disabled={!newSoftwareName.trim()}
              className="apex-button flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </motion.button>
          </div>

          {/* Quick Add Suggestions */}
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider mb-3 block">
              Suggestions rapides
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedSoftware
                .filter(name => !software.some(s => s.name === name))
                .slice(0, 8)
                .map((name) => (
                  <motion.button
                    key={name}
                    onClick={() => handleQuickAdd(name)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + {name}
                  </motion.button>
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {software.length === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="apex-card p-6 text-center glow-blue"
        >
          <Award className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <p className="text-slate-300">
            Stack technologique défini !
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {software.filter(s => s.level === 'expert').length} outil(s) en niveau Expert
          </p>
        </motion.div>
      )}

      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel="Voir le verdict"
        nextVariant="success"
      />
    </motion.div>
  );
}

