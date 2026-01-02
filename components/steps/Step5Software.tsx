'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, Zap, Trash2, CheckCircle, ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuditStore, SkillLevel } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';
import { cn } from '@/lib/utils';
import { personaLabels } from '@/lib/lexicon';

// Liste de suggestions d'outils courants
const TOOL_SUGGESTIONS = [
  'Excel', 'PowerPoint', 'Word', 'Google Sheets', 'Google Docs',
  'Figma', 'Sketch', 'Adobe XD', 'Canva', 'Photoshop', 'Illustrator',
  'Notion', 'Slack', 'Teams', 'Zoom', 'Asana', 'Monday', 'Jira', 'Trello',
  'Python', 'JavaScript', 'SQL', 'R', 'Power BI', 'Tableau',
  'ChatGPT', 'Claude', 'Midjourney', 'Copilot',
  'Salesforce', 'HubSpot', 'SAP', 'Oracle', 'Workday',
  'VS Code', 'GitHub', 'Docker', 'AWS', 'Azure'
];

interface ToolSlot {
  id: number;
  name: string;
  level: SkillLevel;
}

export function Step5Software() {
  const t = useTranslations('step5');
  const locale = useLocale();
  const { context, software, addSoftware, removeSoftware, updateSoftware, nextStep, prevStep } = useAuditStore();
  
  const [slots, setSlots] = useState<ToolSlot[]>([
    { id: 1, name: '', level: 'avance' },
    { id: 2, name: '', level: 'avance' },
    { id: 3, name: '', level: 'avance' },
  ]);
  
  const [showSuggestions, setShowSuggestions] = useState<number | null>(null);

  const persona = context.persona || 'salarie';
  const l = locale === 'en' ? 'en' : 'fr';

  // Synchroniser les slots avec le store
  useEffect(() => {
    if (software.length > 0) {
      const newSlots = [...slots];
      software.forEach((sw, index) => {
        if (index < 3) {
          newSlots[index] = { id: index + 1, name: sw.name, level: sw.level };
        }
      });
      setSlots(newSlots);
    }
  }, []);

  // Mettre à jour le store quand les slots changent
  const syncToStore = (updatedSlots: ToolSlot[]) => {
    // Supprimer tous les outils existants
    software.forEach(sw => removeSoftware(sw.id));
    
    // Ajouter les nouveaux outils
    updatedSlots.forEach(slot => {
      if (slot.name.trim()) {
        addSoftware(slot.name.trim());
      }
    });

    // Mettre à jour les niveaux
    setTimeout(() => {
      const currentSoftware = useAuditStore.getState().software;
      updatedSlots.forEach((slot, index) => {
        if (slot.name.trim() && currentSoftware[index]) {
          updateSoftware(currentSoftware[index].id, slot.level);
        }
      });
    }, 50);
  };

  const handleSlotNameChange = (slotId: number, name: string) => {
    const newSlots = slots.map(slot => 
      slot.id === slotId ? { ...slot, name } : slot
    );
    setSlots(newSlots);
  };

  const handleSlotLevelChange = (slotId: number, level: SkillLevel) => {
    const newSlots = slots.map(slot => 
      slot.id === slotId ? { ...slot, level } : slot
    );
    setSlots(newSlots);
    syncToStore(newSlots);
  };

  const handleSlotBlur = (slotId: number) => {
    setShowSuggestions(null);
    syncToStore(slots);
  };

  const handleSuggestionClick = (slotId: number, suggestion: string) => {
    const newSlots = slots.map(slot => 
      slot.id === slotId ? { ...slot, name: suggestion } : slot
    );
    setSlots(newSlots);
    setShowSuggestions(null);
    syncToStore(newSlots);
  };

  const clearSlot = (slotId: number) => {
    const newSlots = slots.map(slot => 
      slot.id === slotId ? { ...slot, name: '', level: 'avance' as SkillLevel } : slot
    );
    setSlots(newSlots);
    syncToStore(newSlots);
  };

  // Filtrer les suggestions
  const getFilteredSuggestions = (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return [];
    
    const usedNames = slots.filter(s => s.id !== slotId && s.name).map(s => s.name.toLowerCase());
    
    return TOOL_SUGGESTIONS.filter(tool => 
      tool.toLowerCase().includes(slot.name.toLowerCase()) &&
      !usedNames.includes(tool.toLowerCase())
    ).slice(0, 6);
  };

  // Vérifier si au moins un outil est renseigné
  const filledSlots = slots.filter(slot => slot.name.trim());
  const canProceed = filledSlots.length >= 1;

  const slotIcons = [
    <Cpu className="w-5 h-5" key="cpu" />,
    <Layers className="w-5 h-5" key="layers" />,
    <Zap className="w-5 h-5" key="zap" />
  ];

  const levelConfig: { value: SkillLevel; label: { fr: string; en: string }; description: { fr: string; en: string }; color: string }[] = [
    { 
      value: 'debutant', 
      label: { fr: 'Débutant', en: 'Beginner' },
      description: { fr: 'Usage occasionnel / Besoin de support', en: 'Occasional use / Need support' },
      color: 'slate'
    },
    { 
      value: 'avance', 
      label: { fr: 'Avancé', en: 'Advanced' },
      description: { fr: 'Usage quotidien / Autonome', en: 'Daily use / Autonomous' },
      color: 'blue'
    },
    { 
      value: 'expert', 
      label: { fr: 'Expert', en: 'Expert' },
      description: { fr: 'Référent technique / Optimisation', en: 'Technical reference / Optimization' },
      color: 'amber'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
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
            {l === 'fr' ? 'Diagnostic de l\'Écosystème Technologique' : 'Technology Ecosystem Diagnostic'}
          </h1>
        </motion.div>
        <motion.p
          className="apex-subtitle text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {l === 'fr' 
            ? 'Identifiez les 3 outils majeurs de votre flux de production et votre niveau d\'expertise actuel.'
            : 'Identify the 3 major tools in your production workflow and your current expertise level.'}
        </motion.p>
      </div>

      {/* Status Bar */}
      <motion.div
        className="apex-card p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300',
            filledSlots.length >= 1 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-slate-700 text-slate-400'
          )}>
            {filledSlots.length}
          </div>
          <div>
            <p className="text-slate-200 font-medium">
              {l === 'fr' ? 'Outils renseignés' : 'Tools entered'} 
              <span className="text-slate-500 ml-1">/ 3</span>
            </p>
            <p className="text-sm text-slate-500">
              {filledSlots.length >= 1 
                ? (l === 'fr' ? '✓ Au moins 1 outil renseigné' : '✓ At least 1 tool entered')
                : (l === 'fr' ? 'Renseignez au moins 1 outil' : 'Enter at least 1 tool')}
            </p>
          </div>
        </div>
        
        {filledSlots.length >= 3 && (
          <CheckCircle className="w-6 h-6 text-emerald-400" />
        )}
      </motion.div>

      {/* 3 Tool Slots */}
      <div className="space-y-6">
        {slots.map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="apex-card p-6 space-y-4"
          >
            {/* Slot Header */}
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300',
                slot.name.trim() 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-slate-800 text-slate-500'
              )}>
                {slotIcons[index]}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-1">
                  {l === 'fr' ? `Outil #${index + 1}` : `Tool #${index + 1}`}
                </p>
              </div>
              {slot.name.trim() && (
                <button
                  onClick={() => clearSlot(slot.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tool Name Input with Combobox */}
            <div className="relative">
              <input
                type="text"
                value={slot.name}
                onChange={(e) => handleSlotNameChange(slot.id, e.target.value)}
                onFocus={() => setShowSuggestions(slot.id)}
                onBlur={() => setTimeout(() => handleSlotBlur(slot.id), 150)}
                placeholder={l === 'fr' ? 'Nom du logiciel ou outil...' : 'Software or tool name...'}
                className="apex-input w-full pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              
              {/* Suggestions Dropdown */}
              {showSuggestions === slot.id && getFilteredSuggestions(slot.id).length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                  {getFilteredSuggestions(slot.id).map((suggestion) => (
                    <button
                      key={suggestion}
                      onMouseDown={() => handleSuggestionClick(slot.id, suggestion)}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Proficiency Level Selector */}
            <div>
              <p className="text-xs text-slate-500 mb-2">
                {l === 'fr' ? 'Niveau de maîtrise' : 'Proficiency level'}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {levelConfig.map((level) => {
                  const isActive = slot.level === level.value;
                  return (
                    <motion.button
                      key={level.value}
                      onClick={() => handleSlotLevelChange(slot.id, level.value)}
                      className={cn(
                        'py-3 px-2 rounded-lg text-center transition-all duration-200 border',
                        isActive
                          ? level.color === 'amber'
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : level.color === 'blue'
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                              : 'bg-slate-700 border-slate-600 text-slate-200'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="font-medium text-sm">{level.label[l]}</p>
                      <p className="text-xs opacity-70 mt-1 hidden sm:block">{level.description[l]}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary when complete */}
      {filledSlots.length === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="apex-card p-6 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border-emerald-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="text-slate-200 font-medium">
              {l === 'fr' ? 'Écosystème technologique défini' : 'Technology ecosystem defined'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filledSlots.map((slot) => {
              const levelInfo = levelConfig.find(lc => lc.value === slot.level);
              return (
                <span 
                  key={slot.id}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium',
                    slot.level === 'expert' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : slot.level === 'avance'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-700 text-slate-300 border border-slate-600'
                  )}
                >
                  {slot.name} <span className="opacity-70">• {levelInfo?.label[l]}</span>
                </span>
              );
            })}
          </div>
        </motion.div>
      )}

      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        nextDisabled={!canProceed}
        nextLabel={l === 'fr' ? 'Voir le Verdict' : 'See the Verdict'}
        nextVariant="success"
      />
    </motion.div>
  );
}
