import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialisation conditionnelle pour éviter les erreurs de build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Le client sera null si les variables d'environnement ne sont pas définies
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// ============================================================================
// TYPES
// ============================================================================

export interface TaskData {
  task_name: string;
  porosity_score: number;  // 0.0 à 0.95
  category: 'DATA' | 'HUMAIN' | 'OBJET';
  human_value_description: string;
}

export interface MutationAxis {
  axis_title: string;
  strategic_impact: string;
  concrete_missions: string[];
  required_talent: string;
}

export interface JobPack {
  id: string;
  job_title: string;
  sector: string;
  current_standard_tasks: TaskData[];
  strategic_mutation_axes: MutationAxis[];
  future_augmented_title: string | null;
  vocabulaire_metier: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// ============================================================================
// FONCTIONS
// ============================================================================

/**
 * Récupère tous les packs disponibles
 */
export async function getAllPacks(): Promise<JobPack[]> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('job_packs')
    .select('*')
    .eq('is_active', true)
    .order('sector', { ascending: true })
    .order('job_title', { ascending: true });

  if (error) {
    console.error('Error fetching packs:', error);
    return [];
  }

  return data as JobPack[];
}

/**
 * Récupère un pack par couple job/sector
 */
export async function getPack(jobTitle: string, sector: string): Promise<JobPack | null> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('job_packs')
    .select('*')
    .eq('job_title', jobTitle)
    .eq('sector', sector)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching pack:', error);
    return null;
  }

  return data as JobPack;
}

/**
 * Recherche un pack par métier (fuzzy match)
 */
export async function findPack(jobTitle: string, sector: string): Promise<JobPack | null> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('job_packs')
    .select('*')
    .eq('is_active', true)
    .ilike('sector', `%${sector}%`);

  if (error || !data || data.length === 0) {
    return null;
  }

  const normalizedInput = jobTitle.toLowerCase().trim();
  
  const match = data.find((pack: JobPack) => {
    const jobMatch = pack.job_title.toLowerCase().includes(normalizedInput) ||
                     normalizedInput.includes(pack.job_title.toLowerCase());
    return jobMatch;
  });

  return match || null;
}

/**
 * Récupère tous les secteurs disponibles
 */
export async function getSectors(): Promise<string[]> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('job_packs')
    .select('sector')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching sectors:', error);
    return [];
  }

  const sectorSet = new Set<string>(data.map((d: { sector: string }) => d.sector));
  const sectors = Array.from(sectorSet);
  return sectors.sort();
}

/**
 * Récupère tous les métiers d'un secteur
 */
export async function getJobsInSector(sector: string): Promise<string[]> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('job_packs')
    .select('job_title')
    .eq('sector', sector)
    .eq('is_active', true)
    .order('job_title');

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data.map((d: { job_title: string }) => d.job_title);
}

/**
 * Vérifie si un pack existe
 */
export async function packExists(jobTitle: string, sector: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return false;
  }

  const { data, error } = await supabase
    .from('job_packs')
    .select('id')
    .eq('job_title', jobTitle)
    .eq('sector', sector)
    .single();

  return !error && !!data;
}

/**
 * Insère un nouveau pack (pour import batch)
 */
export async function insertPack(pack: Omit<JobPack, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return false;
  }

  const { error } = await supabase
    .from('job_packs')
    .insert(pack);

  if (error) {
    console.error('Error inserting pack:', error);
    return false;
  }

  return true;
}

/**
 * Insère plusieurs packs (batch)
 */
export async function insertPacks(packs: Omit<JobPack, 'id' | 'created_at' | 'updated_at' | 'is_active'>[]): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured');
    return false;
  }

  const { error } = await supabase
    .from('job_packs')
    .insert(packs);

  if (error) {
    console.error('Error inserting packs:', error);
    return false;
  }

  return true;
}
