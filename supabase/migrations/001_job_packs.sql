-- Table pour stocker les couples métier/secteur et leurs tâches générées
CREATE TABLE IF NOT EXISTS job_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identification du couple
  job_title VARCHAR(255) NOT NULL,
  sector VARCHAR(255) NOT NULL,
  
  -- Tâches générées par LLM #1
  -- Format: [{ id, name, description, category, typical_frequency }]
  current_standard_tasks JSONB DEFAULT '[]',
  
  -- Vocabulaire métier (jargon)
  vocabulaire_metier JSONB DEFAULT '[]',
  
  -- Analyse complète générée par LLM #2 (après validation utilisateur)
  strategic_mutation_axes JSONB DEFAULT '[]',
  future_augmented_title VARCHAR(255),
  full_analysis JSONB DEFAULT NULL,
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Contrainte d'unicité sur le couple
  UNIQUE(job_title, sector)
);

-- Index pour recherche rapide
CREATE INDEX idx_job_packs_job_sector ON job_packs(job_title, sector);
CREATE INDEX idx_job_packs_search ON job_packs USING gin (to_tsvector('french', job_title || ' ' || sector));

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_packs_updated_at
  BEFORE UPDATE ON job_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
