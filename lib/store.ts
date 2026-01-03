import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type Persona = 'salarie' | 'freelance' | 'leader' | null;
export type Goal = 'augmentation' | 'pivot' | null;
export type Temporality = 'quotidien' | 'hebdomadaire' | 'mensuel' | 'strategique';
export type SkillLevel = 'debutant' | 'avance' | 'expert';

// 5 Curseurs de Résilience (incluant Exécution Physique pour menace robotique)
export interface ResilienceScores {
  donnees: number;      // 0-100: Vulnérabilité données/IA
  decision: number;     // 0-100: Prise de décision
  relationnel: number;  // 0-100: Aspect relationnel/humain
  creativite: number;   // 0-100: Créativité requise
  execution: number;    // 0-100: Exécution Physique/Manuelle (menace robotique)
}

export interface Task {
  id: string;
  name: string;
  temporalite: Temporality;
  hoursPerWeek: number; // Heures par semaine consacrées à cette tâche
  resilience: ResilienceScores;
  createdAt: number;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  example: string; // Exemple concret pour tooltip
  icon: string;
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
  
  // Talents (user's signature) - 5 sur 12 Actifs Stratégiques
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
  addTask: (name: string) => string; // Retourne l'ID de la nouvelle tâche
  addTasksFromAI: (tasks: Array<{
    name: string;
    hoursPerWeek: number;
    temporalite: Temporality;
    resilience: ResilienceScores;
  }>) => void; // Bulk add depuis l'IA
  updateTask: (id: string, task: Partial<Task>) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;
  
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

// Les 12 Actifs Stratégiques Officiels avec descriptions et exemples concrets
export const STRATEGIC_ASSETS: Omit<Talent, 'level' | 'selected'>[] = [
  { 
    id: 'arbitrage-incertitude', 
    name: 'Arbitrage en Incertitude', 
    description: 'Décider et trancher quand les données sont incomplètes ou contradictoires.',
    example: 'Ex: Choisir un prestataire sans avoir toutes les références, lancer un projet malgré des inconnues.',
    icon: 'Scale'
  },
  { 
    id: 'synthese-strategique', 
    name: 'Synthèse Stratégique', 
    description: 'Transformer une masse d\'informations en une vision ou un cap clair.',
    example: 'Ex: Résumer 50 pages de rapport en 3 points clés, prioriser les actions après une réunion.',
    icon: 'Target'
  },
  { 
    id: 'intelligence-negociation', 
    name: 'Intelligence de Négociation', 
    description: 'Gérer des conflits d\'intérêts et obtenir des accords complexes.',
    example: 'Ex: Négocier une augmentation, gérer un désaccord entre services, convaincre un client difficile.',
    icon: 'Handshake'
  },
  { 
    id: 'pensee-systemique', 
    name: 'Pensée Systémique', 
    description: 'Comprendre comment un changement local impacte toute une organisation.',
    example: 'Ex: Anticiper les effets d\'un nouveau logiciel sur tous les services, prévoir les conséquences d\'une réorg.',
    icon: 'Network'
  },
  { 
    id: 'diagnostic-crise', 
    name: 'Diagnostic de Crise', 
    description: 'Identifier la cause d\'un problème inédit et improviser une solution.',
    example: 'Ex: Trouver pourquoi un process plante, gérer une urgence client, résoudre un bug critique.',
    icon: 'AlertTriangle'
  },
  { 
    id: 'tactique-relationnelle', 
    name: 'Tactique Relationnelle', 
    description: 'Construire des réseaux de confiance et d\'influence à haut niveau.',
    example: 'Ex: Se faire des alliés dans d\'autres équipes, cultiver de bonnes relations avec la direction.',
    icon: 'Users'
  },
  { 
    id: 'innovation-rupture', 
    name: 'Innovation de Rupture', 
    description: 'Imaginer des concepts qui n\'existent pas dans les bases de données passées.',
    example: 'Ex: Proposer une nouvelle façon de travailler, inventer un process inédit, créer un produit original.',
    icon: 'Lightbulb'
  },
  { 
    id: 'pilotage-ia', 
    name: 'Pilotage de l\'IA (IA Ops)', 
    description: 'Orchestrer et superviser des agents IA pour décupler la production.',
    example: 'Ex: Utiliser ChatGPT pour rédiger plus vite, automatiser des tâches avec l\'IA, créer des prompts efficaces.',
    icon: 'Bot'
  },
  { 
    id: 'ethique-gouvernance', 
    name: 'Éthique & Gouvernance', 
    description: 'Porter la responsabilité morale et légale des décisions automatisées.',
    example: 'Ex: Valider qu\'une décision IA est juste, s\'assurer du respect des règles RGPD, arbitrer un dilemme éthique.',
    icon: 'Shield'
  },
  { 
    id: 'leadership-transition', 
    name: 'Leadership de Transition', 
    description: 'Mobiliser et engager des équipes dans des phases de mutation profonde.',
    example: 'Ex: Accompagner une équipe dans un changement d\'outil, motiver lors d\'une restructuration.',
    icon: 'Flag'
  },
  { 
    id: 'analyse-critique', 
    name: 'Analyse Critique & Biais', 
    description: 'Repérer les erreurs, les hallucinations et les biais des systèmes d\'IA.',
    example: 'Ex: Vérifier qu\'un texte généré par IA est correct, détecter une info fausse, challenger un rapport.',
    icon: 'Search'
  },
  { 
    id: 'communication-influence', 
    name: 'Communication d\'Influence', 
    description: 'Aligner et convaincre des parties prenantes aux visions divergentes.',
    example: 'Ex: Présenter un projet au CODIR, convaincre des collègues réticents, fédérer autour d\'une idée.',
    icon: 'MessageSquare'
  },
];

// Legacy export for compatibility
export const AVAILABLE_TALENTS = STRATEGIC_ASSETS;

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

      // Tasks - avec 5 curseurs de résilience
      addTask: (name) => {
        const taskId = generateId();
        set((state) => ({
          tasks: [...state.tasks, {
            id: taskId,
            name,
            temporalite: 'quotidien' as Temporality,
            hoursPerWeek: 4, // Valeur par défaut: 4h/semaine
            resilience: {
              donnees: 50,
              decision: 50,
              relationnel: 50,
              creativite: 50,
              execution: 50,
            },
            createdAt: Date.now(),
          }]
        }));
        return taskId;
      },
      updateTask: (id, taskUpdate) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...taskUpdate } : t
        )
      })),
      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),
      addTasksFromAI: (aiTasks) => set((state) => ({
        tasks: [
          ...state.tasks,
          ...aiTasks.map((t) => ({
            id: generateId(),
            name: t.name,
            temporalite: t.temporalite,
            hoursPerWeek: t.hoursPerWeek,
            resilience: t.resilience,
            createdAt: Date.now(),
          }))
        ]
      })),
      clearTasks: () => set({ tasks: [] }),

      // Talents - 12 Actifs Stratégiques
      initializeTalents: () => set({
        talents: STRATEGIC_ASSETS.map((t) => ({
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

      // Computed - Vulnérabilité moyenne sur 5 dimensions
      getSelectedTalents: () => get().talents.filter(t => t.selected),
      
      getResilienceScore: () => {
        const tasks = get().tasks;
        if (tasks.length === 0) return 0;
        
        const totalScores = tasks.reduce((acc, task) => {
          // Moyenne des 5 curseurs de résilience
          const taskScore = (
            task.resilience.donnees +
            task.resilience.decision +
            task.resilience.relationnel +
            task.resilience.creativite +
            task.resilience.execution
          ) / 5;
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
        talents: STRATEGIC_ASSETS.map((t) => ({
          ...t,
          level: 3,
          selected: false,
        })),
        software: [],
      }),
    }),
    {
      name: 'apex-audit-storage-v3', // Version bump pour reset du localStorage
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
