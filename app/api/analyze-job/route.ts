import { NextRequest, NextResponse } from 'next/server';

// Structure des tâches suggérées par l'IA
export interface SuggestedTask {
  name: string;
  hoursPerWeek: number;
  temporalite: 'quotidien' | 'hebdomadaire' | 'mensuel' | 'strategique';
  resilience: {
    donnees: number;
    decision: number;
    relationnel: number;
    creativite: number;
    execution: number;
  };
}

export interface AnalyzeJobResponse {
  success: boolean;
  tasks: SuggestedTask[];
  summary?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, jobTitle, industry, persona } = await request.json();

    // Validation
    if (!jobDescription || jobDescription.trim().length < 50) {
      return NextResponse.json({
        success: false,
        tasks: [],
        error: 'Description trop courte. Ajoutez plus de détails sur vos missions.',
      } as AnalyzeJobResponse);
    }

    // ===========================================
    // TODO: Intégrer l'IA ici (OpenAI ou Anthropic)
    // ===========================================
    // Pour l'instant, retourne des données mock
    // L'IA analysera: jobDescription, jobTitle, industry, persona
    // Et retournera des tâches personnalisées

    // Mock: Tâches génériques basées sur le persona
    const mockTasks: SuggestedTask[] = getMockTasks(persona, jobTitle);

    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      tasks: mockTasks,
      summary: `Analyse basée sur le profil "${persona}" et le poste "${jobTitle}". ${mockTasks.length} tâches identifiées.`,
    } as AnalyzeJobResponse);

  } catch (error) {
    console.error('Error analyzing job:', error);
    return NextResponse.json({
      success: false,
      tasks: [],
      error: 'Erreur lors de l\'analyse. Veuillez réessayer.',
    } as AnalyzeJobResponse, { status: 500 });
  }
}

// Mock data - sera remplacé par l'IA
function getMockTasks(persona: string, jobTitle: string): SuggestedTask[] {
  const baseTasks: Record<string, SuggestedTask[]> = {
    salarie: [
      {
        name: 'Réunions d\'équipe et coordination',
        hoursPerWeek: 6,
        temporalite: 'quotidien',
        resilience: { donnees: 30, decision: 45, relationnel: 85, creativite: 25, execution: 20 },
      },
      {
        name: 'Reporting et suivi KPIs',
        hoursPerWeek: 4,
        temporalite: 'hebdomadaire',
        resilience: { donnees: 15, decision: 35, relationnel: 25, creativite: 20, execution: 10 },
      },
      {
        name: 'Rédaction de documents et emails',
        hoursPerWeek: 5,
        temporalite: 'quotidien',
        resilience: { donnees: 25, decision: 30, relationnel: 40, creativite: 35, execution: 15 },
      },
      {
        name: 'Analyse de données et problèmes',
        hoursPerWeek: 8,
        temporalite: 'quotidien',
        resilience: { donnees: 35, decision: 60, relationnel: 30, creativite: 55, execution: 25 },
      },
      {
        name: 'Gestion de projets transverses',
        hoursPerWeek: 6,
        temporalite: 'hebdomadaire',
        resilience: { donnees: 40, decision: 70, relationnel: 75, creativite: 50, execution: 30 },
      },
    ],
    freelance: [
      {
        name: 'Prospection et acquisition clients',
        hoursPerWeek: 5,
        temporalite: 'hebdomadaire',
        resilience: { donnees: 35, decision: 65, relationnel: 90, creativite: 60, execution: 25 },
      },
      {
        name: 'Réalisation des livrables clients',
        hoursPerWeek: 15,
        temporalite: 'quotidien',
        resilience: { donnees: 40, decision: 55, relationnel: 45, creativite: 65, execution: 35 },
      },
      {
        name: 'Administration et facturation',
        hoursPerWeek: 3,
        temporalite: 'hebdomadaire',
        resilience: { donnees: 15, decision: 25, relationnel: 20, creativite: 10, execution: 10 },
      },
      {
        name: 'Veille et formation continue',
        hoursPerWeek: 4,
        temporalite: 'hebdomadaire',
        resilience: { donnees: 30, decision: 50, relationnel: 25, creativite: 70, execution: 20 },
      },
    ],
    leader: [
      {
        name: 'Management et 1:1 équipe',
        hoursPerWeek: 8,
        temporalite: 'quotidien',
        resilience: { donnees: 25, decision: 75, relationnel: 95, creativite: 45, execution: 15 },
      },
      {
        name: 'Pilotage stratégique et arbitrages',
        hoursPerWeek: 6,
        temporalite: 'hebdomadaire',
        resilience: { donnees: 45, decision: 90, relationnel: 70, creativite: 65, execution: 20 },
      },
      {
        name: 'Comités et reporting direction',
        hoursPerWeek: 5,
        temporalite: 'hebdomadaire',
        resilience: { donnees: 30, decision: 60, relationnel: 80, creativite: 35, execution: 15 },
      },
      {
        name: 'Recrutement et développement talents',
        hoursPerWeek: 4,
        temporalite: 'mensuel',
        resilience: { donnees: 35, decision: 80, relationnel: 90, creativite: 55, execution: 25 },
      },
      {
        name: 'Gestion budgétaire et ressources',
        hoursPerWeek: 3,
        temporalite: 'mensuel',
        resilience: { donnees: 25, decision: 70, relationnel: 40, creativite: 30, execution: 15 },
      },
    ],
  };

  return baseTasks[persona] || baseTasks.salarie;
}

