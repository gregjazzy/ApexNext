import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT_GENERATE_TASKS, buildUserPrompt } from '@/lib/prompts/generate-tasks';
import { supabase } from '@/lib/supabase';

// ============================================================================
// CONFIGURATION LLM
// Ordre de priorité : Gemini Flash → Gemini Pro → GPT-4o → Claude
// ============================================================================
const LLM_CONFIG = {
  // Gemini Flash = meilleur rapport qualité/prix
  PRIMARY: 'gemini-flash',
  // Fallback si besoin de plus de qualité
  FALLBACK: 'gemini-pro', // ou 'gpt-4o'
} as const;

// Types
interface GenerateTasksRequest {
  jobTitle: string;
  sector: string;
  experience?: number;
  teamSize?: number;
  locale?: string;
}

interface TaskGenerated {
  id: string;
  name: string;
  description: string;
}

interface GenerateTasksResponse {
  job_title_normalized: string;
  sector_normalized: string;
  tasks: TaskGenerated[];
  vocabulaire_metier: string[];
  cached?: boolean;
  model?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTasksRequest = await request.json();
    const { jobTitle, sector, experience, teamSize, locale = 'fr' } = body;

    // Validation
    if (!jobTitle || !sector) {
      return NextResponse.json(
        { error: 'jobTitle et sector sont requis' },
        { status: 400 }
      );
    }

    // 1. Vérifier si on a déjà ce couple en cache (Supabase)
    if (supabase) {
      const { data: cached } = await supabase
        .from('job_packs')
        .select('*')
        .ilike('job_title', `%${jobTitle}%`)
        .ilike('sector', `%${sector}%`)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (cached) {
        // Retourner le cache
        return NextResponse.json({
          job_title_normalized: cached.job_title,
          sector_normalized: cached.sector,
          tasks: cached.current_standard_tasks || [],
          vocabulaire_metier: cached.vocabulaire_metier || [],
          cached: true,
          model: 'cache'
        } as GenerateTasksResponse);
      }
    }

    // 2. Pas de cache → Appeler le LLM
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    if (!geminiApiKey && !openaiApiKey && !anthropicApiKey) {
      return NextResponse.json(
        { error: 'Aucune clé API LLM configurée (GEMINI_API_KEY, OPENAI_API_KEY ou ANTHROPIC_API_KEY)' },
        { status: 500 }
      );
    }

    const userPrompt = buildUserPrompt(jobTitle, sector, experience, teamSize, locale);

    let llmResponse: GenerateTasksResponse;
    let modelUsed: string;

    // Ordre de priorité : Gemini → OpenAI → Claude
    if (geminiApiKey) {
      llmResponse = await callGemini(geminiApiKey, userPrompt, LLM_CONFIG.PRIMARY);
      modelUsed = LLM_CONFIG.PRIMARY;
    } else if (openaiApiKey) {
      llmResponse = await callOpenAI(openaiApiKey, userPrompt);
      modelUsed = 'gpt-4o';
    } else if (anthropicApiKey) {
      llmResponse = await callClaude(anthropicApiKey, userPrompt);
      modelUsed = 'claude-sonnet';
    } else {
      throw new Error('Aucune clé API disponible');
    }

    // 3. Stocker en cache dans Supabase (si configuré)
    if (supabase) {
      const { error: insertError } = await supabase
        .from('job_packs')
        .insert({
          job_title: llmResponse.job_title_normalized,
          sector: llmResponse.sector_normalized,
          current_standard_tasks: llmResponse.tasks,
          vocabulaire_metier: llmResponse.vocabulaire_metier,
          strategic_mutation_axes: [], // Sera rempli par LLM #2
          future_augmented_title: null
        });

      if (insertError) {
        console.error('Erreur insertion Supabase:', insertError);
        // On continue quand même, le cache n'est pas critique
      }
    }

    return NextResponse.json({
      ...llmResponse,
      cached: false,
      model: modelUsed
    });

  } catch (error) {
    console.error('Erreur generate-tasks:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des tâches' },
      { status: 500 }
    );
  }
}

// ============================================================================
// APPEL GEMINI (Google)
// ============================================================================
async function callGemini(
  apiKey: string, 
  userPrompt: string,
  model: 'gemini-flash' | 'gemini-pro' = 'gemini-flash'
): Promise<GenerateTasksResponse> {
  // Mapping des noms de modèles
  const modelMap = {
    'gemini-flash': 'gemini-2.0-flash',
    'gemini-pro': 'gemini-2.0-pro'
  };
  
  const modelId = modelMap[model];
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT_GENERATE_TASKS + '\n\n' + userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur Gemini: ${error}`);
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;

  return parseJsonResponse(content);
}

// ============================================================================
// APPEL CLAUDE (Anthropic)
// ============================================================================
async function callClaude(apiKey: string, userPrompt: string): Promise<GenerateTasksResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT_GENERATE_TASKS,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur Claude: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // Extraire le JSON de la réponse
  return parseJsonResponse(content);
}

// ============================================================================
// APPEL OPENAI
// ============================================================================
async function callOpenAI(apiKey: string, userPrompt: string): Promise<GenerateTasksResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_GENERATE_TASKS },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur OpenAI: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  return parseJsonResponse(content);
}

// ============================================================================
// PARSER JSON
// ============================================================================
function parseJsonResponse(content: string): GenerateTasksResponse {
  // Essayer de parser directement
  try {
    return JSON.parse(content);
  } catch {
    // Sinon chercher le JSON dans la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Impossible de parser la réponse JSON du LLM');
  }
}

