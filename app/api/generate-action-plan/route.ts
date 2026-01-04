// ============================================================================
// API Route : LLM #3 - Génération du Plan d'Action
// Génère une roadmap détaillée avec tâches et micro-tâches
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { 
  SYSTEM_PROMPT_GENERATE_ACTION_PLAN, 
  buildActionPlanPrompt,
  ActionPlanInput 
} from '@/lib/prompts/generate-action-plan';

// ============================================================================
// CONFIGURATION LLM - Gemini Flash
// Pour le plan d'action, on pourrait utiliser un modèle plus puissant
// mais Gemini Flash est suffisant pour cette tâche
// ============================================================================

async function callGemini(apiKey: string, userPrompt: string): Promise<unknown> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT_GENERATE_ACTION_PLAN + '\n\n' + userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.5, // Plus créatif pour les recommandations
          maxOutputTokens: 8192, // Plus long pour le plan détaillé
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textContent) {
    throw new Error('No content in Gemini response');
  }

  return JSON.parse(textContent);
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { locale = 'fr', ...input } = body as ActionPlanInput & { locale?: string };

    // Validation minimale
    if (!input.jobTitle || !input.sector || !input.goal) {
      return NextResponse.json(
        { error: 'Données insuffisantes pour générer le plan' },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée' },
        { status: 500 }
      );
    }

    // Construire le prompt avec la locale
    const userPrompt = buildActionPlanPrompt(input, locale);

    // Appeler le LLM
    const actionPlan = await callGemini(geminiApiKey, userPrompt);

    return NextResponse.json({
      success: true,
      actionPlan,
      model: 'gemini-2.0-flash',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating action plan:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du plan',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

