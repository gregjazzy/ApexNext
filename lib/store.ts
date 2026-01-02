import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type Persona = 'salarie' | 'freelance' | 'leader' | null;
export type Goal = 'augmentation' | 'pivot' | null;
export type Temporality = 'quotidien' | 'hebdomadaire' | 'mensuel' | 'strategique';
export type SkillLevel = 'debutant' | 'avance' | 'expert';

export interface ResilienceScores {
  donnees: number;      // 0-100: Tâches basées sur les données
  decision: number;     // 0-100: Prise de décision
  relationnel: number;  // 0-100: Aspect relationnel/humain
  creativite: number;   // 0-100: Créativité requise
}

export interface Task {
  id: string;
  name: string;
  temporalite: Temporality;
  resilience: ResilienceScores;
  createdAt: number;
}

export interface Talent {
  id: string;
  name: string;
  category: string;
  level: number; // 1-5
  selected: boolean;
}

export interface Software {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface AuditContext {
  persona: Persona;
  goal: Goal;
  jobTitle: string;
  industry: string;
  jobDescription: string;
}

interface AuditStore {
  // Current step in the audit flow
  currentStep: number;
  
  // Context
  context: AuditContext;
  
  // Tasks
  tasks: Task[];
  
  // Talents (user's signature)
  talents: Talent[];
  
  // Software stack
  software: Software[];
  
  // Actions - Navigation
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Actions - Context
  setPersona: (persona: Persona) => void;
  setGoal: (goal: Goal) => void;
  setJobTitle: (title: string) => void;
  setIndustry: (industry: string) => void;
  setJobDescription: (description: string) => void;
  
  // Actions - Tasks
  addTask: (name: string) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  removeTask: (id: string) => void;
  
  // Actions - Talents
  toggleTalent: (id: string) => void;
  setTalentLevel: (id: string, level: number) => void;
  initializeTalents: () => void;
  
  // Actions - Software
  addSoftware: (name: string) => void;
  updateSoftware: (id: string, level: SkillLevel) => void;
  removeSoftware: (id: string) => void;
  
  // Computed values
  getSelectedTalents: () => Talent[];
  getResilienceScore: () => number;
  getTalentScore: () => number;
  
  // Reset
  reset: () => void;
}

// Predefined talents list
export const AVAILABLE_TALENTS: Omit<Talent, 'level' | 'selected'>[] = [
  // Analytiques
  { id: 'analyse-donnees', name: 'Analyse de données', category: 'Analytique' },
  { id: 'resolution-problemes', name: 'Résolution de problèmes', category: 'Analytique' },
  { id: 'pensee-critique', name: 'Pensée critique', category: 'Analytique' },
  { id: 'recherche', name: 'Recherche & Investigation', category: 'Analytique' },
  
  // Relationnels
  { id: 'negociation', name: 'Négociation', category: 'Relationnel' },
  { id: 'leadership', name: 'Leadership', category: 'Relationnel' },
  { id: 'communication', name: 'Communication', category: 'Relationnel' },
  { id: 'empathie', name: 'Empathie & Écoute', category: 'Relationnel' },
  { id: 'gestion-conflits', name: 'Gestion des conflits', category: 'Relationnel' },
  
  // Créatifs
  { id: 'design', name: 'Design & Esthétique', category: 'Créatif' },
  { id: 'innovation', name: 'Innovation', category: 'Créatif' },
  { id: 'storytelling', name: 'Storytelling', category: 'Créatif' },
  { id: 'ideation', name: 'Idéation & Brainstorming', category: 'Créatif' },
  
  // Opérationnels
  { id: 'gestion-projet', name: 'Gestion de projet', category: 'Opérationnel' },
  { id: 'organisation', name: 'Organisation', category: 'Opérationnel' },
  { id: 'planification', name: 'Planification stratégique', category: 'Opérationnel' },
  { id: 'execution', name: 'Exécution & Rigueur', category: 'Opérationnel' },
  
  // Techniques
  { id: 'tech-savvy', name: 'Maîtrise technologique', category: 'Technique' },
  { id: 'automatisation', name: 'Automatisation', category: 'Technique' },
  { id: 'integration', name: 'Intégration de systèmes', category: 'Technique' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialContext: AuditContext = {
  persona: null,
  goal: null,
  jobTitle: '',
  industry: '',
  jobDescription: '',
};

export const useAuditStore = create<AuditStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      context: initialContext,
      tasks: [],
      talents: [],
      software: [],

      // Navigation
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      // Context
      setPersona: (persona) => set((state) => ({
        context: { ...state.context, persona }
      })),
      setGoal: (goal) => set((state) => ({
        context: { ...state.context, goal }
      })),
      setJobTitle: (jobTitle) => set((state) => ({
        context: { ...state.context, jobTitle }
      })),
      setIndustry: (industry) => set((state) => ({
        context: { ...state.context, industry }
      })),
      setJobDescription: (jobDescription) => set((state) => ({
        context: { ...state.context, jobDescription }
      })),

      // Tasks
      addTask: (name) => set((state) => ({
        tasks: [...state.tasks, {
          id: generateId(),
          name,
          temporalite: 'quotidien' as Temporality,
          resilience: {
            donnees: 50,
            decision: 50,
            relationnel: 50,
            creativite: 50,
          },
          createdAt: Date.now(),
        }]
      })),
      updateTask: (id, taskUpdate) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...taskUpdate } : t
        )
      })),
      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),

      // Talents
      initializeTalents: () => set({
        talents: AVAILABLE_TALENTS.map((t) => ({
          ...t,
          level: 3,
          selected: false,
        }))
      }),
      toggleTalent: (id) => set((state) => {
        const selectedCount = state.talents.filter(t => t.selected).length;
        const talent = state.talents.find(t => t.id === id);
        
        // Can't select more than 5
        if (!talent?.selected && selectedCount >= 5) {
          return state;
        }
        
        return {
          talents: state.talents.map((t) =>
            t.id === id ? { ...t, selected: !t.selected } : t
          )
        };
      }),
      setTalentLevel: (id, level) => set((state) => ({
        talents: state.talents.map((t) =>
          t.id === id ? { ...t, level: Math.min(5, Math.max(1, level)) } : t
        )
      })),

      // Software
      addSoftware: (name) => set((state) => ({
        software: state.software.length < 3
          ? [...state.software, { id: generateId(), name, level: 'debutant' as SkillLevel }]
          : state.software
      })),
      updateSoftware: (id, level) => set((state) => ({
        software: state.software.map((s) =>
          s.id === id ? { ...s, level } : s
        )
      })),
      removeSoftware: (id) => set((state) => ({
        software: state.software.filter((s) => s.id !== id)
      })),

      // Computed
      getSelectedTalents: () => get().talents.filter(t => t.selected),
      
      getResilienceScore: () => {
        const tasks = get().tasks;
        if (tasks.length === 0) return 0;
        
        const totalScores = tasks.reduce((acc, task) => {
          const taskScore = (
            task.resilience.donnees +
            task.resilience.decision +
            task.resilience.relationnel +
            task.resilience.creativite
          ) / 4;
          return acc + taskScore;
        }, 0);
        
        return Math.round(totalScores / tasks.length);
      },
      
      getTalentScore: () => {
        const selectedTalents = get().getSelectedTalents();
        if (selectedTalents.length === 0) return 0;
        
        const totalLevel = selectedTalents.reduce((acc, t) => acc + t.level, 0);
        return Math.round((totalLevel / (selectedTalents.length * 5)) * 100);
      },

      // Reset
      reset: () => set({
        currentStep: 1,
        context: initialContext,
        tasks: [],
        talents: AVAILABLE_TALENTS.map((t) => ({
          ...t,
          level: 3,
          selected: false,
        })),
        software: [],
      }),
    }),
    {
      name: 'apex-audit-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        context: state.context,
        tasks: state.tasks,
        talents: state.talents,
        software: state.software,
      }),
    }
  )
);

