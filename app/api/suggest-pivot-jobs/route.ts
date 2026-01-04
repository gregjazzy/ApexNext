// ============================================================================
// API Route : LLM #4 - Suggestions de Métiers pour Pivot
// Propose des métiers résilients basés sur le profil de l'utilisateur
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { 
  SYSTEM_PROMPT_SUGGEST_PIVOT, 
  buildPivotSuggestionPrompt,
  PivotSuggestionInput 
} from '@/lib/prompts/suggest-pivot-jobs';

// ============================================================================
// CONFIGURATION LLM - Gemini Flash
// Pour les suggestions de pivot, la créativité est importante
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
              { text: SYSTEM_PROMPT_SUGGEST_PIVOT + '\n\n' + userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.6, // Plus créatif pour les suggestions surprenantes
          maxOutputTokens: 6144,
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
    const input: PivotSuggestionInput = await req.json();

    // Validation minimale
    if (!input.currentJob || !input.currentSector) {
      return NextResponse.json(
        { error: 'Données insuffisantes pour les suggestions' },
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

    // Construire le prompt
    const userPrompt = buildPivotSuggestionPrompt(input);

    // Appeler le LLM
    const suggestions = await callGemini(geminiApiKey, userPrompt);

    return NextResponse.json({
      success: true,
      suggestions,
      model: 'gemini-2.0-flash',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error suggesting pivot jobs:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors des suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

