// ============================================================================
// LLM #3 : GÉNÉRATION DU PLAN D'ACTION
// Appelé après Step 7 (Ikigai) pour générer la roadmap détaillée
// Input: Diagnostic complet + Ikigai + Objectif
// Output: Plan d'action avec tâches et micro-tâches
// ============================================================================

export const SYSTEM_PROMPT_GENERATE_ACTION_PLAN = `
Tu es un Coach de Transformation Professionnelle spécialisé dans l'adaptation à l'IA.
Ton rôle est de créer des PLANS D'ACTION CONCRETS et EXÉCUTABLES.

PHILOSOPHIE APEX :
"On ne donne pas des conseils bullshit. On donne un GPS avec des étapes précises."

TON STYLE :
- CONCRET : Chaque action doit être faisable cette semaine
- MESURABLE : On doit pouvoir cocher "fait" ou "pas fait"
- PROGRESSIF : Du plus simple au plus complexe
- RÉALISTE : Adapté au temps disponible d'un professionnel actif

RÈGLES ABSOLUES :
1. Chaque action principale a 3-5 micro-tâches
2. Les micro-tâches prennent MAX 30 minutes chacune
3. Inclus des outils/ressources SPÉCIFIQUES (noms d'outils, liens types)
4. Adapte au SECTEUR et au MÉTIER (utilise le jargon)
5. Priorise : Quick Wins d'abord, transformations profondes ensuite

CATÉGORIES D'ACTIONS :
- DÉFENSE : Protéger les tâches résilientes
- AUGMENTATION : Intégrer l'IA dans les tâches existantes  
- DIFFÉRENCIATION : Développer une signature unique
- VISIBILITÉ : Se positionner comme expert augmenté

FORMAT DE SORTIE (JSON strict) :
{
  "plan_title": "Titre accrocheur du plan personnalisé",
  "plan_duration": "Durée totale estimée (ex: 3 mois)",
  "weekly_commitment": "Temps hebdomadaire requis (ex: 2-3h)",
  
  "phases": [
    {
      "phase_number": 1,
      "phase_name": "Nom de la phase",
      "duration": "Durée (ex: 2 semaines)",
      "objective": "Objectif de la phase en 1 phrase",
      
      "actions": [
        {
          "action_id": "A1",
          "title": "Titre de l'action",
          "category": "DÉFENSE | AUGMENTATION | DIFFÉRENCIATION | VISIBILITÉ",
          "priority": "P1 | P2 | P3",
          "estimated_time": "Temps total estimé",
          "why": "Pourquoi cette action est cruciale (1 phrase)",
          
          "micro_tasks": [
            {
              "task_id": "A1.1",
              "description": "Description précise de la micro-tâche",
              "duration": "15-30 min",
              "deliverable": "Ce qui doit être produit/fait",
              "tools": ["Outil 1", "Outil 2"],
              "tip": "Conseil pratique optionnel"
            }
          ],
          
          "success_criteria": "Comment savoir que c'est réussi",
          "next_step": "Ce que ça débloque"
        }
      ]
    }
  ],
  
  "quick_wins": [
    {
      "action": "Action rapide à faire aujourd'hui",
      "time": "Temps requis",
      "impact": "Impact immédiat"
    }
  ],
  
  "tools_stack": [
    {
      "category": "Catégorie d'outil",
      "recommended": "Nom de l'outil",
      "why": "Pourquoi cet outil",
      "alternative": "Alternative gratuite/moins chère"
    }
  ],
  
  "kpis": [
    {
      "metric": "Métrique à suivre",
      "target": "Objectif",
      "timeframe": "Délai"
    }
  ],
  
  "motivation_message": "Message de motivation personnalisé (2-3 phrases)"
}
`;

export interface ActionPlanInput {
  // Contexte professionnel
  jobTitle: string;
  sector: string;
  yearsExperience?: string;
  
  // Objectif
  goal: 'augmentation' | 'pivot';
  targetRole?: string; // Si pivot, vers quel métier
  
  // Résultats du diagnostic
  vulnerableTasks: Array<{
    name: string;
    resilienceScore: number;
  }>;
  
  resilientTasks: Array<{
    name: string;
    resilienceScore: number;
  }>;
  
  // Talents
  topTalents: Array<{
    name: string;
    level: number;
  }>;
  
  // Ikigai (si complété)
  ikigai?: {
    passions: string[];
    skills: string[];
    worldNeeds: string[];
    paidFor: string[];
  };
  
  // Scores
  scores: {
    globalResilience: number;
    talentSignature: number;
  };
  
  // Temps disponible (Phantom Charge)
  availableTime?: {
    weeklyHoursGained: number;
  };
}

export const buildActionPlanPrompt = (input: ActionPlanInput): string => {
  const vulnerableList = input.vulnerableTasks
    .map(t => `- ${t.name} (${t.resilienceScore}% résilience)`)
    .join('\n');
  
  const resilientList = input.resilientTasks
    .map(t => `- ${t.name} (${t.resilienceScore}% résilience)`)
    .join('\n');
  
  const talentsList = input.topTalents
    .map(t => `- ${t.name} (niveau ${t.level}/5)`)
    .join('\n');

  let ikigaiSection = '';
  if (input.ikigai) {
    ikigaiSection = `
IKIGAI IDENTIFIÉ :
- Ce qui me passionne : ${input.ikigai.passions.join(', ')}
- Ce que je sais faire : ${input.ikigai.skills.join(', ')}
- Ce dont le monde a besoin : ${input.ikigai.worldNeeds.join(', ')}
- Ce pour quoi on me paie : ${input.ikigai.paidFor.join(', ')}
`;
  }

  return `
PROFIL PROFESSIONNEL :
- Poste actuel : ${input.jobTitle}
- Secteur : ${input.sector}
- Expérience : ${input.yearsExperience || 'Non précisé'}
- Objectif : ${input.goal === 'augmentation' ? 'AUGMENTATION - Devenir expert augmenté sur ce poste' : `PIVOT - Transition vers ${input.targetRole || 'un nouveau métier'}`}

DIAGNOSTIC DE VULNÉRABILITÉ :

Tâches VULNÉRABLES à automatiser :
${vulnerableList || 'Aucune identifiée'}

Tâches RÉSILIENTES à protéger :
${resilientList || 'Aucune identifiée'}

SIGNATURE TALENTS :
${talentsList}

SCORES :
- Résilience globale : ${input.scores.globalResilience}%
- Force de la signature : ${input.scores.talentSignature}%
${ikigaiSection}
${input.availableTime ? `
BUDGET TEMPS DISPONIBLE :
- Heures récupérables par semaine grâce à l'IA : ${input.availableTime.weeklyHoursGained}h
(Ce temps peut être réinvesti dans la transformation)
` : ''}

Génère un plan d'action CONCRET et EXÉCUTABLE.
Chaque action doit avoir des micro-tâches de max 30 minutes.
Utilise le vocabulaire du métier "${input.jobTitle}" dans le secteur "${input.sector}".
Priorise les Quick Wins pour créer de la momentum.
`;
};

