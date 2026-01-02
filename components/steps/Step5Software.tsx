'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Monitor, Trash2, Star, CheckCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuditStore, SkillLevel } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { cn } from '@/lib/utils';
import { softwareLexicon, getLexiconValue, personaLabels } from '@/lib/lexicon';

const LEVELS: SkillLevel[] = ['debutant', 'avance', 'expert'];
const COMMON_TOOLS = ['Excel', 'PowerPoint', 'Figma', 'Notion', 'Slack', 'Python', 'ChatGPT', 'Salesforce', 'Jira', 'Tableau'];

export function Step5Software() {
  const t = useTranslations('step5');
  const locale = useLocale();
  const { context, software, addSoftware, removeSoftware, updateSoftware, nextStep, prevStep } = useAuditStore();
  
  const [newToolName, setNewToolName] = useState('');

  const canProceed = software.length >= 3;
  const persona = context.persona || 'salarie';
  const l = locale === 'en' ? 'en' : 'fr';

  const levelLabels: Record<SkillLevel, string> = {
    debutant: t('levels.beginner'),
    avance: t('levels.advanced'),
    expert: t('levels.expert'),
  };

  const handleAddTool = (name?: string) => {
    const toolName = name || newToolName.trim();
    if (toolName && software.length < 3) {
      addSoftware(toolName);
      setNewToolName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTool();
    }
  };

  const expertCount = software.filter(s => s.level === 'expert').length;

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
            {getLexiconValue(softwareLexicon.title, persona, locale)}
          </h1>
        </motion.div>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {getLexiconValue(softwareLexicon.subtitle, persona, locale)}
        </motion.p>
      </div>

      {/* Software Count */}
      <motion.div
        className="apex-card p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-blue-400" />
          <span className="text-slate-300 font-medium">
            {t('added')}: <span className={cn(
              'font-bold',
              software.length >= 3 ? 'text-emerald-400' : 'text-blue-400'
            )}>{software.length}</span> / 3
          </span>
        </div>
        {software.length >= 3 && (
          <span className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            {t('stackDefined')}
          </span>
        )}
      </motion.div>

      {/* Add Tool Input */}
      {software.length < 3 && (
        <motion.div
          className="apex-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="apex-label">{t('addTool')}</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('toolPlaceholder')}
              className="apex-input flex-1"
            />
            <motion.button
              onClick={() => handleAddTool()}
              disabled={!newToolName.trim()}
              className="apex-button flex items-center gap-2 whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              {t('add')}
            </motion.button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-4">
            <p className="text-xs text-slate-500 mb-2">{t('quickSuggestions')}</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_TOOLS.filter(tool => 
                !software.some(s => s.name.toLowerCase() === tool.toLowerCase())
              ).slice(0, 6).map((tool) => (
                <button
                  key={tool}
                  onClick={() => handleAddTool(tool)}
                  className="px-3 py-1 text-sm rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
                >
                  + {tool}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Software List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {software.map((sw, index) => (
            <motion.div
              key={sw.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="apex-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-medium text-slate-200 text-lg">{sw.name}</span>
                </div>
                
                <button
                  onClick={() => removeSoftware(sw.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Level Selection */}
              <div className="flex gap-2">
                {LEVELS.map((level) => {
                  const isActive = sw.level === level;
                  return (
                    <motion.button
                      key={level}
                      onClick={() => updateSoftware(sw.id, level)}
                      className={cn(
                        'flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive
                          ? level === 'expert'
                            ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                            : level === 'avance'
                              ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                              : 'bg-slate-700 border border-slate-600 text-slate-200'
                          : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {levelLabels[level]}
                      {level === 'expert' && isActive && (
                        <Star className="w-4 h-4 inline-block ml-1 fill-amber-400 text-amber-400" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      {software.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="apex-card p-6 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border-emerald-500/30"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span className="text-slate-200 font-medium">{t('stackDefined')}</span>
            </div>
            {expertCount > 0 && (
              <span className="flex items-center gap-1 text-amber-400 text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                {expertCount} {t('expertTools')}
              </span>
            )}
          </div>
        </motion.div>
      )}

      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel={t('nextButton')}
        nextVariant="success"
      />
    </motion.div>
  );
}
