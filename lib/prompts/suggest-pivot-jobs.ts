// ============================================================================
// LLM #4 : PROPOSITIONS DE MÉTIERS POUR PIVOT
// Appelé dans Step 8 si l'utilisateur est en mode "pivot"
// Input: Profil complet de l'utilisateur (compétences, talents, secteur)
// Output: Métiers résilients proposés avec justification
// ============================================================================

export const SYSTEM_PROMPT_SUGGEST_PIVOT = `
Tu es un Expert en Reconversion Professionnelle et Prospective des Métiers.
Ton rôle est de proposer des MÉTIERS D'AVENIR basés sur le profil d'une personne.

PHILOSOPHIE APEX :
"On ne suit pas les envies naïves. On propose des métiers RÉSILIENTS basés sur les DONNÉES."

CONTEXTE 2026 :
- 40% des métiers actuels seront transformés par l'IA
- Les métiers qui RÉSISTENT : relationnel complexe, geste technique, décision éthique
- Les métiers qui EXPLOSENT : supervision IA, médiation humain-machine, expertise augmentée

TON APPROCHE :
1. Analyse les VRAIES compétences (pas les titres de poste)
2. Identifie les PATTERNS transférables
3. Propose des métiers que la personne n'aurait PAS pensé elle-même
4. Justifie chaque proposition avec des DONNÉES

RÈGLES :
- Propose 3-5 métiers DIFFÉRENTS (pas des variations du même)
- Au moins 1 métier "surprise" (non évident depuis le profil)
- Chaque métier doit avoir un score de résilience > 70%
- Inclus le CHEMIN pour y arriver (pas juste le nom)

FORMAT DE SORTIE (JSON strict) :
{
  "analysis_summary": {
    "transferable_skills": ["Compétence 1", "Compétence 2"],
    "hidden_strengths": "Force cachée identifiée dans le profil",
    "market_positioning": "Comment ce profil se positionne sur le marché"
  },
  
  "proposed_jobs": [
    {
      "job_title": "Titre du métier proposé",
      "sector": "Secteur recommandé",
      "resilience_score": 85,
      "match_score": 78,
      
      "why_this_job": {
        "from_skills": "Quelles compétences actuelles sont transférables",
        "from_talents": "Quels talents correspondent",
        "market_demand": "Pourquoi ce métier est demandé"
      },
      
      "resilience_factors": [
        "Facteur de résilience 1",
        "Facteur de résilience 2"
      ],
      
      "transition_path": {
        "difficulty": "easy | medium | hard",
        "estimated_duration": "Durée estimée (ex: 6-12 mois)",
        "key_steps": [
          "Étape 1",
          "Étape 2",
          "Étape 3"
        ],
        "required_training": ["Formation 1", "Formation 2"],
        "quick_start": "Action à faire cette semaine pour commencer"
      },
      
      "salary_range": {
        "entry": "Salaire entrée",
        "experienced": "Salaire avec expérience",
        "trend": "up | stable | down"
      },
      
      "daily_reality": "Description d'une journée type (2-3 phrases)",
      
      "warning": "Point de vigilance ou difficulté à anticiper"
    }
  ],
  
  "surprise_recommendation": {
    "job_title": "Métier inattendu mais pertinent",
    "why_surprising": "Pourquoi ça semble contre-intuitif",
    "why_perfect": "Pourquoi c'est en fait idéal pour ce profil"
  },
  
  "avoid_these": [
    {
      "job_title": "Métier à éviter",
      "why": "Pourquoi ce serait une erreur"
    }
  ],
  
  "next_step": "Action concrète à faire maintenant pour avancer"
}
`;

export interface PivotSuggestionInput {
  // Profil actuel
  currentJob: string;
  currentSector: string;
  yearsExperience?: string;
  
  // Compétences identifiées
  skills: Array<{
    name: string;
    level: number; // 1-5
    transferable: boolean;
  }>;
  
  // Talents
  talents: Array<{
    name: string;
    category: string;
    level: number;
  }>;
  
  // Tâches résilientes (ce qu'il fait bien et qui résiste à l'IA)
  resilientTasks: Array<{
    name: string;
    resilienceScore: number;
  }>;
  
  // Ikigai (si complété)
  ikigai?: {
    passions: string[];
    skills: string[];
    worldNeeds: string[];
    paidFor: string[];
  };
  
  // Préférences (optionnel - on ne suit pas aveuglément)
  preferences?: {
    desiredSectors?: string[];
    constraints?: string[]; // ex: "pas de déplacement", "télétravail"
    salaryExpectation?: string;
  };
  
  // Scores du diagnostic
  scores: {
    globalResilience: number;
    talentSignature: number;
  };
}

export const buildPivotSuggestionPrompt = (input: PivotSuggestionInput): string => {
  const skillsList = input.skills
    .map(s => `- ${s.name} (niveau ${s.level}/5${s.transferable ? ', transférable' : ''})`)
    .join('\n');
  
  const talentsList = input.talents
    .map(t => `- ${t.name} (${t.category}, niveau ${t.level}/5)`)
    .join('\n');
  
  const resilientTasksList = input.resilientTasks
    .map(t => `- ${t.name} (${t.resilienceScore}% résilience)`)
    .join('\n');

  let ikigaiSection = '';
  if (input.ikigai) {
    ikigaiSection = `
IKIGAI (ce que la personne a identifié) :
- Passions : ${input.ikigai.passions.join(', ')}
- Savoir-faire : ${input.ikigai.skills.join(', ')}
- Besoins du monde : ${input.ikigai.worldNeeds.join(', ')}
- Rémunérable : ${input.ikigai.paidFor.join(', ')}

ATTENTION : L'Ikigai reflète les ENVIES, pas forcément les meilleures OPTIONS.
Propose des métiers basés sur les DONNÉES, pas seulement sur les envies.
`;
  }

  let preferencesSection = '';
  if (input.preferences) {
    preferencesSection = `
PRÉFÉRENCES EXPRIMÉES (à considérer mais pas à suivre aveuglément) :
${input.preferences.desiredSectors ? `- Secteurs souhaités : ${input.preferences.desiredSectors.join(', ')}` : ''}
${input.preferences.constraints ? `- Contraintes : ${input.preferences.constraints.join(', ')}` : ''}
${input.preferences.salaryExpectation ? `- Attente salariale : ${input.preferences.salaryExpectation}` : ''}
`;
  }

  return `
PROFIL À ANALYSER POUR RECONVERSION :

SITUATION ACTUELLE :
- Poste : ${input.currentJob}
- Secteur : ${input.currentSector}
- Expérience : ${input.yearsExperience || 'Non précisé'}
- Score de résilience actuel : ${input.scores.globalResilience}%
- Force de signature : ${input.scores.talentSignature}%

COMPÉTENCES :
${skillsList}

TALENTS NATURELS :
${talentsList}

TÂCHES OÙ IL/ELLE EXCELLE (résilientes à l'IA) :
${resilientTasksList}
${ikigaiSection}
${preferencesSection}

MISSION :
Propose 3-5 métiers d'avenir RÉSILIENTS à l'IA.
Base-toi sur les DONNÉES du profil, pas sur les envies naïves.
Inclus au moins 1 suggestion "surprise" que la personne n'aurait pas envisagée.
Pour chaque métier, donne le CHEMIN concret pour y arriver.
`;
};

