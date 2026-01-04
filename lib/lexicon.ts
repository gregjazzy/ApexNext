import { Persona, Goal } from './store';

// Dynamic UI Lexicon based on Persona
export interface LexiconEntry {
  salarie: string;
  freelance: string;
  leader: string;
}

export interface GoalDescription {
  salarie: string;
  freelance: string;
  leader: string;
}

// Step 1 - Matrix Expert Wording (Strategy Consulting Level)
export const matrixLexicon = {
  title: {
    fr: "Initialisation Stratégique",
    en: "Strategic Initialization"
  },
  subtitle: {
    fr: "Configurez votre prisme d'analyse pour un audit de précision.",
    en: "Configure your analysis prism for a precision audit."
  },
  goals: {
    augmentation: {
      title: {
        salarie: { fr: "Réduisez votre risque IA", en: "Reduce your AI risk" },
        freelance: { fr: "Scalabilité de la Valeur", en: "Value Scalability" },
        leader: { fr: "Audit d'Efficience Opérationnelle", en: "Operational Efficiency Audit" }
      },
      description: {
        salarie: {
          fr: "Transformez votre poste pour rester indispensable.",
          en: "Transform your role to stay indispensable."
        },
        freelance: {
          fr: "Passer de l'exécution concurrencée à une offre de conseil expert à haute marge.",
          en: "Move from competitive execution to a high-margin expert consulting offering."
        },
        leader: {
          fr: "Redéfinir l'architecture des postes pour maximiser la performance globale.",
          en: "Redefine position architecture to maximize overall performance."
        }
      }
    },
    pivot: {
      title: {
        salarie: { fr: "Pivot Stratégique Haute-Valeur", en: "High-Value Strategic Pivot" },
        freelance: { fr: "Mutation du Modèle d'Affaires", en: "Business Model Transformation" },
        leader: { fr: "PSE & Reclassement — Cohorte Pivot", en: "Restructuring & Outplacement — Pivot Cohort" }
      },
      description: {
        salarie: {
          fr: "Identifier une reconversion vers des fonctions critiques non-automatisables.",
          en: "Identify a reconversion toward critical non-automatable functions."
        },
        freelance: {
          fr: "Réaligner votre structure sur les besoins critiques d'un marché transformé.",
          en: "Realign your structure with the critical needs of a transformed market."
        },
        leader: {
          fr: "Pilotez la transition de vos collaborateurs. Préparez les dossiers avec leur diagnostic Pivot.",
          en: "Manage your employees' transition. Prepare documentation with their Pivot diagnostic."
        }
      }
    },
    reclassement: {
      title: {
        salarie: { fr: "Reclassement Professionnel", en: "Professional Reclassification" },
        freelance: { fr: "Repositionnement Marché", en: "Market Repositioning" },
        leader: { fr: "Job Designer — PSE & Restructuration", en: "Job Designer — Restructuring & Outplacement" }
      },
      description: {
        salarie: {
          fr: "Accompagnement vers une nouvelle fonction suite à une réorganisation.",
          en: "Support toward a new role following a reorganization."
        },
        freelance: {
          fr: "Repositionnez votre offre sur un segment plus résilient.",
          en: "Reposition your offering on a more resilient segment."
        },
        leader: {
          fr: "Architecturez les postes de demain et pilotez le matching avec vos équipes.",
          en: "Design tomorrow's positions and manage matching with your teams."
        }
      }
    }
  },
  launchButton: {
    fr: "Lancer le Deep Audit →",
    en: "Launch Deep Audit →"
  }
};

// Step 2 - Context Mapping Lexicon
export const contextLexicon = {
  title: {
    salarie: { fr: "Analyse du Poste Actuel", en: "Current Position Analysis" },
    freelance: { fr: "Audit d'Activité", en: "Activity Audit" },
    leader: { fr: "Mapping de Structure", en: "Structure Mapping" }
  },
  subtitle: {
    salarie: { 
      fr: "Décrivez votre environnement professionnel pour calibrer l'analyse.", 
      en: "Describe your professional environment to calibrate the analysis." 
    },
    freelance: { 
      fr: "Cartographiez votre activité pour identifier les leviers d'optimisation.", 
      en: "Map your activity to identify optimization levers." 
    },
    leader: { 
      fr: "Modélisez votre périmètre managérial pour un audit systémique.", 
      en: "Model your managerial scope for a systemic audit." 
    }
  },
  jobLabel: {
    salarie: { fr: "Intitulé du Poste", en: "Job Title" },
    freelance: { fr: "Cœur de Métier / Offre", en: "Core Business / Offering" },
    leader: { fr: "Périmètre Managérial", en: "Managerial Scope" }
  },
  jobPlaceholder: {
    salarie: { fr: "ex: Analyste financier, Chef de projet...", en: "e.g.: Financial Analyst, Project Manager..." },
    freelance: { fr: "ex: Consultant Growth, Coach Agile...", en: "e.g.: Growth Consultant, Agile Coach..." },
    leader: { fr: "ex: Direction Marketing, DRH...", en: "e.g.: Marketing Director, HR Director..." }
  },
  descriptionLabel: {
    salarie: { fr: "Fiche de poste", en: "Job Description" },
    freelance: { fr: "Catalogue de services", en: "Services Catalog" },
    leader: { fr: "Périmètre de la Business Unit", en: "Business Unit Scope" }
  },
  industryLabel: {
    salarie: { fr: "Secteur d'activité", en: "Industry" },
    freelance: { fr: "Secteur d'activité", en: "Industry" },
    leader: { fr: "Secteur d'activité", en: "Industry" }
  }
};

// Step 3 - Tasks Audit Lexicon
export const tasksLexicon = {
  title: {
    salarie: { fr: "Audit Temporel", en: "Temporal Audit" },
    freelance: { fr: "Décomposition Opérationnelle", en: "Operational Breakdown" },
    leader: { fr: "Revue des Processus", en: "Process Review" }
  },
  subtitle: {
    salarie: { 
      fr: "Listez vos tâches principales et évaluez leur vulnérabilité.", 
      en: "List your main tasks and assess their vulnerability." 
    },
    freelance: { 
      fr: "Décomposez vos livrables pour identifier les zones d'automatisation.", 
      en: "Break down your deliverables to identify automation zones." 
    },
    leader: { 
      fr: "Cartographiez les flux de travail de votre équipe.", 
      en: "Map your team's workflows." 
    }
  },
  taskLabel: {
    salarie: { fr: "Tâche", en: "Task" },
    freelance: { fr: "Opération / Livrable", en: "Operation / Deliverable" },
    leader: { fr: "Flux de Travail", en: "Workflow" }
  },
  addTaskLabel: {
    salarie: { fr: "Ajouter une tâche", en: "Add a task" },
    freelance: { fr: "Ajouter une opération", en: "Add an operation" },
    leader: { fr: "Ajouter un flux", en: "Add a workflow" }
  },
  taskPlaceholder: {
    salarie: { fr: "ex: Rédaction de rapports, Réunions...", en: "e.g.: Report writing, Meetings..." },
    freelance: { fr: "ex: Audit client, Livrable mensuel...", en: "e.g.: Client audit, Monthly deliverable..." },
    leader: { fr: "ex: Validation budgets, Recrutement...", en: "e.g.: Budget validation, Recruitment..." }
  },
  noTasksMessage: {
    salarie: { fr: "Ajoutez au moins une tâche pour continuer", en: "Add at least one task to continue" },
    freelance: { fr: "Ajoutez au moins une opération pour continuer", en: "Add at least one operation to continue" },
    leader: { fr: "Ajoutez au moins un flux pour continuer", en: "Add at least one workflow to continue" }
  },
  registeredLabel: {
    salarie: { fr: "tâche(s) enregistrée(s)", en: "task(s) registered" },
    freelance: { fr: "opération(s) enregistrée(s)", en: "operation(s) registered" },
    leader: { fr: "flux enregistré(s)", en: "workflow(s) registered" }
  }
};

// Step 4 - Strategic Assets Lexicon (12 Actifs Stratégiques)
export const talentsLexicon = {
  title: {
    salarie: { fr: "Inventaire des Actifs Stratégiques", en: "Strategic Assets Inventory" },
    freelance: { fr: "Capital Stratégique", en: "Strategic Capital" },
    leader: { fr: "Profil de Leadership Stratégique", en: "Strategic Leadership Profile" }
  },
  subtitle: {
    salarie: { 
      fr: "Sélectionnez vos 5 actifs majeurs parmi les 12 compétences critiques non-automatisables.", 
      en: "Select your 5 major assets from the 12 critical non-automatable skills." 
    },
    freelance: { 
      fr: "Identifiez les 5 actifs stratégiques qui différencient votre offre.", 
      en: "Identify the 5 strategic assets that differentiate your offering." 
    },
    leader: { 
      fr: "Définissez vos 5 actifs clés pour piloter la transformation.", 
      en: "Define your 5 key assets to drive transformation." 
    }
  }
};

// Step 5 - Software Lexicon
export const softwareLexicon = {
  title: {
    salarie: { fr: "Tech Scan", en: "Tech Scan" },
    freelance: { fr: "Stack Professionnel", en: "Professional Stack" },
    leader: { fr: "Écosystème Outils", en: "Tools Ecosystem" }
  },
  subtitle: {
    salarie: { 
      fr: "Identifiez vos 3 outils principaux et votre niveau de maîtrise.", 
      en: "Identify your 3 main tools and your mastery level." 
    },
    freelance: { 
      fr: "Listez les outils clés de votre activité et votre expertise.", 
      en: "List the key tools of your business and your expertise." 
    },
    leader: { 
      fr: "Évaluez l'adoption technologique de votre périmètre.", 
      en: "Assess the technological adoption of your scope." 
    }
  }
};

// Step 6 - Verdict Lexicon
export const verdictLexicon = {
  title: {
    salarie: { fr: "Le Verdict", en: "The Verdict" },
    freelance: { fr: "Bilan Stratégique", en: "Strategic Assessment" },
    leader: { fr: "Diagnostic Global", en: "Global Diagnostic" }
  },
  subtitle: {
    salarie: { 
      fr: "Votre diagnostic de résilience face à l'automatisation.", 
      en: "Your automation resilience diagnostic." 
    },
    freelance: { 
      fr: "Analyse de votre positionnement et potentiel d'optimisation.", 
      en: "Analysis of your positioning and optimization potential." 
    },
    leader: { 
      fr: "Vision systémique de la résilience de votre périmètre.", 
      en: "Systemic vision of your scope's resilience." 
    }
  }
};

// Persona Labels
export const personaLabels = {
  salarie: { fr: "Salarié", en: "Employee" },
  freelance: { fr: "Freelance", en: "Freelance" },
  leader: { fr: "Leader / RH", en: "Leader / HR" }
};

// Helper function to get lexicon value based on persona and locale
export function getLexiconValue(
  lexiconEntry: { salarie: { fr: string; en: string }; freelance: { fr: string; en: string }; leader: { fr: string; en: string } },
  persona: Persona,
  locale: string
): string {
  const personaKey = persona || 'salarie';
  const localeKey = locale === 'en' ? 'en' : 'fr';
  return lexiconEntry[personaKey as keyof typeof lexiconEntry][localeKey];
}

// Helper for goal title (now dynamic per persona)
export function getGoalTitle(
  goal: Goal,
  persona: Persona,
  locale: string
): string {
  if (!goal) return '';
  const localeKey = locale === 'en' ? 'en' : 'fr';
  const personaKey = persona || 'salarie';
  return matrixLexicon.goals[goal].title[personaKey as 'salarie' | 'freelance' | 'leader'][localeKey];
}

// Helper for goal descriptions
export function getGoalDescription(
  goal: Goal,
  persona: Persona,
  locale: string
): string {
  if (!goal || !persona) return '';
  const localeKey = locale === 'en' ? 'en' : 'fr';
  const personaKey = persona as 'salarie' | 'freelance' | 'leader';
  return matrixLexicon.goals[goal].description[personaKey][localeKey];
}

