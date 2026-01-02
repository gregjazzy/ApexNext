import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getResilienceColor(score: number): string {
  if (score >= 70) return 'emerald';
  if (score >= 40) return 'amber';
  return 'rose';
}

export function getResilienceLabel(score: number): string {
  if (score >= 70) return 'Résilient';
  if (score >= 40) return 'Vulnérable';
  return 'Critique';
}

export function getTemporalityLabel(temp: string): string {
  const labels: Record<string, string> = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    strategic: 'Stratégique',
  };
  return labels[temp] || temp;
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    debutant: 'Débutant',
    avance: 'Avancé',
    expert: 'Expert',
  };
  return labels[level] || level;
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

