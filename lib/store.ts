import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type Persona = 'salarie' | 'freelance' | 'leader' | null;
export type Goal = 'augmentation' | 'pivot' | 'reclassement' | null;
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
  hoursPerWeek: number;
  resilience: ResilienceScores;
  createdAt: number;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  example: string;
  icon: string;
  level: number; // 1-5
  selected: boolean;
}

export interface Software {
  id: string;
  name: string;
  level: SkillLevel;
}

// Moteurs de Mutation (pour parcours Pivot)
export type MutationDriver = 
  | 'exit_physical'           // Quitter l'exécution physique
  | 'gain_autonomy'           // Gagner en autonomie décisionnelle
  | 'human_impact'            // Basculer vers un secteur à fort impact humain
  | 'creative_freedom'        // Libérer sa créativité
  | 'strategic_influence'     // Accéder à l'influence stratégique
  | 'work_life_balance'       // Équilibre vie pro/perso
  | 'financial_security'      // Sécurité financière long terme
  | 'meaning_purpose';        // Quête de sens

export const MUTATION_DRIVERS: { id: MutationDriver; label: { fr: string; en: string }; description: { fr: string; en: string }; icon: string }[] = [
  { id: 'exit_physical', label: { fr: 'Quitter l\'exécution physique', en: 'Exit physical execution' }, description: { fr: 'Évoluer vers des rôles de supervision et pilotage', en: 'Evolve toward supervision and piloting roles' }, icon: '🚀' },
  { id: 'gain_autonomy', label: { fr: 'Gagner en autonomie décisionnelle', en: 'Gain decision autonomy' }, description: { fr: 'Devenir le référent qui tranche et arbitre', en: 'Become the go-to decision maker' }, icon: '🎯' },
  { id: 'human_impact', label: { fr: 'Basculer vers l\'impact humain', en: 'Switch to human impact' }, description: { fr: 'Secteurs où le relationnel est critique', en: 'Sectors where relationships are critical' }, icon: '🤝' },
  { id: 'creative_freedom', label: { fr: 'Libérer sa créativité', en: 'Unleash creativity' }, description: { fr: 'Rôles où l\'innovation est valorisée', en: 'Roles where innovation is valued' }, icon: '💡' },
  { id: 'strategic_influence', label: { fr: 'Accéder à l\'influence stratégique', en: 'Access strategic influence' }, description: { fr: 'Participer aux décisions de haut niveau', en: 'Participate in high-level decisions' }, icon: '👑' },
  { id: 'work_life_balance', label: { fr: 'Équilibre vie pro/perso', en: 'Work-life balance' }, description: { fr: 'Flexibilité et maîtrise de son temps', en: 'Flexibility and time control' }, icon: '⚖️' },
  { id: 'financial_security', label: { fr: 'Sécurité financière', en: 'Financial security' }, description: { fr: 'Secteurs à forte rémunération long terme', en: 'High long-term compensation sectors' }, icon: '💰' },
  { id: 'meaning_purpose', label: { fr: 'Quête de sens', en: 'Search for meaning' }, description: { fr: 'Contribution à un impact sociétal positif', en: 'Contribution to positive societal impact' }, icon: '🌍' },
];

// Zones géographiques pour contextualisation LLM
export type GeoZone = 
  // Europe
  | 'france'
  | 'belgium'
  | 'switzerland'
  | 'germany'
  | 'uk'
  | 'spain'
  | 'italy'
  | 'netherlands'
  | 'other_eu'
  // Europe de l'Est / CEI
  | 'russia'
  | 'eastern_europe'
  // Amérique du Nord
  | 'usa'
  | 'canada_fr'
  // Amérique Latine
  | 'brazil'
  | 'latam'
  // Afrique
  | 'morocco'
  | 'north_africa'
  | 'south_africa'
  | 'africa_other'
  // Moyen-Orient
  | 'uae'
  | 'middle_east'
  // Asie
  | 'japan'
  | 'china'
  | 'india'
  | 'singapore'
  | 'asia_other'
  // Océanie
  | 'australia'
  | 'oceania';

export const GEO_ZONES: { id: GeoZone; label: { fr: string; en: string }; flag: string }[] = [
  // Europe francophone
  { id: 'france', label: { fr: 'France', en: 'France' }, flag: '🇫🇷' },
  { id: 'belgium', label: { fr: 'Belgique', en: 'Belgium' }, flag: '🇧🇪' },
  { id: 'switzerland', label: { fr: 'Suisse', en: 'Switzerland' }, flag: '🇨🇭' },
  // Europe autres
  { id: 'germany', label: { fr: 'Allemagne', en: 'Germany' }, flag: '🇩🇪' },
  { id: 'uk', label: { fr: 'Royaume-Uni', en: 'United Kingdom' }, flag: '🇬🇧' },
  { id: 'spain', label: { fr: 'Espagne', en: 'Spain' }, flag: '🇪🇸' },
  { id: 'italy', label: { fr: 'Italie', en: 'Italy' }, flag: '🇮🇹' },
  { id: 'netherlands', label: { fr: 'Pays-Bas', en: 'Netherlands' }, flag: '🇳🇱' },
  { id: 'other_eu', label: { fr: 'Autre pays UE', en: 'Other EU country' }, flag: '🇪🇺' },
  // Europe de l'Est / CEI
  { id: 'russia', label: { fr: 'Russie', en: 'Russia' }, flag: '🇷🇺' },
  { id: 'eastern_europe', label: { fr: 'Europe de l\'Est (autre)', en: 'Eastern Europe (other)' }, flag: '🌍' },
  // Amérique du Nord
  { id: 'usa', label: { fr: 'États-Unis', en: 'United States' }, flag: '🇺🇸' },
  { id: 'canada_fr', label: { fr: 'Canada', en: 'Canada' }, flag: '🇨🇦' },
  // Amérique Latine
  { id: 'brazil', label: { fr: 'Brésil', en: 'Brazil' }, flag: '🇧🇷' },
  { id: 'latam', label: { fr: 'Amérique Latine (autre)', en: 'Latin America (other)' }, flag: '🌎' },
  // Afrique
  { id: 'morocco', label: { fr: 'Maroc', en: 'Morocco' }, flag: '🇲🇦' },
  { id: 'north_africa', label: { fr: 'Afrique du Nord (Algérie, Tunisie, Égypte...)', en: 'North Africa' }, flag: '🌍' },
  { id: 'south_africa', label: { fr: 'Afrique du Sud', en: 'South Africa' }, flag: '🇿🇦' },
  { id: 'africa_other', label: { fr: 'Afrique (autre)', en: 'Africa (other)' }, flag: '🌍' },
  // Moyen-Orient
  { id: 'uae', label: { fr: 'Émirats Arabes Unis', en: 'United Arab Emirates' }, flag: '🇦🇪' },
  { id: 'middle_east', label: { fr: 'Moyen-Orient (autre)', en: 'Middle East (other)' }, flag: '🏜️' },
  // Asie
  { id: 'japan', label: { fr: 'Japon', en: 'Japan' }, flag: '🇯🇵' },
  { id: 'china', label: { fr: 'Chine', en: 'China' }, flag: '🇨🇳' },
  { id: 'india', label: { fr: 'Inde', en: 'India' }, flag: '🇮🇳' },
  { id: 'singapore', label: { fr: 'Singapour', en: 'Singapore' }, flag: '🇸🇬' },
  { id: 'asia_other', label: { fr: 'Asie (autre)', en: 'Asia (other)' }, flag: '🌏' },
  // Océanie
  { id: 'australia', label: { fr: 'Australie', en: 'Australia' }, flag: '🇦🇺' },
  { id: 'oceania', label: { fr: 'Océanie (autre)', en: 'Oceania (other)' }, flag: '🌊' },
];

export interface AuditContext {
  persona: Persona;
  goal: Goal;
  jobTitle: string;
  industry: string;
  jobDescription: string;
  country?: GeoZone;                // Pays/zone géographique pour contextualisation LLM
  // Champs enrichis pour un diagnostic plus précis
  yearsExperience?: number;        // Années d'expérience dans le poste
  teamSize?: number;               // Taille de l'équipe supervisée (0 si contributeur individuel)
  // Moteurs de Mutation (pour parcours Pivot uniquement)
  mutationDrivers?: MutationDriver[];  // 2 moteurs sélectionnés max
}

// ===============================================
// PORTRAIT DE MUTATION (Parcours Pivot uniquement)
// ===============================================
// Module de saisie pour capturer l'identité humaine et les aspirations

export interface UserIntention {
  // SECTION 1 : Passions Concrètes (Texte Libre)
  // "Qu'est-ce qui vous fait vibrer dans le concret ?"
  passionsConcretes: string;
  
  // SECTION 2 : Le Carré d'As (4 Talents Naturels)
  // "4 choses pour lesquelles vous êtes naturellement doué(e)"
  carreDAs: {
    talent1: string;
    talent2: string;
    talent3: string;
    talent4: string;
  };
  
  // SECTION 3 : La Zone de Rejet (Les 'Nuls')
  // "Ce pour quoi vous êtes nul(le) ou ce qui vous vide de votre énergie"
  zoneDeRejet: string[];
  
  // SECTION 4 : L'Horizon Cible (Vision)
  // "Dans quel secteur vous voyez-vous ? Quels seraient vos 2 métiers idéaux ?"
  horizonCible: {
    secteurCible: string;
    metierIdeal1: string;
    metierIdeal2: string;
  };
  
  // SECTION 5 : Le Manifeste Humain (Texte Libre)
  // "Définissez ici l'humain que vous voulez devenir"
  manifesteHumain: string;
  
  // Métadonnées
  completedAt: number | null;
  isComplete: boolean;
}

// KPIs Automatiques calculés
export interface ComputedKPIs {
  productivityGainPercent: number;      // Gain de productivité estimé (%)
  timeROI: number;                      // ROI du temps libéré (heures/an)
  riskReductionScore: number;           // Score de réduction du risque (0-100)
  marketPositioningScore: number;       // Score de positionnement marché (0-100)
  transitionReadinessScore: number;     // Score de préparation à la transition (0-100)
}

// ===============================================
// SCANNER DE CHARGE FANTÔME (Emails & Flux)
// ===============================================
// Module de quantification de la charge administrative invisible

export interface PhantomChargeData {
  // Inputs utilisateur simplifiés
  dailyVolume: number;        // Nombre d'emails traités par jour (reçus + envoyés)
  dailyHours: number;         // Heures passées sur les mails par jour
  dailyMinutes: number;       // Minutes passées sur les mails par jour
  
  // Anciens champs (conservés pour compatibilité)
  readingTimeAvg: number;     // Temps moyen de lecture par email (SECONDES) - DEPRECATED
  responseTimeAvg: number;    // Temps moyen de rédaction par email (SECONDES) - DEPRECATED
  
  // Sliders qualitatifs (somme = 100%)
  fluxAuto: number;           // % Flux Automatiques (95% réduction IA possible)
  fluxBasNiveau: number;      // % Flux Bas Niveau (70% réduction IA possible)
  fluxStrategique: number;    // % Flux Stratégiques (30% réduction IA possible)
  
  // État
  isEnabled: boolean;         // Pour le toggle en mode Leader pivot/reclassement
}

// Coefficients de réduction IA (export pour utilisation externe)
export const AI_REDUCTION_COEFFICIENTS = {
  auto: 0.95,
  basNiveau: 0.70,
  strategique: 0.30,
};

// ===============================================
// MODE RECLASSEMENT / PSE (Leader RH uniquement)
// ===============================================
// Cellule de reclassement stratégique - Audit de transition collective

export interface CohortMember {
  id: string;
  name: string;
  email: string;
  department: string;
  currentRole: string;
  invitedAt: number | null;
  completedPortraitAt: number | null;
  employabilityIndex: number | null;  // Indice de réemployabilité (0-100)
  status: 'pending' | 'invited' | 'in_progress' | 'completed';
  notes?: string;  // Notes libres du RH
  mode?: 'augmentation' | 'pivot';  // Mode de la cohorte
}

export interface CohortData {
  // Configuration de la cohorte
  cohortName: string;                    // Ex: "PSE Q1 2024 - Site Lyon"
  targetCompletionDate: number | null;   // Date cible de fin
  totalMembers: number;                  // Nombre total de collaborateurs
  
  // Membres de la cohorte
  members: CohortMember[];
  
  // Statistiques agrégées
  stats: {
    invitedCount: number;
    inProgressCount: number;
    completedCount: number;
    averageEmployabilityIndex: number;   // Indice moyen de réemployabilité
    highRiskCount: number;               // Collaborateurs à risque élevé
    readyForTransitionCount: number;     // Prêts pour transition immédiate
  };
  
  // Métadonnées
  createdAt: number | null;
  lastUpdatedAt: number | null;
}

// ===============================================
// MODE JOB DESIGNER - ARCHITECTURE DES POSTES
// ===============================================
// Module pour concevoir les "Postes de Demain" et calculer le matching

export type CompetenceCategory = 'haptique' | 'relationnelle' | 'technique';

export interface TargetCompetence {
  id: string;
  name: string;
  category: CompetenceCategory;
  requiredLevel: number;  // 1-5 niveau requis
  description: string;
  criticalityScore: number;  // 0-100 importance pour le poste
}

export interface FutureJob {
  id: string;
  title: string;                      // Ex: "Superviseur IA de Production"
  department: string;                  // Ex: "Production", "Logistique"
  description: string;
  headcount: number;                   // Nombre de postes à pourvoir
  urgency: 'immediate' | 'short_term' | 'medium_term';  // Horizon temporel
  automationResistance: number;        // 0-100 résistance à l'automatisation
  requiredCompetences: TargetCompetence[];
  createdAt: number;
}

export interface EmployeeMatch {
  employeeId: string;                  // ID du salarié (ou membre cohorte)
  employeeName: string;
  futureJobId: string;
  futureJobTitle: string;
  compatibilityScore: number;          // 0-100 score d'affinité
  competenceGaps: {
    competenceId: string;
    competenceName: string;
    category: CompetenceCategory;
    currentLevel: number;              // Niveau actuel estimé
    requiredLevel: number;             // Niveau requis
    gap: number;                       // Écart (negative = besoin formation)
    trainingHours: number;             // Heures de formation estimées
  }[];
  strengths: string[];                 // Points forts identifiés
  recommendation: 'ideal' | 'good' | 'possible' | 'difficult';
}

export interface EnterpriseTargets {
  // Configuration
  organizationName: string;
  strategicHorizon: '6_months' | '1_year' | '3_years';
  
  // Métiers de Demain
  futureJobs: FutureJob[];
  
  // Résultats de matching (calculés)
  employeeMatches: EmployeeMatch[];
  
  // Métadonnées
  createdAt: number | null;
  lastUpdatedAt: number | null;
  isConfigured: boolean;
}

// ===============================================
// PHASE 2 - MOTEUR DE STRATÉGIE INTÉGRÉ
// ===============================================

// Framework ERAC (Blue Ocean Strategy)
export interface ERACAction {
  id: string;
  category: 'eliminate' | 'reduce' | 'raise' | 'create';
  taskId?: string;
  taskName?: string;
  action: string;
  rationale: string;
  impact: 'high' | 'medium' | 'low';
  timeFreed?: number; // heures libérées par semaine
  sourceNote?: string; // Note technique de traçabilité
  vulnerabilityScore?: number; // % de vulnérabilité de la tâche source
}

// Value Curve pour visualisation Blue Ocean
export interface ValueCurvePoint {
  factor: string;
  current: number;    // Position actuelle (0-100)
  target: number;     // Position cible après transformation (0-100)
  industry: number;   // Moyenne industrie (benchmark)
}

// Business Model You - Proposition de Valeur
export interface BusinessModelYou {
  // Proposition de Valeur Augmentée
  coreValue: string;           // Ce que vous apportez d'unique
  targetAudience: string;      // À qui (interne/externe)
  uniqueDifferentiator: string; // Ce que l'IA ne peut pas faire
  deliveryMethod: string;      // Comment vous délivrez
  
  // Ressources Clés (talents mappés)
  keyResources: string[];      // IDs des talents
  keyActivities: string[];     // Activités à haute valeur
  
  // Canaux et Relations
  channels: string[];
  relationships: string[];
}

// Gap Analysis (Le Pont de Compétences) pour Pivot
export interface GapAnalysis {
  currentState: {
    role: string;
    strengths: string[];
    vulnerabilities: string[];
    marketPosition: number; // 0-100
  };
  targetState: {
    role: string;
    requiredSkills: string[];
    marketDemand: number; // 0-100
    growthPotential: 'high' | 'medium' | 'low';
  };
  // "Le Pont de Compétences" - Tableau comparatif
  bridge: {
    // À GARDER : Talents déjà maîtrisés et transférables
    toKeep: { skill: string; currentLevel: number; transferability: 'high' | 'medium' | 'low'; rationale: string }[];
    // À ACQUÉRIR : Compétences techniques spécifiques au nouveau secteur
    toAcquire: { skill: string; priority: 'critical' | 'important' | 'nice_to_have'; timeToAcquire: string; method: string }[];
    // À ABANDONNER : Réflexes liés au poste exposé
    toAbandon: { habit: string; reason: string; replacement: string }[];
    // Ancienne structure maintenue pour compatibilité
    skillsToAcquire: string[];
    skillsToTransfer: string[];
    estimatedTimeline: string;
    riskLevel: 'low' | 'medium' | 'high';
    investmentRequired: 'low' | 'medium' | 'high';
  };
  viabilityScore: number; // 0-100
  // Métriques de transition
  transitionMetrics: {
    financialRunway: string;        // Durée de sécurité financière
    networkReadiness: number;       // 0-100 : Réseau dans le secteur cible
    mentalReadiness: number;        // 0-100 : Préparation mentale
  };
}

// Métier Refuge enrichi avec Core Transfer et Value Curve
export interface NicheOpportunity {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  requiredTalents: string[];
  growthPotential: 'high' | 'medium' | 'low';
  marketDemand: number; // 0-100
  automationResistance: number; // 0-100 (Indice de Protection)
  salaryRange?: string;
  // Core Transfer : Pourquoi ce talent est la clé
  coreTransfer: {
    keyTalent: string;          // Nom du talent pivot
    transferRationale: string;  // Explication du transfert
    competitiveEdge: string;    // Avantage concurrentiel
  };
  // Value Curve spécifique au métier refuge
  valueCurve: {
    factor: string;
    userPosition: number;       // Position de l'utilisateur (0-100)
    automationThreat: number;   // Niveau de menace automatisation (0-100)
  }[];
  // Métriques sectorielles
  sectorMetrics: {
    jobOpenings: number;        // Offres d'emploi (estimation)
    averageAge: number;         // Âge moyen dans le secteur
    growthRate: string;         // Taux de croissance annuel
    entryBarrier: 'low' | 'medium' | 'high';
  };
}

// Action Roadmap enrichie avec piliers Pivot + KPIs Résilience + Stack Technologique
export interface RoadmapAction {
  id: string;
  // Piliers Augmentation : delegation | reinforcement | positioning
  // Piliers Pivot : disengagement | oceanBleu | landing
  pillar: 'delegation' | 'reinforcement' | 'positioning' | 'disengagement' | 'oceanBleu' | 'landing';
  title: string;
  description: string;
  priority: 'immediate' | 'short_term' | 'medium_term';
  completed: boolean;
  eracCategory?: 'eliminate' | 'reduce' | 'raise' | 'create';
  kpi?: string;
  // Nouveaux champs pour synchronisation totale
  resilienceScore?: number; // Score 1-10 montrant la protection contre le remplacement
  suggestedTool?: string;   // Outil concret suggéré pour cette action
  sourceData?: string;      // Source des données (audit, portrait humain, etc.)
}

// Ikigai Stratégique (4 dimensions "No-Bullshit")
export interface IkigaiStrategique {
  engagementStrategique: number;  // Ce que vous aimez faire → "Engagement Stratégique"
  expertiseDistinctive: number;   // Ce que vous faites bien → "Expertise Distinctive"
  demandeCritique: number;        // Ce dont le monde a besoin → "Demande Critique du Marché"
  levierEconomique: number;       // Ce pour quoi on vous paie → "Levier Économique"
  
  // Zone d'alignement
  alignmentScore: number;         // Score global d'alignement Ikigai
  alignmentZone: 'optimal' | 'partial' | 'misaligned';
}

// Structure principale de la stratégie
export interface StrategyData {
  // Matrice Ikigai Stratégique 2.0
  ikigai: IkigaiStrategique;
  
  // Framework ERAC (Blue Ocean)
  eracActions: ERACAction[];
  valueCurve: ValueCurvePoint[];
  
  // Business Model You
  businessModel: BusinessModelYou;
  
  // Gap Analysis (pour Pivot)
  gapAnalysis: GapAnalysis | null;
  
  // Opportunités de Niche
  opportunitesNiche: NicheOpportunity[];
  
  // Roadmap
  roadmap: RoadmapAction[];
  
  // Métadonnées
  generatedAt: number | null;
  parcours: 'augmentation' | 'pivot' | 'reclassement' | null;
  
  // Scores agrégés
  capitalActif: number;
  zoneRisque: number;
}

interface AuditStore {
  currentStep: number;
  context: AuditContext;
  tasks: Task[];
  talents: Talent[];
  software: Software[];
  strategy: StrategyData;
  computedKPIs: ComputedKPIs;
  userIntention: UserIntention;  // Portrait de Mutation (Pivot uniquement)
  cohortData: CohortData;        // Données de cohorte (Reclassement/PSE uniquement)
  enterpriseTargets: EnterpriseTargets;  // Exigences stratégiques (Job Designer uniquement)
  phantomCharge: PhantomChargeData;  // Scanner de Charge Fantôme (Emails & Flux)
  
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
  setCountry: (country: GeoZone) => void;
  // Actions - Context (Champs enrichis)
  setYearsExperience: (years: number) => void;
  setTeamSize: (size: number) => void;
  // Actions - Mutation Drivers (Pivot uniquement)
  setMutationDrivers: (drivers: MutationDriver[]) => void;
  
  // Actions - Portrait de Mutation (Pivot uniquement)
  setPassionsConcretes: (passions: string) => void;
  setCarreDAs: (carreDAs: UserIntention['carreDAs']) => void;
  setZoneDeRejet: (zones: string[]) => void;
  setHorizonCible: (horizon: UserIntention['horizonCible']) => void;
  setManifesteHumain: (manifeste: string) => void;
  validateUserIntention: () => void;
  
  // Actions - Cohorte (Reclassement/PSE uniquement)
  setCohortName: (name: string) => void;
  setCohortTargetDate: (date: number) => void;
  addCohortMember: (member: Omit<CohortMember, 'id' | 'invitedAt' | 'completedPortraitAt' | 'employabilityIndex' | 'status'>) => void;
  updateCohortMember: (id: string, updates: Partial<CohortMember>) => void;
  removeCohortMember: (id: string) => void;
  inviteCohortMembers: (memberIds: string[]) => void;
  updateCohortStats: () => void;
  
  // Actions - Enterprise Targets (Job Designer uniquement)
  setOrganizationName: (name: string) => void;
  setStrategicHorizon: (horizon: EnterpriseTargets['strategicHorizon']) => void;
  addFutureJob: (job: Omit<FutureJob, 'id' | 'createdAt'>) => string;
  updateFutureJob: (id: string, updates: Partial<FutureJob>) => void;
  removeFutureJob: (id: string) => void;
  addCompetenceToJob: (jobId: string, competence: Omit<TargetCompetence, 'id'>) => void;
  removeCompetenceFromJob: (jobId: string, competenceId: string) => void;
  calculateEmployeeMatches: () => void;
  markEnterpriseTargetsConfigured: () => void;
  
  // Actions - Tasks
  addTask: (name: string) => string;
  addTasksFromAI: (tasks: Array<{
    name: string;
    hoursPerWeek: number;
    temporalite: Temporality;
    resilience: ResilienceScores;
  }>) => void;
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
  computeKPIs: () => void;
  
  // Actions - Phantom Charge (Scanner de Charge Fantôme)
  setPhantomCharge: (data: Partial<PhantomChargeData>) => void;
  updatePhantomChargeFlux: (auto: number, basNiveau: number, strategique: number) => void;
  togglePhantomChargeEnabled: () => void;
  getPhantomChargeGain: () => { weeklyHours: number; monthlyHours: number; isSignificant: boolean };
  
  // Reset
  reset: () => void;
}

// Les 12 Actifs Stratégiques
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
    name: 'Pilotage des Outils Automatisés', 
    description: 'Orchestrer et superviser les outils de production pour décupler l\'efficacité.',
    example: 'Ex: Utiliser ChatGPT pour rédiger plus vite, automatiser des tâches répétitives, créer des prompts efficaces.',
    icon: 'Bot'
  },
  { 
    id: 'ethique-gouvernance', 
    name: 'Responsabilité & Conformité', 
    description: 'Porter la responsabilité morale et légale des décisions automatisées.',
    example: 'Ex: Valider qu\'une sortie algorithmique est juste, s\'assurer du respect des règles RGPD, arbitrer un dilemme.',
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
    description: 'Repérer les erreurs, les incohérences et les biais des systèmes automatisés.',
    example: 'Ex: Vérifier qu\'un contenu généré automatiquement est correct, détecter une info fausse, challenger un rapport.',
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

export const AVAILABLE_TALENTS = STRATEGIC_ASSETS;

const generateId = () => Math.random().toString(36).substring(2, 9);

// ===============================================
// GÉNÉRATEURS DU MOTEUR DE STRATÉGIE
// ===============================================

// Génère les actions ERAC basées sur l'analyse des tâches
// Avec traçabilité technique : source + % vulnérabilité
// Intelligence de Câblage : utilise zoneDeRejet pour ÉLIMINER (Pivot)
function generateERACActions(tasks: Task[], goal: Goal, userIntention?: UserIntention): ERACAction[] {
  const actions: ERACAction[] = [];

  // ÉLIMINER basé sur Zone de Rejet (Portrait de Mutation - Pivot uniquement)
  if (goal === 'pivot' && userIntention?.zoneDeRejet && userIntention.zoneDeRejet.length > 0) {
    userIntention.zoneDeRejet.forEach(rejet => {
      actions.push({
        id: generateId(),
        category: 'eliminate',
        action: `Éliminer "${rejet}" de votre trajectoire`,
        rationale: 'Identifié comme source d\'épuisement ou incompatibilité profonde (Zone de Rejet).',
        impact: 'high',
        sourceNote: '[Source: Portrait de Mutation — Zone de Rejet]',
      });
    });
  }

  tasks.forEach(task => {
    const avgResilience = (
      task.resilience.donnees +
      task.resilience.decision +
      task.resilience.relationnel +
      task.resilience.creativite +
      task.resilience.execution
    ) / 5;
    
    // Calcul du % de vulnérabilité (inverse de la résilience)
    const vulnerabilityScore = Math.round(100 - avgResilience);
    // Note technique de traçabilité
    const sourceNote = `[Source: ${task.name} — ${vulnerabilityScore}% vulnérabilité]`;

    // ÉLIMINER : Tâches à très faible résilience (<30) et peu d'heures
    if (avgResilience < 30 && task.hoursPerWeek <= 5) {
      actions.push({
        id: generateId(),
        category: 'eliminate',
        taskId: task.id,
        taskName: task.name,
        action: `Supprimer "${task.name}" du périmètre`,
        rationale: 'Tâche entièrement automatisable, valeur humaine quasi-nulle.',
        impact: 'high',
        timeFreed: task.hoursPerWeek,
        sourceNote,
        vulnerabilityScore,
      });
    }
    // RÉDUIRE : Tâches à faible résilience (30-50) avec heures significatives
    else if (avgResilience < 50 && task.hoursPerWeek > 2) {
      actions.push({
        id: generateId(),
        category: 'reduce',
        taskId: task.id,
        taskName: task.name,
        action: `Automatiser partiellement "${task.name}"`,
        rationale: 'Déléguer l\'exécution aux outils, conserver la supervision humaine.',
        impact: avgResilience < 40 ? 'high' : 'medium',
        timeFreed: Math.round(task.hoursPerWeek * 0.6),
        sourceNote,
        vulnerabilityScore,
      });
    }
    // AUGMENTER : Tâches à haute résilience relationnelle/décisionnelle
    else if (task.resilience.relationnel > 70 || task.resilience.decision > 70) {
      // Pour les tâches à augmenter, on affiche la résilience (pas vulnérabilité)
      const resilienceNote = `[Source: ${task.name} — ${Math.round(avgResilience)}% résilience]`;
      actions.push({
        id: generateId(),
        category: 'raise',
        taskId: task.id,
        taskName: task.name,
        action: `Intensifier "${task.name}"`,
        rationale: 'Haute valeur humaine, différenciateur clé face à l\'automatisation.',
        impact: 'high',
        sourceNote: resilienceNote,
        vulnerabilityScore: vulnerabilityScore,
      });
    }
  });

  // CRÉER : Nouvelles activités selon le goal (pas de source car création)
  if (goal === 'augmentation') {
    actions.push({
      id: generateId(),
      category: 'create',
      action: 'Devenir Superviseur des Systèmes Automatisés',
      rationale: 'Nouvelle fonction : orchestrer, arbitrer et valider les sorties des outils automatisés.',
      impact: 'high',
      sourceNote: '[Création stratégique basée sur l\'objectif Augmentation]',
    });
    actions.push({
      id: generateId(),
      category: 'create',
      action: 'Mettre en place un Audit Critique des Sorties Algorithmiques',
      rationale: 'Vérifier, corriger et valider les productions automatisées avant diffusion.',
      impact: 'medium',
      sourceNote: '[Création stratégique basée sur l\'objectif Augmentation]',
    });
  } else {
    actions.push({
      id: generateId(),
      category: 'create',
      action: 'Packager votre expertise en offre de service',
      rationale: 'Transformer vos compétences métier en prestation facturable.',
      impact: 'high',
      sourceNote: '[Création stratégique basée sur l\'objectif Pivot]',
    });
  }

  return actions;
}

// Génère la Value Curve pour visualisation Blue Ocean
function generateValueCurve(tasks: Task[], talents: Talent[], goal: Goal): ValueCurvePoint[] {
  const selectedTalents = talents.filter(t => t.selected);
  const avgResilience = tasks.length > 0
    ? tasks.reduce((acc, t) => acc + (t.resilience.donnees + t.resilience.decision + t.resilience.relationnel + t.resilience.creativite + t.resilience.execution) / 5, 0) / tasks.length
    : 50;

  const curve: ValueCurvePoint[] = [
    {
      factor: 'Exécution Routinière',
      current: 100 - avgResilience,
      target: goal === 'augmentation' ? 20 : 10,
      industry: 75,
    },
    {
      factor: 'Arbitrage Décisionnel',
      current: selectedTalents.some(t => t.id === 'pilotage-ia' || t.id === 'arbitrage-incertitude') ? 70 : 30,
      target: goal === 'augmentation' ? 90 : 60,
      industry: 35,
    },
    {
      factor: 'Décision Complexe',
      current: tasks.length > 0 ? Math.round(tasks.reduce((a, t) => a + t.resilience.decision, 0) / tasks.length) : 0,
      target: 85,
      industry: 55,
    },
    {
      factor: 'Relations Clés',
      current: tasks.length > 0 ? Math.round(tasks.reduce((a, t) => a + t.resilience.relationnel, 0) / tasks.length) : 0,
      target: 90,
      industry: 60,
    },
    {
      factor: 'Création de Valeur',
      current: tasks.length > 0 ? Math.round(tasks.reduce((a, t) => a + t.resilience.creativite, 0) / tasks.length) : 0,
      target: goal === 'pivot' ? 95 : 75,
      industry: 45,
    },
    {
      factor: 'Responsabilité Opérationnelle',
      current: selectedTalents.some(t => t.id === 'ethique-gouvernance' || t.id === 'analyse-critique') ? 75 : 25,
      target: 80,
      industry: 30,
    },
  ];

  return curve;
}

// Génère le Business Model You - Diagnostic de Positionnement
function generateBusinessModel(
  talents: Talent[],
  tasks: Task[],
  context: AuditContext,
  goal: Goal
): BusinessModelYou {
  const selectedTalents = talents.filter(t => t.selected);
  
  // Tâches à haute résilience (score moyen > 60)
  const highValueTasks = tasks.filter(t => {
    const avg = (t.resilience.relationnel + t.resilience.decision + t.resilience.creativite) / 3;
    return avg > 60;
  }).sort((a, b) => {
    const avgA = (a.resilience.relationnel + a.resilience.decision + a.resilience.creativite) / 3;
    const avgB = (b.resilience.relationnel + b.resilience.decision + b.resilience.creativite) / 3;
    return avgB - avgA;
  });

  // Top 2 talents (par niveau de maîtrise)
  const topTalents = [...selectedTalents].sort((a, b) => b.level - a.level).slice(0, 2);

  // === VALEUR UNIQUE : Croisement top talents + tâches haute résilience ===
  let coreValue = '';
  if (topTalents.length >= 2 && highValueTasks.length >= 1) {
    coreValue = `${topTalents[0].name} × ${topTalents[1].name} appliqués à "${highValueTasks[0].name}"`;
  } else if (topTalents.length >= 1) {
    coreValue = `Expertise en ${topTalents[0].name}`;
  } else {
    coreValue = 'Profil polyvalent en repositionnement';
  }

  // === AUDIENCE CIBLE : Selon persona et goal ===
  const audienceMap: Record<string, Record<string, string>> = {
    augmentation: {
      salarie: 'Direction opérationnelle, N+1, équipes projet internes',
      freelance: 'Clients existants cherchant à optimiser leurs processus',
      leader: 'COMEX, Directeurs de BU, Responsables Transformation',
    },
    pivot: {
      salarie: 'Recruteurs sectoriels, Managers des métiers refuges identifiés',
      freelance: 'Nouvelles cibles dans les niches de résilience',
      leader: 'Boards, Cabinets de conseil en transformation',
    },
  };
  const targetAudience = goal && context.persona 
    ? audienceMap[goal][context.persona] 
    : 'Décideurs en quête de valeur humaine irremplaçable';

  // === DIFFÉRENCIATEUR : Pourquoi un système automatisé ne peut pas remplacer ===
  const differentiatorMap: Record<string, string> = {
    'arbitrage-incertitude': 'Capacité à trancher quand les données sont contradictoires ou absentes',
    'synthese-strategique': 'Production de sens et de cap là où les algorithmes restent descriptifs',
    'intelligence-negociation': 'Lecture des non-dits et adaptation tactique en temps réel',
    'pensee-systemique': 'Anticipation des effets de bord qu\'aucun modèle ne peut prévoir',
    'diagnostic-crise': 'Improvisation et créativité sous pression en situation inédite',
    'tactique-relationnelle': 'Construction de confiance et d\'alliances impossibles à automatiser',
    'innovation-rupture': 'Création de concepts absents des données d\'entraînement',
    'pilotage-ia': 'Supervision critique et correction des sorties automatisées',
    'ethique-gouvernance': 'Responsabilité morale et arbitrage éthique en zone grise',
    'leadership-transition': 'Mobilisation humaine et gestion émotionnelle du changement',
    'analyse-critique': 'Détection des biais et erreurs que les systèmes perpétuent',
    'communication-influence': 'Persuasion et alignement de parties prenantes divergentes',
  };
  const topTalentId = topTalents[0]?.id || '';
  const uniqueDifferentiator = differentiatorMap[topTalentId] 
    || 'Jugement humain irremplaçable en situation complexe';

  // === MODE DE LIVRAISON : Posture selon goal ===
  const deliveryMap: Record<string, string> = {
    augmentation: 'Posture de Superviseur : Arbitrage décisionnel, Audit critique des productions, Validation finale',
    pivot: 'Posture d\'Expert : Diagnostic, Conseil opérationnel, Accompagnement de transition',
  };
  const deliveryMethod = goal ? deliveryMap[goal] : 'Production supervisée avec valeur ajoutée humaine';

  return {
    coreValue,
    targetAudience,
    uniqueDifferentiator,
    deliveryMethod,
    keyResources: selectedTalents.map(t => t.id),
    keyActivities: highValueTasks.slice(0, 5).map(t => t.name),
    channels: goal === 'augmentation'
      ? ['Référent interne automatisation', 'Formation équipes', 'Projets pilotes']
      : ['Réseau professionnel ciblé', 'Approche directe recruteurs', 'Événements sectoriels'],
    relationships: ['Partenariats opérationnels', 'Mentorat croisé', 'Communautés métier'],
  };
}

// Génère le Gap Analysis (Le Pont de Compétences) pour le Pivot
function generateGapAnalysis(
  tasks: Task[],
  talents: Talent[],
  context: AuditContext,
  topNiche: NicheOpportunity | null
): GapAnalysis | null {
  if (!topNiche) return null;

  const selectedTalents = talents.filter(t => t.selected);
  const avgResilience = tasks.length > 0
    ? tasks.reduce((acc, t) => acc + (t.resilience.donnees + t.resilience.decision + t.resilience.relationnel + t.resilience.creativite + t.resilience.execution) / 5, 0) / tasks.length
    : 50;

  const vulnerableTasks = tasks.filter(t => {
    const avg = (t.resilience.donnees + t.resilience.execution) / 2;
    return avg < 40;
  });

  // À GARDER : Talents transférables
  const toKeep = selectedTalents
    .filter(t => topNiche.requiredTalents.includes(t.id))
    .map(t => ({
      skill: t.name,
      currentLevel: t.level,
      transferability: t.level >= 4 ? 'high' as const : t.level >= 3 ? 'medium' as const : 'low' as const,
      rationale: `Compétence clé pour ${topNiche.name}. Niveau actuel : ${t.level}/5.`,
    }));

  // À ACQUÉRIR : Compétences manquantes
  const toAcquire = topNiche.requiredTalents
    .filter(id => !selectedTalents.some(t => t.id === id))
    .map(id => {
      const talent = STRATEGIC_ASSETS.find(t => t.id === id);
      return {
        skill: talent?.name || id,
        priority: 'critical' as const,
        timeToAcquire: '3-6 mois',
        method: 'Formation + Mentorat + Projets pratiques',
      };
    });

  // À ABANDONNER : Habitudes du poste exposé
  const toAbandon = vulnerableTasks.slice(0, 3).map(t => ({
    habit: t.name,
    reason: 'Tâche automatisable à forte vulnérabilité',
    replacement: 'Focus sur la supervision et le pilotage stratégique',
  }));

  // Legacy fields for compatibility
  const skillsToTransfer = toKeep.map(k => k.skill);
  const skillsToAcquire = toAcquire.map(a => a.skill);

  const gapSize = skillsToAcquire.length;
  const matchRate = topNiche.matchScore;

  // Métriques de transition
  const yearsExp = context.yearsExperience || 5;
  const networkScore = yearsExp >= 10 ? 75 : yearsExp >= 5 ? 55 : 35;
  const mentalScore = selectedTalents.length >= 4 ? 70 : selectedTalents.length >= 2 ? 50 : 30;

  return {
    currentState: {
      role: context.jobTitle || 'Position actuelle',
      strengths: selectedTalents.slice(0, 3).map(t => t.name),
      vulnerabilities: vulnerableTasks.slice(0, 3).map(t => t.name),
      marketPosition: Math.round(avgResilience),
    },
    targetState: {
      role: topNiche.name,
      requiredSkills: topNiche.requiredTalents.map(id => {
        const t = STRATEGIC_ASSETS.find(a => a.id === id);
        return t?.name || id;
      }),
      marketDemand: topNiche.marketDemand,
      growthPotential: topNiche.growthPotential,
    },
    bridge: {
      toKeep,
      toAcquire,
      toAbandon,
      skillsToAcquire,
      skillsToTransfer,
      estimatedTimeline: gapSize <= 1 ? '3-6 mois' : gapSize <= 2 ? '6-12 mois' : '12-18 mois',
      riskLevel: matchRate >= 66 ? 'low' : matchRate >= 33 ? 'medium' : 'high',
      investmentRequired: gapSize === 0 ? 'low' : gapSize <= 1 ? 'medium' : 'high',
    },
    viabilityScore: Math.round((matchRate * 0.6) + (avgResilience * 0.2) + (topNiche.marketDemand * 0.2)),
    transitionMetrics: {
      financialRunway: yearsExp >= 10 ? '12+ mois' : yearsExp >= 5 ? '6-9 mois' : '3-6 mois',
      networkReadiness: networkScore,
      mentalReadiness: mentalScore,
    },
  };
}

// Génère les opportunités de niche enrichies avec Core Transfer et Value Curve
// Intelligence de Câblage : utilise les métiers idéaux du Portrait pour Pivot
function generateNicheOpportunities(
  talents: Talent[], 
  goal: Goal, 
  persona: Persona,
  userIntention?: UserIntention
): NicheOpportunity[] {
  const selectedTalents = talents.filter(t => t.selected);
  const talentIds = selectedTalents.map(t => t.id);
  
  // Fonction helper pour générer la Value Curve spécifique au métier
  const generateValueCurve = (resistance: number): NicheOpportunity['valueCurve'] => [
    { factor: 'Jugement Humain', userPosition: 75, automationThreat: 15 },
    { factor: 'Relations Clés', userPosition: 70, automationThreat: 10 },
    { factor: 'Arbitrage Complexe', userPosition: 80, automationThreat: 20 },
    { factor: 'Innovation', userPosition: 65, automationThreat: 25 },
    { factor: 'Exécution Répétitive', userPosition: 30, automationThreat: 90 },
    { factor: 'Analyse Données', userPosition: 50, automationThreat: 85 },
  ];

  // Fonction helper pour générer les métriques sectorielles
  const generateSectorMetrics = (demand: number, growth: 'high' | 'medium' | 'low'): NicheOpportunity['sectorMetrics'] => ({
    jobOpenings: demand >= 85 ? 5000 : demand >= 70 ? 2500 : 1000,
    averageAge: 42,
    growthRate: growth === 'high' ? '+15%/an' : growth === 'medium' ? '+8%/an' : '+3%/an',
    entryBarrier: growth === 'high' ? 'medium' : growth === 'medium' ? 'low' : 'high',
  });

  // Fonction helper pour trouver le talent clé
  const findKeyTalent = (requiredTalents: string[]): { name: string; id: string } => {
    const matchingTalent = selectedTalents.find(t => requiredTalents.includes(t.id));
    if (matchingTalent) return { name: matchingTalent.name, id: matchingTalent.id };
    const fallbackTalent = STRATEGIC_ASSETS.find(a => requiredTalents.includes(a.id));
    return { name: fallbackTalent?.name || 'Compétence clé', id: fallbackTalent?.id || '' };
  };
  
  const allOpportunities: NicheOpportunity[] = [
    {
      id: 'expert-integration-systemes',
      name: 'Expert en Intégration de Systèmes Experts',
      description: 'Optimiser les processus de production par l\'automatisation et superviser les outils déployés.',
      matchScore: 0,
      requiredTalents: ['pilotage-ia', 'pensee-systemique', 'communication-influence'],
      growthPotential: 'high',
      marketDemand: 92,
      automationResistance: 85,
      salaryRange: '80-150K€',
      coreTransfer: {
        keyTalent: findKeyTalent(['pilotage-ia', 'pensee-systemique']).name,
        transferRationale: 'Votre capacité à comprendre les systèmes complexes vous positionne comme orchestrateur naturel des outils automatisés.',
        competitiveEdge: 'Les entreprises cherchent des profils capables de faire le pont entre technique et stratégie.',
      },
      valueCurve: generateValueCurve(85),
      sectorMetrics: generateSectorMetrics(92, 'high'),
    },
    {
      id: 'manager-transition',
      name: 'Manager de Transition',
      description: 'Piloter des équipes et projets lors de phases de mutation organisationnelle critique.',
      matchScore: 0,
      requiredTalents: ['leadership-transition', 'diagnostic-crise', 'tactique-relationnelle'],
      growthPotential: 'high',
      marketDemand: 88,
      automationResistance: 90,
      salaryRange: '90-180K€',
      coreTransfer: {
        keyTalent: findKeyTalent(['leadership-transition', 'diagnostic-crise']).name,
        transferRationale: 'Votre expérience en gestion de crise et mobilisation d\'équipes est irremplaçable en période de transformation.',
        competitiveEdge: 'Le facteur humain en période de changement ne peut être automatisé.',
      },
      valueCurve: generateValueCurve(90),
      sectorMetrics: generateSectorMetrics(88, 'high'),
    },
    {
      id: 'expert-negociation',
      name: 'Expert en Négociation Complexe',
      description: 'Intervenir sur des accords à enjeux élevés nécessitant jugement humain et finesse relationnelle.',
      matchScore: 0,
      requiredTalents: ['intelligence-negociation', 'arbitrage-incertitude', 'communication-influence'],
      growthPotential: 'medium',
      marketDemand: 75,
      automationResistance: 95,
      salaryRange: '70-130K€',
      coreTransfer: {
        keyTalent: findKeyTalent(['intelligence-negociation', 'arbitrage-incertitude']).name,
        transferRationale: 'La négociation à haut niveau repose sur l\'intuition, l\'empathie et le timing — des compétences exclusivement humaines.',
        competitiveEdge: 'Indice de protection de 95% : aucun algorithme ne peut lire les non-dits d\'une négociation.',
      },
      valueCurve: generateValueCurve(95),
      sectorMetrics: generateSectorMetrics(75, 'medium'),
    },
    {
      id: 'concepteur-solutions',
      name: 'Concepteur de Solutions Métier',
      description: 'Concevoir des réponses sur-mesure aux problèmes complexes que les outils standards ne résolvent pas.',
      matchScore: 0,
      requiredTalents: ['innovation-rupture', 'synthese-strategique', 'pensee-systemique'],
      growthPotential: 'high',
      marketDemand: 85,
      automationResistance: 88,
      salaryRange: '75-140K€',
      coreTransfer: {
        keyTalent: findKeyTalent(['innovation-rupture', 'synthese-strategique']).name,
        transferRationale: 'Votre capacité à innover et synthétiser vous permet de créer des solutions que les bases de données passées ne contiennent pas.',
        competitiveEdge: 'L\'innovation de rupture nécessite une compréhension contextuelle que seul l\'humain possède.',
      },
      valueCurve: generateValueCurve(88),
      sectorMetrics: generateSectorMetrics(85, 'high'),
    },
    {
      id: 'responsable-conformite-algo',
      name: 'Responsable Conformité & Audit Algorithmique',
      description: 'Garantir la fiabilité et la conformité des sorties des systèmes automatisés.',
      matchScore: 0,
      requiredTalents: ['ethique-gouvernance', 'analyse-critique', 'communication-influence'],
      growthPotential: 'high',
      marketDemand: 90,
      automationResistance: 92,
      salaryRange: '85-160K€',
      coreTransfer: {
        keyTalent: findKeyTalent(['ethique-gouvernance', 'analyse-critique']).name,
        transferRationale: 'La responsabilité légale et éthique des décisions algorithmiques requiert un jugement humain certifié.',
        competitiveEdge: 'Réglementation croissante (AI Act, RGPD) : demande en explosion pour les profils capables de certifier les productions.',
      },
      valueCurve: generateValueCurve(92),
      sectorMetrics: generateSectorMetrics(90, 'high'),
    },
    {
      id: 'accompagnateur-reconversion',
      name: 'Accompagnateur de Reconversion Métier',
      description: 'Guider les professionnels dans leur transition vers des postes à plus forte valeur ajoutée.',
      matchScore: 0,
      requiredTalents: ['leadership-transition', 'tactique-relationnelle', 'diagnostic-crise'],
      growthPotential: 'medium',
      marketDemand: 72,
      automationResistance: 88,
      salaryRange: '60-100K€',
      coreTransfer: {
        keyTalent: findKeyTalent(['leadership-transition', 'tactique-relationnelle']).name,
        transferRationale: 'Avoir vécu une mutation vous rend légitime pour accompagner d\'autres professionnels dans leur transition.',
        competitiveEdge: 'L\'accompagnement humain en période de doute et de changement ne peut être délégué à une machine.',
      },
      valueCurve: generateValueCurve(88),
      sectorMetrics: generateSectorMetrics(72, 'medium'),
    },
    {
      id: 'arbitre-operationnel',
      name: 'Arbitre Opérationnel',
      description: 'Trancher les situations ambiguës où les données sont incomplètes ou contradictoires.',
      matchScore: 0,
      requiredTalents: ['arbitrage-incertitude', 'synthese-strategique', 'analyse-critique'],
      growthPotential: 'high',
      marketDemand: 78,
      automationResistance: 91,
      salaryRange: '90-170K€',
      coreTransfer: {
        keyTalent: findKeyTalent(['arbitrage-incertitude', 'synthese-strategique']).name,
        transferRationale: 'Votre capacité à décider avec des informations incomplètes est exactement ce que les algorithmes ne savent pas faire.',
        competitiveEdge: 'Les entreprises ont besoin de décideurs capables de trancher quand la data ne suffit pas.',
      },
      valueCurve: generateValueCurve(91),
      sectorMetrics: generateSectorMetrics(78, 'high'),
    },
    {
      id: 'coordinateur-workflows',
      name: 'Coordinateur de Workflows Hybrides',
      description: 'Orchestrer les processus mêlant travail humain et outils automatisés dans les organisations.',
      matchScore: 0,
      requiredTalents: ['pensee-systemique', 'tactique-relationnelle', 'diagnostic-crise'],
      growthPotential: 'medium',
      marketDemand: 70,
      automationResistance: 87,
      salaryRange: '70-120K€',
      coreTransfer: {
        keyTalent: findKeyTalent(['pensee-systemique', 'tactique-relationnelle']).name,
        transferRationale: 'Comprendre comment les humains et les machines interagissent est une compétence rare et recherchée.',
        competitiveEdge: 'Les workflows hybrides sont l\'avenir — et ils nécessitent des coordinateurs humains.',
      },
      valueCurve: generateValueCurve(87),
      sectorMetrics: generateSectorMetrics(70, 'medium'),
    },
  ];

  // === INTÉGRATION MÉTIERS IDÉAUX DU PORTRAIT ===
  // Si des métiers idéaux sont définis, les ajouter avec un bonus de score
  if (userIntention?.horizonCible) {
    const { metierIdeal1, metierIdeal2, secteurCible } = userIntention.horizonCible;
    
    // Créer des opportunités personnalisées basées sur les métiers idéaux
    const customOpportunities: NicheOpportunity[] = [];
    
    [metierIdeal1, metierIdeal2].forEach((metier, index) => {
      if (metier && metier.trim().length > 2) {
        // Trouver le talent le plus pertinent parmi les sélectionnés
        const topTalent = selectedTalents.length > 0 
          ? selectedTalents.reduce((best, t) => t.level > best.level ? t : best, selectedTalents[0])
          : null;
        
        customOpportunities.push({
          id: `custom-metier-${index + 1}`,
          name: metier.trim(),
          description: secteurCible 
            ? `Métier idéal identifié dans le secteur ${secteurCible}. Aligné avec vos aspirations profondes.`
            : 'Métier idéal identifié selon votre Portrait de Mutation.',
          matchScore: 85 + (index === 0 ? 10 : 0), // Bonus pour le 1er métier idéal
          requiredTalents: topTalent ? [topTalent.id] : [],
          growthPotential: 'high' as const,
          marketDemand: 80,
          automationResistance: 88,
          salaryRange: 'Variable selon expérience',
          coreTransfer: {
            keyTalent: topTalent?.name || 'Vos talents naturels',
            transferRationale: 'Ce métier est directement aligné avec vos aspirations et votre Manifeste Humain.',
            competitiveEdge: 'L\'alignement entre vos passions et votre expertise crée un positionnement unique.',
          },
          valueCurve: generateValueCurve(88),
          sectorMetrics: {
            jobOpenings: 2000,
            averageAge: 40,
            growthRate: '+10%/an',
            entryBarrier: 'medium' as const,
          },
        });
      }
    });
    
    // Ajouter les métiers personnalisés en tête de liste
    allOpportunities.unshift(...customOpportunities);
  }

  return allOpportunities
    .map(opp => {
      // Si c'est un métier personnalisé, garder le score original
      if (opp.id.startsWith('custom-metier')) {
        return opp;
      }
      const matchCount = opp.requiredTalents.filter(t => talentIds.includes(t)).length;
      const matchScore = Math.round((matchCount / opp.requiredTalents.length) * 100);
      return { ...opp, matchScore };
    })
    .filter(opp => opp.matchScore >= 33)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

// Génère l'Ikigai Stratégique
// Intelligence de Câblage : pondération avec Portrait de Mutation pour Pivot
function generateIkigai(
  tasks: Task[],
  talents: Talent[],
  software: Software[],
  niches: NicheOpportunity[],
  userIntention?: UserIntention
): IkigaiStrategique {
  const selectedTalents = talents.filter(t => t.selected);

  // === ENGAGEMENT STRATÉGIQUE ===
  // Pondéré par les Passions Concrètes (si remplies) et croisement avec Horizon Cible
  let engagementBase = selectedTalents.length > 0
    ? Math.round(selectedTalents.reduce((acc, t) => acc + t.level * 20, 0) / selectedTalents.length)
    : 30;
  
  // Bonus Engagement si les passions sont alignées avec le secteur cible
  let passionBonus = 0;
  if (userIntention?.passionsConcretes && userIntention.passionsConcretes.length > 20) {
    // Bonus de 10 points pour avoir exprimé des passions claires
    passionBonus += 10;
    
    // Bonus supplémentaire si le secteur cible est mentionné dans les passions
    if (userIntention.horizonCible.secteurCible) {
      const passionsLower = userIntention.passionsConcretes.toLowerCase();
      const secteurLower = userIntention.horizonCible.secteurCible.toLowerCase();
      if (passionsLower.includes(secteurLower) || secteurLower.split(' ').some(word => passionsLower.includes(word))) {
        passionBonus += 5;
      }
    }
  }
  const engagementStrategique = Math.min(100, engagementBase + passionBonus);

  // === EXPERTISE DISTINCTIVE ===
  // Croisement des 4 Talents du Portrait avec les 5 Actifs de l'audit
  const techBonus = software.reduce((acc, s) => {
    return acc + (s.level === 'expert' ? 15 : s.level === 'avance' ? 8 : 3);
  }, 0);
  
  let expertiseBase = Math.round(
    (selectedTalents.reduce((acc, t) => acc + t.level * 18, 0) / Math.max(1, selectedTalents.length)) + techBonus / 3
  );
  
  // Bonus Expertise si le Carré d'As est aligné avec les actifs sélectionnés
  let carreDAsBonus = 0;
  if (userIntention?.carreDAs) {
    const carreDAsValues = [
      userIntention.carreDAs.talent1,
      userIntention.carreDAs.talent2,
      userIntention.carreDAs.talent3,
      userIntention.carreDAs.talent4
    ].filter(t => t.trim().length > 0);
    
    // Vérifier les correspondances entre Carré d'As et talents sélectionnés
    const talentNames = selectedTalents.map(t => t.name.toLowerCase());
    const matchCount = carreDAsValues.filter(carreAs => 
      talentNames.some(tn => 
        tn.includes(carreAs.toLowerCase()) || carreAs.toLowerCase().includes(tn.split(' ')[0])
      )
    ).length;
    
    // Bonus de cohérence : jusqu'à 10 points
    carreDAsBonus = Math.min(10, matchCount * 3);
  }
  const expertiseDistinctive = Math.min(100, expertiseBase + carreDAsBonus);

  // === DEMANDE CRITIQUE DU MARCHÉ ===
  const demandeCritique = niches.length > 0
    ? Math.round(niches.reduce((acc, n) => acc + n.marketDemand, 0) / niches.length)
    : 50;

  // === LEVIER ÉCONOMIQUE ===
  const avgResilience = tasks.length > 0
    ? tasks.reduce((acc, t) => acc + (t.resilience.relationnel + t.resilience.decision + t.resilience.creativite) / 3, 0) / tasks.length
    : 50;
  const levierEconomique = Math.round((avgResilience * 0.5) + (demandeCritique * 0.3) + (expertiseDistinctive * 0.2));

  // === SCORE D'ALIGNEMENT ===
  const scores = [engagementStrategique, expertiseDistinctive, demandeCritique, levierEconomique];
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((acc, s) => acc + Math.pow(s - avg, 2), 0) / scores.length;
  const alignmentScore = Math.round(avg - (Math.sqrt(variance) * 0.5));

  let alignmentZone: 'optimal' | 'partial' | 'misaligned';
  if (alignmentScore >= 65 && variance < 200) alignmentZone = 'optimal';
  else if (alignmentScore >= 45) alignmentZone = 'partial';
  else alignmentZone = 'misaligned';

  return {
    engagementStrategique,
    expertiseDistinctive,
    demandeCritique,
    levierEconomique,
    alignmentScore,
    alignmentZone,
  };
}

// Génère la Roadmap enrichie - Actions Opérationnelles Concrètes
// SYNCHRONISATION TOTALE : Audit + Portrait Humain (userIntention)
function generateRoadmap(
  tasks: Task[],
  talents: Talent[],
  software: Software[],
  goal: Goal,
  eracActions: ERACAction[],
  userIntention?: UserIntention
): RoadmapAction[] {
  const roadmap: RoadmapAction[] = [];
  const selectedTalents = talents.filter(t => t.selected);
  
  // ===============================================
  // EXTRACTION DES DONNÉES DU PORTRAIT HUMAIN (PIVOT)
  // ===============================================
  const carreDAs = userIntention?.carreDAs;
  const zoneDeRejet = userIntention?.zoneDeRejet || [];
  const passions = userIntention?.passionsConcretes || '';
  const secteurCible = userIntention?.horizonCible?.secteurCible || '';
  const metierIdeal1 = userIntention?.horizonCible?.metierIdeal1 || '';
  const metierIdeal2 = userIntention?.horizonCible?.metierIdeal2 || '';
  const hasPortraitData = userIntention?.isComplete;

  // ===============================================
  // CALCULS DYNAMIQUES BASÉS SUR LES DONNÉES DU STORE
  // ===============================================

  // Identifier les tâches avec leur score de vulnérabilité (score bas = plus vulnérable)
  const tasksWithScores = [...tasks]
    .map(t => ({
      ...t,
      avgScore: (t.resilience.donnees + t.resilience.decision + t.resilience.relationnel + t.resilience.creativite + t.resilience.execution) / 5,
      vulnerabilityPercent: 100 - Math.round((t.resilience.donnees + t.resilience.decision + t.resilience.relationnel + t.resilience.creativite + t.resilience.execution) / 5)
    }))
    .sort((a, b) => a.avgScore - b.avgScore);

  // La tâche LA PLUS vulnérable (score le plus bas)
  const mostVulnerableTask = tasksWithScores[0] || null;
  
  // Les 2 tâches les plus vulnérables
  const vulnerableTasks = tasksWithScores.slice(0, 2);

  // Identifier les tâches à haute valeur (score > 60)
  const highValueTasks = tasks.filter(t => {
    const avg = (t.resilience.relationnel + t.resilience.decision + t.resilience.creativite) / 3;
    return avg > 60;
  });

  // Le talent avec le score LE PLUS BAS dans le Top 5 sélectionné
  const lowestScoredTalent = selectedTalents.length > 0
    ? [...selectedTalents].sort((a, b) => a.level - b.level)[0]
    : null;

  // Talents avec score < 4 (à renforcer)
  const talentsToReinforce = selectedTalents.filter(t => t.level < 4);

  // ===============================================
  // CALCUL DE GAIN DE TEMPS DÉTAILLÉ
  // ===============================================
  
  // Temps libérable par les tâches automatisables (vulnérabilité > 50%)
  const automatizableTasks = tasksWithScores.filter(t => t.vulnerabilityPercent >= 50);
  const timeToFreeFromAutomation = automatizableTasks.reduce((acc, t) => acc + t.hoursPerWeek, 0);
  
  // Temps des 2 tâches les plus vulnérables
  const timeToFree = vulnerableTasks.reduce((acc, t) => acc + t.hoursPerWeek, 0);
  
  // Gain annuel estimé (52 semaines)
  const annualTimeGain = timeToFree * 52;

  // ===============================================
  // PILIER 1: DÉLÉGATION & EFFICIENCE (Le Nettoyage)
  // SYNCHRONISÉ avec Audit + Zone de Rejet (Portrait Humain)
  // Verbes d'impact : Déléguer, Implémenter, Configurer
  // ===============================================

  // Construire le titre hybride (Tâche vulnérable + Zone de Rejet si disponible)
  const rejetItem = zoneDeRejet.length > 0 ? zoneDeRejet[0] : null;
  
  // Action principale : Délégation technologique
  if (mostVulnerableTask) {
    const hybridTitle = rejetItem && goal === 'pivot'
      ? `Déléguer "${mostVulnerableTask.name}" et éliminer "${rejetItem}"`
      : `Déléguer technologiquement "${mostVulnerableTask.name}"`;
    
    const hybridDesc = rejetItem && goal === 'pivot'
      ? `Automatisation prioritaire de "${mostVulnerableTask.name}" (vulnérabilité ${mostVulnerableTask.vulnerabilityPercent}%) + retrait définitif de "${rejetItem}" (identifié comme source d'épuisement). Gain estimé : ${Math.round(mostVulnerableTask.hoursPerWeek * 0.8)}h/semaine.`
      : `Cette tâche présente une vulnérabilité de ${mostVulnerableTask.vulnerabilityPercent}%. Automatisation prioritaire — Gain estimé : ${mostVulnerableTask.hoursPerWeek}h/semaine (${mostVulnerableTask.hoursPerWeek * 52}h/an).`;
    
    roadmap.push({
      id: generateId(),
      pillar: 'delegation',
      title: hybridTitle,
      description: hybridDesc,
      priority: 'immediate',
      completed: false,
      eracCategory: 'eliminate',
      kpi: `${Math.round(mostVulnerableTask.hoursPerWeek * 0.8)}h/sem libérées`,
      resilienceScore: 9, // Score élevé : éliminer les tâches vulnérables protège fortement
      suggestedTool: mostVulnerableTask.resilience.donnees > 60 ? 'Zapier / Make (automatisation)' : 'ChatGPT / Claude (traitement)',
      sourceData: rejetItem ? 'Audit Tâches + Portrait Humain (Zone de Rejet)' : 'Audit Tâches',
    });
  }
  
  // Action secondaire si plus d'une tâche vulnérable
  if (vulnerableTasks.length > 1) {
    const secondTask = vulnerableTasks[1];
    const secondRejet = zoneDeRejet.length > 1 ? zoneDeRejet[1] : null;
  
  roadmap.push({
    id: generateId(),
    pillar: 'delegation',
      title: secondRejet && goal === 'pivot'
        ? `Configurer l'automatisation de "${secondTask.name}" + retrait de "${secondRejet}"`
        : `Implémenter l'automatisation secondaire : "${secondTask.name}"`,
      description: `Vulnérabilité de ${secondTask.vulnerabilityPercent}%. Gain additionnel : ${secondTask.hoursPerWeek}h/semaine. Total cumulé : ${timeToFree}h/semaine.`,
    priority: 'short_term',
    completed: false,
      eracCategory: 'reduce',
      kpi: `+${secondTask.hoursPerWeek}h/sem (cumul: ${timeToFree}h)`,
      resilienceScore: 8,
      suggestedTool: 'No-code (Notion, Airtable, ou outil métier)',
      sourceData: secondRejet ? 'Audit + Portrait Humain' : 'Audit Tâches',
    });
  }
  
  // Action tertiaire : Déployer un outil d'automatisation
  if (!software.some(s => s.level === 'expert')) {
    roadmap.push({
      id: generateId(),
      pillar: 'delegation',
      title: 'Implémenter un assistant de production au niveau Expert',
      description: 'Sélectionner un assistant (ChatGPT, Claude, Copilot, ou outil métier) et l\'intégrer dans votre workflow quotidien.',
      priority: 'immediate',
      completed: false,
      kpi: 'Usage quotidien documenté',
      resilienceScore: 7,
      suggestedTool: 'ChatGPT Plus / Claude Pro / GitHub Copilot',
      sourceData: 'Audit Logiciels',
    });
  } else {
    roadmap.push({
      id: generateId(),
      pillar: 'delegation',
      title: 'Configurer des workflows automatisés documentés',
      description: `Documenter vos workflows automatisés. Objectif : maximiser le gain des ${timeToFree}h/semaine identifiées.`,
      priority: 'short_term',
      completed: false,
      kpi: 'Rapport d\'efficience produit',
      resilienceScore: 7,
      suggestedTool: 'Notion / Confluence (documentation)',
      sourceData: 'Audit Logiciels',
    });
  }

  // ===============================================
  // PILIER 2: RENFORCEMENT DE SIGNATURE (Le Muscle)
  // SYNCHRONISÉ avec Audit + Carré d'As + Passions (Portrait Humain)
  // Verbes d'impact : Déployer, Arbitrer, Sécuriser
  // ===============================================

  // Identifier le talent du Carré d'As à mettre en avant (si disponible)
  const carreDAsTalent = carreDAs?.talent1 || carreDAs?.talent2 || null;
  const passionResume = passions.length > 50 ? passions.substring(0, 50) + '...' : passions;

  // Action principale : Renforcement critique de l'actif
  if (lowestScoredTalent) {
    // Si Portrait Humain disponible, croiser avec le Carré d'As
    const hybridTitle = carreDAsTalent && hasPortraitData
      ? `Déployer l'actif stratégique : "${lowestScoredTalent.name}" × "${carreDAsTalent}"`
      : `Déployer l'actif critique : "${lowestScoredTalent.name}"`;
    
    const hybridDesc = passions && hasPortraitData
      ? `Niveau actuel : ${lowestScoredTalent.level}/5. Appliquer ce talent à votre passion concrète ("${passionResume}") pour créer une proposition de valeur unique. Objectif : Niveau Référent (4/5).`
      : `Niveau actuel : ${lowestScoredTalent.level}/5. Objectif : atteindre le niveau Référent (4/5) sur cet actif stratégique prioritaire.`;
    
    roadmap.push({
      id: generateId(),
      pillar: 'reinforcement',
      title: hybridTitle,
      description: hybridDesc,
      priority: 'immediate',
      completed: false,
      eracCategory: 'raise',
      kpi: `${lowestScoredTalent.name} → Niveau 4`,
      resilienceScore: 9, // Score très élevé : les talents humains sont non-automatisables
      suggestedTool: 'Mentorat / Formation certifiante / Coaching professionnel',
      sourceData: hasPortraitData ? 'Audit Talents + Portrait Humain (Carré d\'As + Passions)' : 'Audit Talents',
    });
  }

  // Action secondaire : Plan global sur les autres talents < 4
  const otherTalentsToReinforce = talentsToReinforce.filter(t => t.id !== lowestScoredTalent?.id);
  if (otherTalentsToReinforce.length > 0) {
    // Croiser avec les autres talents du Carré d'As si disponibles
    const carreDAsList = [carreDAs?.talent2, carreDAs?.talent3, carreDAs?.talent4].filter(Boolean);
    
    roadmap.push({
      id: generateId(),
      pillar: 'reinforcement',
      title: carreDAsList.length > 0 && hasPortraitData
        ? `Sécuriser vos actifs secondaires (alignés avec "${carreDAsList[0]}")`
        : 'Sécuriser vos actifs secondaires en montée de compétence',
      description: `Objectif Niveau 4/5 également sur : ${otherTalentsToReinforce.map(t => `${t.name} (${t.level}/5)`).join(', ')}.`,
      priority: 'short_term',
      completed: false,
      eracCategory: 'raise',
      kpi: `${otherTalentsToReinforce.length} actif(s) renforcés`,
      resilienceScore: 8,
      suggestedTool: 'Plateformes e-learning (Coursera, LinkedIn Learning)',
      sourceData: hasPortraitData ? 'Audit Talents + Portrait Humain' : 'Audit Talents',
    });
  }
  
  // Action tertiaire : Réallouer le temps libéré vers les activités différenciantes
  if (highValueTasks.length > 0 && timeToFree > 0) {
  roadmap.push({
    id: generateId(),
    pillar: 'reinforcement',
      title: `Arbitrer le réinvestissement des ${timeToFree}h libérées`,
      description: `Consacrer le temps gagné aux tâches à haute valeur : ${highValueTasks.slice(0, 2).map(t => t.name).join(', ')}.`,
      priority: 'immediate',
      completed: false,
      eracCategory: 'raise',
      kpi: `${timeToFree}h/sem → haute valeur`,
      resilienceScore: 8,
      suggestedTool: 'Time-blocking (Calendly, Google Calendar)',
      sourceData: 'Audit Tâches (haute valeur)',
    });
  }

  // Action tertiaire : Documentation des succès
  roadmap.push({
    id: generateId(),
    pillar: 'reinforcement',
    title: 'Sécuriser un portfolio de cas d\'impact',
    description: 'Documenter 5 situations où votre jugement humain a fait la différence (arbitrage, résolution de crise, négociation).',
    priority: 'medium_term',
    completed: false,
    kpi: '5+ cas documentés',
    resilienceScore: 10, // Score maximal : preuves d'impact humain irremplaçable
    suggestedTool: 'Notion / Obsidian (second cerveau)',
    sourceData: 'Expérience terrain',
  });

  // ===============================================
  // PILIER 3: POSITIONNEMENT & AUTORITÉ (La Sortie)
  // SYNCHRONISÉ avec Audit + Horizon Cible (Portrait Humain)
  // Verbes d'impact : Négocier, Implémenter, Arbitrer
  // ===============================================

  if (goal === 'augmentation') {
    // === SCÉNARIO AUGMENTATION : Gain d'efficience et pilotage ===
    
    roadmap.push({
      id: generateId(),
      pillar: 'positioning',
      title: 'Négocier un positionnement de superviseur des flux automatisés',
      description: 'Démontrer la valeur du nouveau workflow de production : temps gagné, erreurs évitées, qualité maintenue. Rédiger un rapport pour votre management.',
      priority: 'short_term',
      completed: false,
      eracCategory: 'create',
      kpi: 'Rapport présenté au N+1',
      resilienceScore: 9, // Superviseur = rôle humain critique
      suggestedTool: 'PowerPoint / Google Slides (présentation)',
      sourceData: 'Audit + KPIs calculés',
    });

    roadmap.push({
      id: generateId(),
      pillar: 'positioning',
      title: 'Implémenter un projet pilote d\'automatisation supervisée',
      description: 'Identifier un processus à optimiser et piloter sa transformation avec votre supervision. Arbitrer les décisions critiques.',
      priority: 'short_term',
      completed: false,
      kpi: '1 pilote validé',
      resilienceScore: 8,
      suggestedTool: 'Trello / Asana (gestion de projet)',
      sourceData: 'Audit Tâches (automatisables)',
    });

    roadmap.push({
      id: generateId(),
      pillar: 'positioning',
      title: 'Arbitrer en tant que référent automatisation du périmètre',
      description: 'Former vos collègues aux bonnes pratiques et devenir le point de contact pour les questions d\'efficience.',
      priority: 'medium_term',
      completed: false,
      kpi: '5+ collègues accompagnés',
      resilienceScore: 10, // Formation = rôle humain irremplaçable
      suggestedTool: 'Loom / Notion (documentation vidéo)',
      sourceData: 'Expérience terrain',
    });

  } else {
    // ===============================================
    // SCÉNARIO PIVOT : MUTATION RADICALE
    // SYNCHRONISÉ avec Audit + Portrait Humain (Horizon Cible)
    // Verbes d'impact : Sécuriser, Implémenter, Négocier
    // ===============================================

    // Construire les références au métier cible
    const metierCible = metierIdeal1 || metierIdeal2 || 'Métier Refuge identifié';
    const secteurRef = secteurCible || 'secteur cible';

    // -----------------------------------------------
    // PILIER 1: DÉSENGAGEMENT DU SECTEUR EXPOSÉ
    // -----------------------------------------------
    
    roadmap.push({
      id: generateId(),
      pillar: 'disengagement',
      title: 'Sécuriser un audit financier de sortie',
      description: 'Calculer votre runway financier : épargne, indemnités, droits au chômage. Objectif : 6 mois de sécurité minimum.',
      priority: 'immediate',
      completed: false,
      kpi: 'Runway calculé',
      resilienceScore: 10, // Sécurité financière = fondation critique
      suggestedTool: 'Excel / Notion (simulateur budget)',
      sourceData: 'Situation personnelle',
    });

    // Titre hybride avec Zone de Rejet
    const disengageTitle = zoneDeRejet.length > 0
      ? `Déléguer avant départ : "${mostVulnerableTask?.name || 'tâches automatisables'}" + éliminer "${zoneDeRejet[0]}"`
      : `Déléguer avant départ : "${mostVulnerableTask?.name || 'les tâches automatisables'}"`;
    
    roadmap.push({
      id: generateId(),
      pillar: 'disengagement',
      title: disengageTitle,
      description: `Transférer progressivement vos responsabilités vers des collègues ou des outils. Retrait définitif des tâches de la Zone de Rejet.`,
      priority: 'immediate',
      completed: false,
      eracCategory: 'eliminate',
      kpi: 'Transfert planifié',
      resilienceScore: 8,
      suggestedTool: 'Documentation + Handover meeting',
      sourceData: zoneDeRejet.length > 0 ? 'Audit + Portrait Humain (Zone de Rejet)' : 'Audit Tâches',
    });

    roadmap.push({
      id: generateId(),
      pillar: 'disengagement',
      title: 'Négocier une sortie optimisée vers ' + secteurRef,
      description: `Explorer les options : rupture conventionnelle, transition interne, ou démission stratégique avec préavis aménagé. Objectif : transition vers "${metierCible}".`,
      priority: 'short_term',
      completed: false,
      kpi: 'Accord de sortie',
      resilienceScore: 7,
      suggestedTool: 'Entretien RH / Conseil juridique',
      sourceData: hasPortraitData ? 'Portrait Humain (Horizon Cible)' : 'Objectif utilisateur',
    });

    // -----------------------------------------------
    // PILIER 2: IMMERSION DANS L'OCÉAN BLEU
    // Stratégie d'entrée vers [Métier Idéal / Secteur Cible]
    // -----------------------------------------------

    roadmap.push({
      id: generateId(),
      pillar: 'oceanBleu',
      title: hasPortraitData 
        ? `Implémenter une stratégie d'entrée vers "${metierCible}"`
        : 'Cartographier les métiers refuges accessibles',
      description: hasPortraitData
        ? `Réaliser 5 entretiens exploratoires avec des professionnels du secteur "${secteurRef}". Valider l'adéquation avec vos aspirations.`
        : 'Réaliser 5 entretiens exploratoires avec des professionnels des niches identifiées. Valider l\'adéquation réelle.',
      priority: 'immediate',
      completed: false,
      kpi: '5+ entretiens',
      resilienceScore: 9,
      suggestedTool: 'LinkedIn (networking) / Calendly (prise de RDV)',
      sourceData: hasPortraitData ? 'Portrait Humain (Horizon Cible)' : 'Niches de Résilience',
    });

    if (lowestScoredTalent) {
      // Croiser avec Carré d'As si disponible
      const talentCroise = carreDAsTalent ? ` × "${carreDAsTalent}"` : '';
      
      roadmap.push({
        id: generateId(),
        pillar: 'oceanBleu',
        title: `Déployer l'actif "${lowestScoredTalent.name}"${talentCroise} vers ${secteurRef}`,
        description: `Niveau actuel ${lowestScoredTalent.level}/5. Plan de montée en compétence accéléré pour intégrer le secteur "${secteurRef}".`,
        priority: 'immediate',
        completed: false,
        eracCategory: 'raise',
        kpi: `Niveau 4+ en 3 mois`,
        resilienceScore: 9,
        suggestedTool: 'Formation certifiante / Mentorat sectoriel',
        sourceData: hasPortraitData ? 'Audit + Portrait Humain (Carré d\'As)' : 'Audit Talents',
    });
  }
  
  roadmap.push({
    id: generateId(),
      pillar: 'oceanBleu',
      title: `Acquérir les compétences spécifiques au secteur "${secteurRef}"`,
      description: hasPortraitData
        ? `Combler l'écart entre votre profil actuel et "${metierCible}". Budget : 1000-3000€ en formation.`
        : 'Identifier et suivre les formations clés du secteur cible. Budget : 1000-3000€ en formation.',
      priority: 'short_term',
      completed: false,
      eracCategory: 'create',
      kpi: 'Certifications acquises',
      resilienceScore: 8,
      suggestedTool: 'Coursera / Udemy / Formation professionnelle',
      sourceData: hasPortraitData ? 'Portrait Humain (Horizon Cible) + Gap Analysis' : 'Gap Analysis',
    });

    roadmap.push({
      id: generateId(),
      pillar: 'oceanBleu',
      title: `Sécuriser une crédibilité dans le secteur "${secteurRef}"`,
      description: `Produire du contenu (articles, posts LinkedIn) démontrant votre expertise naissante dans le domaine "${secteurRef}".`,
      priority: 'short_term',
      completed: false,
      kpi: '10+ publications',
      resilienceScore: 7,
      suggestedTool: 'LinkedIn / Medium / Newsletter (Substack)',
      sourceData: hasPortraitData ? 'Portrait Humain (Manifeste Humain)' : 'Positionnement',
    });

    // -----------------------------------------------
    // PILIER 3: ATTERRISSAGE vers [Métier Idéal]
    // -----------------------------------------------

    roadmap.push({
      id: generateId(),
      pillar: 'landing',
      title: hasPortraitData
        ? `Packager vos actifs pour "${metierCible}"`
        : 'Packager vos actifs transférables',
      description: `Formaliser une offre claire basée sur vos talents : ${selectedTalents.slice(0, 2).map(t => t.name).join(' + ')}.`,
      priority: 'short_term',
      completed: false,
      eracCategory: 'create',
      kpi: 'Pitch de 30 secondes',
      resilienceScore: 8,
      suggestedTool: 'Canva (CV visuel) / Notion (portfolio)',
      sourceData: 'Audit Talents + Portrait Humain',
    });

    roadmap.push({
      id: generateId(),
      pillar: 'landing',
      title: `Négocier l'accès au réseau du secteur "${secteurRef}"`,
      description: `Contacter 10 décideurs du secteur "${secteurRef}" avec votre proposition de valeur ciblée "${metierCible}". Approche directe et personnalisée.`,
    priority: 'medium_term',
    completed: false,
      kpi: '10+ contacts qualifiés',
      resilienceScore: 9,
      suggestedTool: 'LinkedIn Sales Navigator / Emails personnalisés',
      sourceData: hasPortraitData ? 'Portrait Humain (Horizon Cible)' : 'Niches de Résilience',
    });

    roadmap.push({
      id: generateId(),
      pillar: 'landing',
      title: hasPortraitData
        ? `Implémenter une mission pilote vers "${metierCible}"`
        : 'Lancer un projet pilote / mission test',
      description: `Valider votre positionnement avec une première mission (freelance, CDD, ou projet bénévole) dans le métier "${metierCible}".`,
      priority: 'medium_term',
      completed: false,
      kpi: '1 mission réalisée',
      resilienceScore: 10, // Mission réelle = validation ultime
      suggestedTool: 'Malt / Freelance.com / Réseau direct',
      sourceData: hasPortraitData ? 'Portrait Humain (Horizon Cible)' : 'Métiers Refuges',
    });
  }
  
  return roadmap;
}

// ===============================================
// STORE ZUSTAND
// ===============================================

const initialContext: AuditContext = {
  persona: null,
  goal: null,
  jobTitle: '',
  industry: '',
  jobDescription: '',
  yearsExperience: undefined,
  teamSize: undefined,
};

const initialUserIntention: UserIntention = {
  passionsConcretes: '',
  carreDAs: {
    talent1: '',
    talent2: '',
    talent3: '',
    talent4: '',
  },
  zoneDeRejet: [],
  horizonCible: {
    secteurCible: '',
    metierIdeal1: '',
    metierIdeal2: '',
  },
  manifesteHumain: '',
  completedAt: null,
  isComplete: false,
};

const initialKPIs: ComputedKPIs = {
  productivityGainPercent: 0,
  timeROI: 0,
  riskReductionScore: 0,
  marketPositioningScore: 0,
  transitionReadinessScore: 0,
};

const initialCohortData: CohortData = {
  cohortName: '',
  targetCompletionDate: null,
  totalMembers: 0,
  members: [],
  stats: {
    invitedCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    averageEmployabilityIndex: 0,
    highRiskCount: 0,
    readyForTransitionCount: 0,
  },
  createdAt: null,
  lastUpdatedAt: null,
};

const initialEnterpriseTargets: EnterpriseTargets = {
  organizationName: '',
  strategicHorizon: '1_year',
  futureJobs: [],
  employeeMatches: [],
  createdAt: null,
  lastUpdatedAt: null,
  isConfigured: false,
};

const initialPhantomCharge: PhantomChargeData = {
  dailyVolume: 0,           // Nombre d'emails traités par jour (utilisateur saisit)
  dailyHours: 0,            // Heures passées sur les mails par jour
  dailyMinutes: 0,          // Minutes passées sur les mails par jour
  readingTimeAvg: 0,        // DEPRECATED - conservé pour compatibilité
  responseTimeAvg: 0,       // DEPRECATED - conservé pour compatibilité
  fluxAuto: 30,             // 30% flux automatiques
  fluxBasNiveau: 50,        // 50% flux bas niveau
  fluxStrategique: 20,      // 20% flux stratégiques
  isEnabled: true,          // Activé par défaut
};

const initialIkigai: IkigaiStrategique = {
  engagementStrategique: 0,
  expertiseDistinctive: 0,
  demandeCritique: 0,
  levierEconomique: 0,
  alignmentScore: 0,
  alignmentZone: 'misaligned',
};

const initialBusinessModel: BusinessModelYou = {
  coreValue: '',
  targetAudience: '',
  uniqueDifferentiator: '',
  deliveryMethod: '',
  keyResources: [],
  keyActivities: [],
  channels: [],
  relationships: [],
};

const initialStrategy: StrategyData = {
  ikigai: initialIkigai,
  eracActions: [],
  valueCurve: [],
  businessModel: initialBusinessModel,
  gapAnalysis: null,
  opportunitesNiche: [],
  roadmap: [],
  generatedAt: null,
  parcours: null,
  capitalActif: 0,
  zoneRisque: 0,
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
      computedKPIs: initialKPIs,
      userIntention: initialUserIntention,
      cohortData: initialCohortData,
      enterpriseTargets: initialEnterpriseTargets,
      phantomCharge: initialPhantomCharge,

      // Navigation (8 étapes)
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
      setCountry: (country) => set((state) => ({
        context: { ...state.context, country }
      })),
      // Context - Champs enrichis
      setYearsExperience: (yearsExperience) => set((state) => ({
        context: { ...state.context, yearsExperience }
      })),
      setTeamSize: (teamSize) => set((state) => ({
        context: { ...state.context, teamSize }
      })),
      setMutationDrivers: (mutationDrivers) => set((state) => ({
        context: { ...state.context, mutationDrivers: mutationDrivers.slice(0, 2) } // Max 2 drivers
      })),

      // Portrait de Mutation (Pivot uniquement)
      setPassionsConcretes: (passions) => set((state) => ({
        userIntention: { ...state.userIntention, passionsConcretes: passions }
      })),
      setCarreDAs: (carreDAs) => set((state) => ({
        userIntention: { ...state.userIntention, carreDAs }
      })),
      setZoneDeRejet: (zones) => set((state) => ({
        userIntention: { ...state.userIntention, zoneDeRejet: zones }
      })),
      setHorizonCible: (horizon) => set((state) => ({
        userIntention: { ...state.userIntention, horizonCible: horizon }
      })),
      setManifesteHumain: (manifeste) => set((state) => ({
        userIntention: { ...state.userIntention, manifesteHumain: manifeste }
      })),
      validateUserIntention: () => set((state) => {
        const { passionsConcretes, carreDAs, horizonCible, manifesteHumain } = state.userIntention;
        const isComplete = 
          passionsConcretes.trim().length > 0 &&
          carreDAs.talent1.trim().length > 0 &&
          carreDAs.talent2.trim().length > 0 &&
          carreDAs.talent3.trim().length > 0 &&
          carreDAs.talent4.trim().length > 0 &&
          horizonCible.secteurCible.trim().length > 0 &&
          (horizonCible.metierIdeal1.trim().length > 0 || horizonCible.metierIdeal2.trim().length > 0) &&
          manifesteHumain.trim().length > 0;
        
        return {
          userIntention: {
            ...state.userIntention,
            isComplete,
            completedAt: isComplete ? Date.now() : null
          }
        };
      }),

      // Cohorte (Reclassement/PSE)
      setCohortName: (cohortName) => set((state) => ({
        cohortData: { ...state.cohortData, cohortName, createdAt: state.cohortData.createdAt || Date.now() }
      })),
      setCohortTargetDate: (targetCompletionDate) => set((state) => ({
        cohortData: { ...state.cohortData, targetCompletionDate }
      })),
      addCohortMember: (member) => set((state) => {
        const newMember: CohortMember = {
          id: generateId(),
          ...member,
          invitedAt: null,
          completedPortraitAt: null,
          employabilityIndex: null,
          status: 'pending',
        };
        return {
          cohortData: {
            ...state.cohortData,
            members: [...state.cohortData.members, newMember],
            totalMembers: state.cohortData.members.length + 1,
            lastUpdatedAt: Date.now(),
          }
        };
      }),
      updateCohortMember: (id, updates) => set((state) => ({
        cohortData: {
          ...state.cohortData,
          members: state.cohortData.members.map(m => 
            m.id === id ? { ...m, ...updates } : m
          ),
          lastUpdatedAt: Date.now(),
        }
      })),
      removeCohortMember: (id) => set((state) => ({
        cohortData: {
          ...state.cohortData,
          members: state.cohortData.members.filter(m => m.id !== id),
          totalMembers: state.cohortData.members.length - 1,
          lastUpdatedAt: Date.now(),
        }
      })),
      inviteCohortMembers: (memberIds) => set((state) => ({
        cohortData: {
          ...state.cohortData,
          members: state.cohortData.members.map(m => 
            memberIds.includes(m.id) ? { ...m, status: 'invited' as const, invitedAt: Date.now() } : m
          ),
          lastUpdatedAt: Date.now(),
        }
      })),
      updateCohortStats: () => set((state) => {
        const members = state.cohortData.members;
        const invitedCount = members.filter(m => m.status !== 'pending').length;
        const inProgressCount = members.filter(m => m.status === 'in_progress').length;
        const completedCount = members.filter(m => m.status === 'completed').length;
        const completedWithIndex = members.filter(m => m.status === 'completed' && m.employabilityIndex !== null);
        const averageEmployabilityIndex = completedWithIndex.length > 0
          ? completedWithIndex.reduce((sum, m) => sum + (m.employabilityIndex || 0), 0) / completedWithIndex.length
          : 0;
        const highRiskCount = completedWithIndex.filter(m => (m.employabilityIndex || 0) < 40).length;
        const readyForTransitionCount = completedWithIndex.filter(m => (m.employabilityIndex || 0) >= 70).length;
        
        return {
          cohortData: {
            ...state.cohortData,
            stats: {
              invitedCount,
              inProgressCount,
              completedCount,
              averageEmployabilityIndex: Math.round(averageEmployabilityIndex),
              highRiskCount,
              readyForTransitionCount,
            },
            lastUpdatedAt: Date.now(),
          }
        };
      }),

      // Enterprise Targets (Job Designer)
      setOrganizationName: (organizationName) => set((state) => ({
        enterpriseTargets: { ...state.enterpriseTargets, organizationName, lastUpdatedAt: Date.now() }
      })),
      setStrategicHorizon: (strategicHorizon) => set((state) => ({
        enterpriseTargets: { ...state.enterpriseTargets, strategicHorizon, lastUpdatedAt: Date.now() }
      })),
      addFutureJob: (job) => {
        const jobId = generateId();
        set((state) => ({
          enterpriseTargets: {
            ...state.enterpriseTargets,
            futureJobs: [...state.enterpriseTargets.futureJobs, {
              ...job,
              id: jobId,
              createdAt: Date.now(),
            }],
            createdAt: state.enterpriseTargets.createdAt || Date.now(),
            lastUpdatedAt: Date.now(),
          }
        }));
        return jobId;
      },
      updateFutureJob: (id, updates) => set((state) => ({
        enterpriseTargets: {
          ...state.enterpriseTargets,
          futureJobs: state.enterpriseTargets.futureJobs.map(j =>
            j.id === id ? { ...j, ...updates } : j
          ),
          lastUpdatedAt: Date.now(),
        }
      })),
      removeFutureJob: (id) => set((state) => ({
        enterpriseTargets: {
          ...state.enterpriseTargets,
          futureJobs: state.enterpriseTargets.futureJobs.filter(j => j.id !== id),
          lastUpdatedAt: Date.now(),
        }
      })),
      addCompetenceToJob: (jobId, competence) => set((state) => ({
        enterpriseTargets: {
          ...state.enterpriseTargets,
          futureJobs: state.enterpriseTargets.futureJobs.map(j =>
            j.id === jobId ? {
              ...j,
              requiredCompetences: [...j.requiredCompetences, { ...competence, id: generateId() }]
            } : j
          ),
          lastUpdatedAt: Date.now(),
        }
      })),
      removeCompetenceFromJob: (jobId, competenceId) => set((state) => ({
        enterpriseTargets: {
          ...state.enterpriseTargets,
          futureJobs: state.enterpriseTargets.futureJobs.map(j =>
            j.id === jobId ? {
              ...j,
              requiredCompetences: j.requiredCompetences.filter(c => c.id !== competenceId)
            } : j
          ),
          lastUpdatedAt: Date.now(),
        }
      })),
      calculateEmployeeMatches: () => set((state) => {
        const { futureJobs } = state.enterpriseTargets;
        const { members } = state.cohortData;
        const selectedTalents = state.talents.filter(t => t.selected);
        const { tasks, userIntention } = state;
        
        // ===============================================
        // MOTEUR DE MATCHING JOB DESIGNER ENRICHI
        // Compare l'Offre (Portrait du salarié) avec la Demande (Postes Cibles)
        // ===============================================
        
        // Calculer le profil de résilience moyen des tâches
        const avgResilience = tasks.length > 0 ? {
          donnees: tasks.reduce((acc, t) => acc + t.resilience.donnees, 0) / tasks.length,
          decision: tasks.reduce((acc, t) => acc + t.resilience.decision, 0) / tasks.length,
          relationnel: tasks.reduce((acc, t) => acc + t.resilience.relationnel, 0) / tasks.length,
          creativite: tasks.reduce((acc, t) => acc + t.resilience.creativite, 0) / tasks.length,
          execution: tasks.reduce((acc, t) => acc + t.resilience.execution, 0) / tasks.length,
        } : { donnees: 0, decision: 0, relationnel: 0, creativite: 0, execution: 0 };
        
        // Extraire les compétences innées du Carré d'As (Portrait de Mutation)
        const innateSkills = [
          userIntention.carreDAs.talent1,
          userIntention.carreDAs.talent2,
          userIntention.carreDAs.talent3,
          userIntention.carreDAs.talent4,
        ].filter(t => t && t.trim().length > 0);
        
        // Extraire la zone de rejet pour pénaliser les mauvais matchs
        const rejectZone = userIntention.zoneDeRejet || [];
        
        // Calculer les matches pour chaque combinaison employé/poste
        const matches: EmployeeMatch[] = [];
        
        for (const member of members) {
          for (const job of futureJobs) {
            // ===============================================
            // CALCUL DU SCORE D'AFFINITÉ MULTI-CRITÈRES
            // ===============================================
            
            let competenceScore = 0;
            let maxCompetenceScore = 0;
            const gaps: EmployeeMatch['competenceGaps'] = [];
            
            for (const comp of job.requiredCompetences) {
              const weight = comp.criticalityScore / 100;
              maxCompetenceScore += 5 * weight;
              
              // === NIVEAU DE BASE (2/5) ===
              let currentLevel = 2;
              
              // === BONUS TALENTS STRATÉGIQUES (12 actifs) ===
              // Mapping des talents vers catégories de compétences
              const talentCategoryMap: Record<string, CompetenceCategory[]> = {
                'arbitrage-incertitude': ['relationnelle', 'technique'],
                'synthese-strategique': ['technique'],
                'intelligence-negociation': ['relationnelle'],
                'pensee-systemique': ['technique'],
                'diagnostic-crise': ['technique', 'haptique'],
                'tactique-relationnelle': ['relationnelle'],
                'innovation-rupture': ['technique'],
                'pilotage-systemes': ['technique', 'haptique'],
                'ethique-gouvernance': ['relationnelle', 'technique'],
                'leadership-adaptatif': ['relationnelle'],
                'audit-critique': ['technique'],
                'communication-influence': ['relationnelle'],
              };
              
              // Vérifier si un talent sélectionné correspond à la catégorie
              for (const talent of selectedTalents) {
                const categories = talentCategoryMap[talent.id] || [];
                if (categories.includes(comp.category)) {
                  // Bonus proportionnel au niveau de maîtrise du talent
                  currentLevel = Math.min(5, currentLevel + Math.floor(talent.level / 2));
                  break;
                }
              }
              
              // === BONUS SCORES DE RÉSILIENCE (AUDIT TÂCHES) ===
              // Si les tâches actuelles ont des scores élevés dans la catégorie
              if (comp.category === 'relationnelle' && avgResilience.relationnel > 70) {
                currentLevel = Math.min(5, currentLevel + 1);
              } else if (comp.category === 'technique' && avgResilience.decision > 70) {
                currentLevel = Math.min(5, currentLevel + 1);
              } else if (comp.category === 'haptique' && avgResilience.execution > 70) {
                currentLevel = Math.min(5, currentLevel + 1);
              }
              
              // === BONUS CARRÉ D'AS (TALENTS INNÉS) ===
              // Matching sémantique simple entre talents innés et compétences requises
              const compNameLower = comp.name.toLowerCase();
              for (const innateSkill of innateSkills) {
                const skillLower = innateSkill.toLowerCase();
                // Recherche de correspondance partielle
                if (compNameLower.includes(skillLower) || skillLower.includes(compNameLower) ||
                    // Correspondances par mots-clés
                    (skillLower.includes('négoci') && compNameLower.includes('négoci')) ||
                    (skillLower.includes('communi') && compNameLower.includes('communi')) ||
                    (skillLower.includes('manag') && compNameLower.includes('manag')) ||
                    (skillLower.includes('organis') && compNameLower.includes('organis')) ||
                    (skillLower.includes('coord') && compNameLower.includes('coord')) ||
                    (skillLower.includes('techni') && compNameLower.includes('techni'))) {
                  currentLevel = Math.min(5, currentLevel + 1);
                  break;
                }
              }
              
              // === MALUS ZONE DE REJET ===
              // Si le poste implique des tâches dans la zone de rejet
              for (const reject of rejectZone) {
                const rejectLower = reject.toLowerCase();
                if (compNameLower.includes(rejectLower) || 
                    job.description.toLowerCase().includes(rejectLower)) {
                  currentLevel = Math.max(1, currentLevel - 1);
                  break;
                }
              }
              
              competenceScore += Math.min(currentLevel, comp.requiredLevel) * weight;
              
              const gap = currentLevel - comp.requiredLevel;
              if (gap < 0) {
                // Calcul des heures de formation basé sur la criticité
                const trainingHours = Math.abs(gap) * (20 + Math.floor(comp.criticalityScore / 20));
                
                gaps.push({
                  competenceId: comp.id,
                  competenceName: comp.name,
                  category: comp.category,
                  currentLevel,
                  requiredLevel: comp.requiredLevel,
                  gap,
                  trainingHours,
                });
              }
            }
            
            // === BONUS RÉSISTANCE À L'AUTOMATISATION ===
            // Les postes à haute résistance sont favorisés pour les profils résilients
            const resilienceBonus = (job.automationResistance / 100) * 10;
            
            // === CALCUL DU SCORE FINAL ===
            const baseScore = maxCompetenceScore > 0 
              ? (competenceScore / maxCompetenceScore) * 100 
              : 50;
            
            const compatibilityScore = Math.min(100, Math.round(baseScore + resilienceBonus));
            
            // Déterminer la recommandation
            let recommendation: EmployeeMatch['recommendation'] = 'difficult';
            if (compatibilityScore >= 85) recommendation = 'ideal';
            else if (compatibilityScore >= 70) recommendation = 'good';
            else if (compatibilityScore >= 50) recommendation = 'possible';
            
            // === IDENTIFIER LES POINTS FORTS ===
            const strengths: string[] = [];
            
            // Points forts des talents stratégiques
            for (const talent of selectedTalents) {
              if (talent.level >= 4) {
                strengths.push(talent.name);
              }
            }
            
            // Points forts du Carré d'As
            for (const innateSkill of innateSkills.slice(0, 2)) {
              if (innateSkill && !strengths.includes(innateSkill)) {
                strengths.push(`Talent inné: ${innateSkill}`);
              }
            }
            
            // Point fort résilience
            if (avgResilience.relationnel > 70) {
              strengths.push('Excellence relationnelle');
            }
            if (avgResilience.decision > 70) {
              strengths.push('Force décisionnelle');
            }
            
            matches.push({
              employeeId: member.id,
              employeeName: member.name,
              futureJobId: job.id,
              futureJobTitle: job.title,
              compatibilityScore,
              competenceGaps: gaps,
              strengths: strengths.slice(0, 5),
              recommendation,
            });
          }
        }
        
        // Trier par score de compatibilité décroissant
        matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        
        return {
          enterpriseTargets: {
            ...state.enterpriseTargets,
            employeeMatches: matches,
            lastUpdatedAt: Date.now(),
          }
        };
      }),
      markEnterpriseTargetsConfigured: () => set((state) => ({
        enterpriseTargets: {
          ...state.enterpriseTargets,
          isConfigured: true,
          lastUpdatedAt: Date.now(),
        }
      })),

      // Tasks
      addTask: (name) => {
        const taskId = generateId();
        set((state) => ({
          tasks: [...state.tasks, {
            id: taskId,
            name,
            temporalite: 'quotidien' as Temporality,
            hoursPerWeek: 4,
            resilience: {
              donnees: 0,  // Pas de valeur par défaut - l'utilisateur doit évaluer
              decision: 0,
              relationnel: 0,
              creativite: 0,
              execution: 0,
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

      // Talents
      initializeTalents: () => set({
        talents: STRATEGIC_ASSETS.map((t) => ({
          ...t,
          level: 1,  // Pas de valeur par défaut élevée - l'utilisateur doit évaluer
          selected: false,
        }))
      }),
      toggleTalent: (id) => set((state) => {
        const selectedCount = state.talents.filter(t => t.selected).length;
        const talent = state.talents.find(t => t.id === id);
        
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
        
        let totalWeight = 0;
        let weightedSum = 0;

        tasks.forEach(task => {
          const taskScore = (
            task.resilience.donnees +
            task.resilience.decision +
            task.resilience.relationnel +
            task.resilience.creativite +
            task.resilience.execution
          ) / 5;

          const weight = task.hoursPerWeek;
          weightedSum += taskScore * weight;
          totalWeight += weight;
        });

        return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
      },
      
      getTalentScore: () => {
        const selectedTalents = get().getSelectedTalents();
        if (selectedTalents.length === 0) return 0;
        
        const totalLevel = selectedTalents.reduce((acc, t) => acc + t.level, 0);
        return Math.round((totalLevel / (selectedTalents.length * 5)) * 100);
      },

      // Strategy Generation
      generateStrategy: () => {
        const state = get();
        const { goal, persona } = state.context;
        const resilienceScore = state.getResilienceScore();
        const talentScore = state.getTalentScore();
        const selectedTalents = state.getSelectedTalents();
        
        // Récupérer le Portrait de Mutation (pour Pivot)
        const intention = goal === 'pivot' ? state.userIntention : undefined;
        
        // Générer les actions ERAC (avec Zone de Rejet pour Pivot)
        const eracActions = generateERACActions(state.tasks, goal, intention);

        // Générer la Value Curve
        const valueCurve = generateValueCurve(state.tasks, state.talents, goal);

        // Générer les opportunités de niche (avec métiers idéaux pour Pivot)
        const opportunitesNiche = generateNicheOpportunities(state.talents, goal, persona, intention);

        // Générer l'Ikigai Stratégique (avec passions pour Pivot)
        const ikigai = generateIkigai(state.tasks, state.talents, state.software, opportunitesNiche, intention);

        // Générer le Business Model You
        const businessModel = generateBusinessModel(state.talents, state.tasks, state.context, goal);

        // Générer le Gap Analysis (seulement pour Pivot)
        const gapAnalysis = goal === 'pivot'
          ? generateGapAnalysis(state.tasks, state.talents, state.context, opportunitesNiche[0] || null)
          : null;

        // Générer la Roadmap (avec Portrait Humain pour Pivot)
        const roadmap = generateRoadmap(state.tasks, state.talents, state.software, goal, eracActions, intention);

        // Calculs agrégés
        const techBonus = state.software.reduce((acc, s) => {
          return acc + (s.level === 'expert' ? 20 : s.level === 'avance' ? 12 : 5);
        }, 0);
        const capitalActif = Math.min(100, talentScore + Math.round(techBonus / 3));
        const zoneRisque = 100 - resilienceScore;
        
        set({
          strategy: {
            ikigai,
            eracActions,
            valueCurve,
            businessModel,
            gapAnalysis,
            opportunitesNiche,
            roadmap,
            generatedAt: Date.now(),
            parcours: goal,
            capitalActif,
            zoneRisque,
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

      // ===============================================
      // PHANTOM CHARGE (Scanner de Charge Fantôme)
      // ===============================================
      
      setPhantomCharge: (data) => set((state) => ({
        phantomCharge: { ...state.phantomCharge, ...data }
      })),
      
      updatePhantomChargeFlux: (auto, basNiveau, strategique) => set((state) => ({
        phantomCharge: {
          ...state.phantomCharge,
          fluxAuto: auto,
          fluxBasNiveau: basNiveau,
          fluxStrategique: strategique,
        }
      })),
      
      togglePhantomChargeEnabled: () => set((state) => ({
        phantomCharge: {
          ...state.phantomCharge,
          isEnabled: !state.phantomCharge.isEnabled,
        }
      })),
      
      getPhantomChargeGain: () => {
        const { phantomCharge } = get();
        
        // Temps quotidien total en minutes (heures * 60 + minutes)
        const dailyTotalMinutes = (phantomCharge.dailyHours || 0) * 60 + (phantomCharge.dailyMinutes || 0);
        
        // Temps hebdomadaire (× 5 jours ouvrés)
        const weeklyTotalMinutes = dailyTotalMinutes * 5;
        const weeklyTotalHours = weeklyTotalMinutes / 60;
        
        // Gisement de temps (ROI IA) basé sur les coefficients
        const pAuto = phantomCharge.fluxAuto / 100;
        const pBas = phantomCharge.fluxBasNiveau / 100;
        const pStrat = phantomCharge.fluxStrategique / 100;
        
        const potentialGainMinutes = weeklyTotalMinutes * (
          pAuto * AI_REDUCTION_COEFFICIENTS.auto +
          pBas * AI_REDUCTION_COEFFICIENTS.basNiveau +
          pStrat * AI_REDUCTION_COEFFICIENTS.strategique
        );
        
        const weeklyHours = potentialGainMinutes / 60;
        const monthlyHours = weeklyHours * 4;
        const isSignificant = weeklyHours >= 2; // > 2h/semaine
        
        return { weeklyHours, weeklyTotalHours, monthlyHours, isSignificant };
      },

      // Calcul des KPIs automatiques
      computeKPIs: () => {
        const state = get();
        const { tasks, talents, context, strategy } = state;
        
        // Temps total des tâches
        const totalHoursPerWeek = tasks.reduce((acc, t) => acc + t.hoursPerWeek, 0);
        
        // Temps libérable via ERAC
        const timeFreed = strategy.eracActions
          .filter(a => a.category === 'eliminate' || a.category === 'reduce')
          .reduce((acc, a) => acc + (a.timeFreed || 0), 0);
        
        // Score de résilience moyen
        const avgResilience = tasks.length > 0
          ? tasks.reduce((acc, t) => {
              const taskAvg = (t.resilience.donnees + t.resilience.decision + t.resilience.relationnel + t.resilience.creativite + t.resilience.execution) / 5;
              return acc + taskAvg;
            }, 0) / tasks.length
          : 50;
        
        // Nombre de talents sélectionnés et niveau moyen
        const selectedTalents = talents.filter(t => t.selected);
        const avgTalentLevel = selectedTalents.length > 0
          ? selectedTalents.reduce((acc, t) => acc + t.level, 0) / selectedTalents.length
          : 0;
        
        // Calcul des KPIs
        const productivityGainPercent = totalHoursPerWeek > 0
          ? Math.round((timeFreed / totalHoursPerWeek) * 100)
          : 0;
        
        const timeROI = timeFreed * 52; // Heures par an
        
        const riskReductionScore = Math.min(100, Math.round(
          avgResilience * 0.4 + 
          (selectedTalents.length * 5) + 
          (avgTalentLevel * 10)
        ));
        
        const marketPositioningScore = Math.round(
          (strategy.ikigai.alignmentScore * 0.4) +
          (avgTalentLevel * 12) +
          (selectedTalents.length * 3)
        );
        
        const transitionReadinessScore = context.goal === 'pivot' && strategy.gapAnalysis
          ? strategy.gapAnalysis.viabilityScore
          : Math.round(productivityGainPercent * 0.5 + riskReductionScore * 0.5);
        
        set({
          computedKPIs: {
            productivityGainPercent,
            timeROI,
            riskReductionScore: Math.min(100, riskReductionScore),
            marketPositioningScore: Math.min(100, marketPositioningScore),
            transitionReadinessScore: Math.min(100, transitionReadinessScore),
          }
        });
      },

      // Reset
      reset: () => set({
        currentStep: 1,
        context: initialContext,
        tasks: [],
        talents: STRATEGIC_ASSETS.map((t) => ({
          ...t,
          level: 1,  // Pas de valeur par défaut élevée - l'utilisateur doit évaluer
          selected: false,
        })),
        software: [],
        strategy: initialStrategy,
        computedKPIs: initialKPIs,
        userIntention: initialUserIntention,
        cohortData: initialCohortData,
        enterpriseTargets: initialEnterpriseTargets,
        phantomCharge: initialPhantomCharge,
      }),
    }),
    {
      name: 'apex-audit-storage-v9', // Version bump pour Scanner de Charge Fantôme
      partialize: (state) => ({
        currentStep: state.currentStep,
        context: state.context,
        tasks: state.tasks,
        talents: state.talents,
        software: state.software,
        strategy: state.strategy,
        userIntention: state.userIntention,
        cohortData: state.cohortData,
        phantomCharge: state.phantomCharge,
        enterpriseTargets: state.enterpriseTargets,
      }),
    }
  )
);
