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

// Phase 2 - Strategic Mutation Plan
export interface NicheOpportunity {
  id: string;
  name: string;
  description: string;
  matchScore: number; // 0-100
  requiredTalents: string[]; // IDs des talents requis
  growthPotential: 'high' | 'medium' | 'low';
}

export interface RoadmapAction {
  id: string;
  pillar: 'delegation' | 'reinforcement' | 'positioning';
  title: string;
  description: string;
  priority: 'immediate' | 'short_term' | 'medium_term';
  completed: boolean;
}

export interface StrategyData {
  // Matrice Ikigai 2.0
  capitalActif: number; // Score agrégé des 5 talents (0-100)
  zoneRisque: number; // Score de vulnérabilité (0-100)
  opportunitesNiche: NicheOpportunity[];
  levierEconomique: number; // Potentiel économique (0-100)
  
  // Roadmap
  roadmap: RoadmapAction[];
  
  // Métadonnées
  generatedAt: number | null;
  parcours: 'augmentation' | 'pivot' | null;
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
  
  // Phase 2 - Strategy
  strategy: StrategyData;
  
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
  
  // Actions - Strategy (Phase 2)
  generateStrategy: () => void;
  toggleRoadmapAction: (id: string) => void;
  
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

// Générateur d'opportunités de niche selon profil
function generateNicheOpportunities(
  talents: Talent[], 
  goal: Goal, 
  persona: Persona
): NicheOpportunity[] {
  const talentIds = talents.map(t => t.id);
  
  // Base d'opportunités (sera enrichie par IA plus tard)
  const allOpportunities: NicheOpportunity[] = [
    {
      id: 'consultant-ia',
      name: 'Consultant en Transformation IA',
      description: 'Accompagner les entreprises dans l\'intégration de l\'automatisation intelligente.',
      matchScore: 0,
      requiredTalents: ['pilotage-ia', 'pensee-systemique', 'communication-influence'],
      growthPotential: 'high',
    },
    {
      id: 'manager-transition',
      name: 'Manager de Transition',
      description: 'Piloter des équipes lors de phases de mutation organisationnelle.',
      matchScore: 0,
      requiredTalents: ['leadership-transition', 'diagnostic-crise', 'tactique-relationnelle'],
      growthPotential: 'high',
    },
    {
      id: 'expert-negociation',
      name: 'Expert en Négociation Complexe',
      description: 'Intervenir sur des deals à enjeux élevés nécessitant une expertise humaine.',
      matchScore: 0,
      requiredTalents: ['intelligence-negociation', 'arbitrage-incertitude', 'communication-influence'],
      growthPotential: 'medium',
    },
    {
      id: 'strategiste-innovation',
      name: 'Stratégiste Innovation',
      description: 'Concevoir des solutions disruptives au-delà des capacités génératives de l\'IA.',
      matchScore: 0,
      requiredTalents: ['innovation-rupture', 'synthese-strategique', 'pensee-systemique'],
      growthPotential: 'high',
    },
    {
      id: 'responsable-ethique',
      name: 'Responsable Éthique & Conformité IA',
      description: 'Garantir la gouvernance et la responsabilité des systèmes automatisés.',
      matchScore: 0,
      requiredTalents: ['ethique-gouvernance', 'analyse-critique', 'communication-influence'],
      growthPotential: 'high',
    },
    {
      id: 'coach-resilience',
      name: 'Coach en Résilience Professionnelle',
      description: 'Accompagner les individus dans leur mutation face à l\'automatisation.',
      matchScore: 0,
      requiredTalents: ['leadership-transition', 'tactique-relationnelle', 'diagnostic-crise'],
      growthPotential: 'medium',
    },
  ];
  
  // Calcul des scores de correspondance
  return allOpportunities
    .map(opp => {
      const matchCount = opp.requiredTalents.filter(t => talentIds.includes(t)).length;
      const matchScore = Math.round((matchCount / opp.requiredTalents.length) * 100);
      return { ...opp, matchScore };
    })
    .filter(opp => opp.matchScore >= 33) // Au moins 1/3 de correspondance
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4); // Top 4
}

// Générateur de roadmap selon profil
function generateRoadmap(
  tasks: Task[],
  talents: Talent[],
  software: Software[],
  goal: Goal
): RoadmapAction[] {
  const roadmap: RoadmapAction[] = [];
  
  // Pilier 1: Délégation Technologique
  // Trouver les tâches à faible résilience (< 40)
  const lowResilienceTasks = tasks.filter(t => {
    const avg = (t.resilience.donnees + t.resilience.decision + t.resilience.creativite) / 3;
    return avg < 40;
  });
  
  if (lowResilienceTasks.length > 0) {
    roadmap.push({
      id: generateId(),
      pillar: 'delegation',
      title: 'Automatiser les processus à faible valeur',
      description: `Identifier des outils d'automatisation intelligente pour ${lowResilienceTasks.length} tâche(s) à faible intensité humaine.`,
      priority: 'immediate',
      completed: false,
    });
  }
  
  roadmap.push({
    id: generateId(),
    pillar: 'delegation',
    title: 'Maîtriser un outil d\'IA générative',
    description: 'Atteindre le niveau "Expert" sur au moins un assistant IA (ChatGPT, Claude, Copilot).',
    priority: 'short_term',
    completed: false,
  });
  
  // Pilier 2: Renforcement de Signature
  const weakTalents = talents.filter(t => t.selected && t.level <= 2);
  if (weakTalents.length > 0) {
    roadmap.push({
      id: generateId(),
      pillar: 'reinforcement',
      title: 'Plan de montée en compétence critique',
      description: `Renforcer ${weakTalents.map(t => t.name).join(', ')} via formation ou mentorat.`,
      priority: 'short_term',
      completed: false,
    });
  }
  
  roadmap.push({
    id: generateId(),
    pillar: 'reinforcement',
    title: 'Documenter vos réussites à haute valeur humaine',
    description: 'Constituer un portfolio de cas démontrant votre impact non-automatisable.',
    priority: 'medium_term',
    completed: false,
  });
  
  // Pilier 3: Positionnement Marché
  if (goal === 'augmentation') {
    roadmap.push({
      id: generateId(),
      pillar: 'positioning',
      title: 'Devenir le référent IA de votre périmètre',
      description: 'Proposer un pilote d\'automatisation à votre management pour démontrer votre valeur augmentée.',
      priority: 'short_term',
      completed: false,
    });
  } else {
    roadmap.push({
      id: generateId(),
      pillar: 'positioning',
      title: 'Explorer les métiers refuges identifiés',
      description: 'Réaliser des entretiens exploratoires avec des professionnels des niches à fort potentiel.',
      priority: 'immediate',
      completed: false,
    });
  }
  
  roadmap.push({
    id: generateId(),
    pillar: 'positioning',
    title: 'Affiner votre argumentaire de valeur',
    description: 'Construire un pitch percutant expliquant votre différenciation face aux systèmes automatisés.',
    priority: 'medium_term',
    completed: false,
  });
  
  return roadmap;
}

const initialContext: AuditContext = {
  persona: null,
  goal: null,
  jobTitle: '',
  industry: '',
  jobDescription: '',
};

const initialStrategy: StrategyData = {
  capitalActif: 0,
  zoneRisque: 0,
  opportunitesNiche: [],
  levierEconomique: 0,
  roadmap: [],
  generatedAt: null,
  parcours: null,
};

export const useAuditStore = create<AuditStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      context: initialContext,
      tasks: [],
      talents: [],
      software: [],
      strategy: initialStrategy,

      // Navigation (8 étapes: 1-6 Audit + 7-8 Stratégie)
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 8) })),
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

      // Strategy (Phase 2)
      generateStrategy: () => {
        const state = get();
        const { goal, persona } = state.context;
        const resilienceScore = state.getResilienceScore();
        const talentScore = state.getTalentScore();
        const selectedTalents = state.getSelectedTalents();
        
        // Calcul Capital Actif (basé sur talents + maîtrise tech)
        const techBonus = state.software.reduce((acc, s) => {
          const levelScore = s.level === 'expert' ? 20 : s.level === 'avance' ? 12 : 5;
          return acc + levelScore;
        }, 0);
        const capitalActif = Math.min(100, talentScore + Math.round(techBonus / 3));
        
        // Zone de Risque (inverse du score de résilience)
        const zoneRisque = 100 - resilienceScore;
        
        // Levier Économique (combinaison capital actif + adéquation marché)
        const levierEconomique = Math.round((capitalActif * 0.6) + (resilienceScore * 0.4));
        
        // Opportunités de Niche (générées selon talents sélectionnés)
        const opportunitesNiche = generateNicheOpportunities(selectedTalents, goal, persona);
        
        // Roadmap d'actions
        const roadmap = generateRoadmap(state.tasks, selectedTalents, state.software, goal);
        
        set({
          strategy: {
            capitalActif,
            zoneRisque,
            opportunitesNiche,
            levierEconomique,
            roadmap,
            generatedAt: Date.now(),
            parcours: goal,
          }
        });
      },
      
      toggleRoadmapAction: (id) => set((state) => ({
        strategy: {
          ...state.strategy,
          roadmap: state.strategy.roadmap.map(action =>
            action.id === id ? { ...action, completed: !action.completed } : action
          )
        }
      })),

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
        strategy: initialStrategy,
      }),
    }),
    {
      name: 'apex-audit-storage-v4', // Version bump pour Phase 2
      partialize: (state) => ({
        currentStep: state.currentStep,
        context: state.context,
        tasks: state.tasks,
        talents: state.talents,
        software: state.software,
        strategy: state.strategy,
      }),
    }
  )
);
