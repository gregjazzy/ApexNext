// ============================================================================
// CONTEXTE GÉOGRAPHIQUE POUR LES PROMPTS LLM
// Instructions spécifiques par pays/zone économique
// ============================================================================

import { GeoZone } from '@/lib/store';

// ============================================================================
// PROFILS GÉOGRAPHIQUES DÉTAILLÉS
// ============================================================================

interface GeoProfile {
  name: string;
  aiAdoptionLevel: 'early_adopter' | 'fast_follower' | 'mainstream' | 'laggard';
  laborMarket: {
    flexibility: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
    protections: 'very_high' | 'high' | 'medium' | 'low';
    pivotCulture: string;
  };
  careerMindset: string;
  certifications: string[];
  salaryContext: string;
  keyIndustries: string[];
  culturalNotes: string[];
}

const GEO_PROFILES: Record<GeoZone, GeoProfile> = {
  france: {
    name: 'France',
    aiAdoptionLevel: 'fast_follower',
    laborMarket: {
      flexibility: 'low',
      protections: 'very_high',
      pivotCulture: 'Le changement de métier est perçu comme risqué. Le CDI est sacré. La reconversion nécessite souvent une formation diplômante.',
    },
    careerMindset: 'Diplôme = validation sociale. Expertise = années d\'ancienneté. Réseau = grandes écoles et corps professionnels.',
    certifications: ['DEC (Expert-comptable)', 'DSCG', 'Titre RNCP', 'VAE', 'CPA', 'PMI-PMP'],
    salaryContext: 'Salaires médians EU. Écart cadre/non-cadre important. Package = fixe + variable + avantages (mutuelle, tickets resto, CE).',
    keyIndustries: ['Luxe', 'Aéronautique', 'Agroalimentaire', 'Banque', 'Assurance', 'Fonction publique'],
    culturalNotes: [
      'La hiérarchie est importante - vouvoiement fréquent',
      'Les grandes écoles créent des réseaux puissants',
      'Le droit du travail très protecteur freine les licenciements',
      'Formation continue valorisée (CPF, plan de formation)',
    ],
  },
  
  belgium: {
    name: 'Belgique',
    aiAdoptionLevel: 'fast_follower',
    laborMarket: {
      flexibility: 'low',
      protections: 'very_high',
      pivotCulture: 'Marché stable, reconversion rare mais possible via FOREM/VDAB/Actiris.',
    },
    careerMindset: 'Équilibre vie pro/perso prioritaire. Trilinguisme (FR/NL/EN) = atout majeur.',
    certifications: ['ITAA (comptable)', 'Certificats UCL/ULB/KUL', 'Certifications SELOR'],
    salaryContext: 'Salaires bruts élevés mais forte fiscalité. Voiture de société très répandue.',
    keyIndustries: ['Pharma', 'Chimie', 'Logistique (port Anvers)', 'Institutions EU', 'Banque'],
    culturalNotes: [
      'Multilinguisme quasi-obligatoire pour les postes senior',
      'Frontière linguistique FR/NL influence fortement le marché',
      'Proximité Bruxelles/EU = opportunités internationales',
    ],
  },
  
  switzerland: {
    name: 'Suisse',
    aiAdoptionLevel: 'fast_follower',
    laborMarket: {
      flexibility: 'high',
      protections: 'medium',
      pivotCulture: 'Marché fluide, reconversion acceptée si compétences prouvées.',
    },
    careerMindset: 'Excellence et précision. Formation continue systématique. Stabilité > aventure.',
    certifications: ['CFC', 'Brevet fédéral', 'Diplôme fédéral', 'CAS/DAS/MAS universitaires'],
    salaryContext: 'Salaires très élevés (2-3x France) mais coût de la vie proportionnel. Pas de 13ème mois standard.',
    keyIndustries: ['Banque privée', 'Pharma', 'Horlogerie', 'Trading commodities', 'Organisations internationales'],
    culturalNotes: [
      'Ponctualité = respect absolu',
      'Discrétion valorisée (surtout secteur bancaire)',
      'Cantons = marchés différents (Genève ≠ Zurich)',
      'Permis de travail (B, C, G) = critère clé',
    ],
  },
  
  canada_fr: {
    name: 'Canada (Québec)',
    aiAdoptionLevel: 'fast_follower',
    laborMarket: {
      flexibility: 'high',
      protections: 'medium',
      pivotCulture: 'Culture nord-américaine du pivot, mais francophone. Reconversion bien vue.',
    },
    careerMindset: 'Pragmatisme. Expérience > diplôme. Networking informel mais efficace.',
    certifications: ['CPA Canada', 'PMP', 'CHRP', 'Ordres professionnels québécois'],
    salaryContext: 'Salaires inférieurs aux US mais supérieurs à la France. Avantages sociaux inclus (assurance, REER).',
    keyIndustries: ['Tech (Montréal)', 'Aéronautique (Bombardier)', 'Jeux vidéo', 'IA (Mila)', 'Finance'],
    culturalNotes: [
      'Tutoiement généralisé même en entreprise',
      'Immigration facilitée pour profils qualifiés',
      'Bilinguisme FR/EN = atout majeur',
      'Culture startup forte à Montréal',
    ],
  },
  
  morocco: {
    name: 'Maroc',
    aiAdoptionLevel: 'mainstream',
    laborMarket: {
      flexibility: 'high',
      protections: 'low',
      pivotCulture: 'Marché en développement, opportunités pour les pionniers.',
    },
    careerMindset: 'Relations personnelles cruciales. Diplômes français/étrangers très valorisés.',
    certifications: ['DPLE', 'Certifications françaises reconnues', 'MBA international'],
    salaryContext: 'Salaires plus bas mais pouvoir d\'achat correct. Grands groupes = packages internationaux.',
    keyIndustries: ['Offshoring', 'Automobile', 'Aéronautique', 'Tourisme', 'BTP', 'Énergies renouvelables'],
    culturalNotes: [
      'Casablanca = hub économique, Rabat = administratif',
      'Français = langue des affaires',
      'Nearshoring vers EU en forte croissance',
      'Jeunesse de la population = opportunités',
    ],
  },
  
  usa: {
    name: 'États-Unis',
    aiAdoptionLevel: 'early_adopter',
    laborMarket: {
      flexibility: 'very_high',
      protections: 'low',
      pivotCulture: 'Career pivot = normal, même encouragé. "Fail fast, learn fast". 3-5 pivots dans une carrière = standard.',
    },
    careerMindset: 'Skills > diplômes. Personal branding essentiel. Réseau LinkedIn = capital. Résultats mesurables obligatoires.',
    certifications: ['CPA', 'CFA', 'PMP', 'AWS/GCP/Azure', 'Six Sigma', 'SHRM-CP'],
    salaryContext: 'Écarts énormes (50K$ junior → 500K$ FAANG senior). Equity/stock options = partie majeure du package.',
    keyIndustries: ['Tech (FAANG)', 'Finance (Wall Street)', 'Healthcare', 'Consulting', 'Defense'],
    culturalNotes: [
      'At-will employment : licenciement possible sans préavis',
      'Networking agressif mais normalisé',
      'Remote work très répandu post-COVID',
      'IA adoption 2-3 ans en avance sur EU',
      'Assurance santé liée à l\'employeur = enjeu majeur',
    ],
  },
  
  uk: {
    name: 'Royaume-Uni',
    aiAdoptionLevel: 'early_adopter',
    laborMarket: {
      flexibility: 'high',
      protections: 'medium',
      pivotCulture: 'Portfolio career = concept établi. Reconversion via bootcamps acceptée.',
    },
    careerMindset: 'Networking = clé absolue. Personal branding important. Pragmatisme britannique.',
    certifications: ['ACCA', 'CIMA', 'CIPD', 'APM', 'Chartered status'],
    salaryContext: 'Londres = +40% vs reste UK. City = salaires tech/finance très élevés.',
    keyIndustries: ['Finance (City)', 'Tech', 'Pharma', 'Consulting', 'Creative industries'],
    culturalNotes: [
      'Post-Brexit : visa = contrainte pour non-UK',
      'Class system subtil mais présent',
      'Humour et understatement = codes culturels',
      'London-centric pour les grandes opportunités',
    ],
  },
  
  germany: {
    name: 'Allemagne',
    aiAdoptionLevel: 'fast_follower',
    laborMarket: {
      flexibility: 'medium',
      protections: 'high',
      pivotCulture: 'Expertise technique = roi. Reconversion possible mais via formation structurée (Weiterbildung).',
    },
    careerMindset: 'Spécialisation profonde > généralisme. Titres académiques (Dr., Dipl.-Ing.) = prestige. Meister = respect.',
    certifications: ['IHK', 'Meisterbrief', 'Diplom', 'TÜV certifications'],
    salaryContext: 'Salaires solides, moins d\'écarts qu\'US/UK. Betriebsrat (CE) puissant.',
    keyIndustries: ['Automobile', 'Industrie 4.0', 'Chimie', 'Engineering', 'Mittelstand (PME familiales)'],
    culturalNotes: [
      'Allemand quasi-obligatoire hors Berlin/startups',
      'Ponctualité et organisation = vertus cardinales',
      'Apprentissage (Ausbildung) = voie royale',
      'Work-life balance respecté (pas de mails le WE)',
    ],
  },
  
  spain: {
    name: 'Espagne',
    aiAdoptionLevel: 'mainstream',
    laborMarket: {
      flexibility: 'medium',
      protections: 'high',
      pivotCulture: 'Marché du travail difficile (chômage élevé). Reconversion = nécessité pour beaucoup.',
    },
    careerMindset: 'Relations personnelles importantes. Oposiciones (concours) = sécurité. Expérience internationale valorisée.',
    certifications: ['Colegio profesional', 'ICAC', 'Certificados de profesionalidad'],
    salaryContext: 'Salaires plus bas qu\'EU nord, mais coût de la vie inférieur. Madrid/Barcelone = +20-30%.',
    keyIndustries: ['Tourisme', 'Banque', 'Télécom', 'Énergie', 'Distribution'],
    culturalNotes: [
      'Horaires décalés (déjeuner 14h, dîner 21h)',
      'Chômage des jeunes = enjeu majeur',
      'Barcelona = hub tech/startups',
      'Fonctionnariat = voie sécurisée très prisée',
    ],
  },
  
  italy: {
    name: 'Italie',
    aiAdoptionLevel: 'mainstream',
    laborMarket: {
      flexibility: 'low',
      protections: 'high',
      pivotCulture: 'Marché rigide, reconversion difficile. Réseau familial/régional = clé.',
    },
    careerMindset: 'Diplômes italiens + expérience internationale. Nord vs Sud = deux marchés différents.',
    certifications: ['Albo professionale', 'Ordine dei Commercialisti', 'Certificazioni UNI'],
    salaryContext: 'Salaires plus bas qu\'EU nord. Écart Nord/Sud important. TFR = indemnité de départ.',
    keyIndustries: ['Mode/Luxe', 'Automobile', 'Agroalimentaire', 'Tourisme', 'PME familiales'],
    culturalNotes: [
      'Milan = capitale économique, Rome = administrative',
      'PME familiales = tissu économique principal',
      'Relations personnelles > process',
      'Bureaucratie lourde',
    ],
  },
  
  netherlands: {
    name: 'Pays-Bas',
    aiAdoptionLevel: 'early_adopter',
    laborMarket: {
      flexibility: 'high',
      protections: 'medium',
      pivotCulture: 'Culture très ouverte au changement. International et pragmatique.',
    },
    careerMindset: 'Direct et pragmatique. Anglais = lingua franca. Work-life balance sacré.',
    certifications: ['RA (Register Accountant)', 'RC (Register Controller)', 'NIMA marketing'],
    salaryContext: 'Salaires compétitifs. 30% ruling = avantage fiscal expats.',
    keyIndustries: ['Tech (Amsterdam)', 'Logistique (Rotterdam)', 'Agritech', 'Finance', 'Énergie'],
    culturalNotes: [
      'Anglais suffisant dans la plupart des entreprises',
      'Très international (expats nombreux)',
      'Vélo = mode de vie',
      'Franchise directe dans la communication',
    ],
  },
  
  other_eu: {
    name: 'Autre pays UE',
    aiAdoptionLevel: 'mainstream',
    laborMarket: {
      flexibility: 'medium',
      protections: 'medium',
      pivotCulture: 'Variable selon le pays. Mobilité intra-EU = atout.',
    },
    careerMindset: 'Contexte variable. Diplômes EU reconnus. Mobilité encouragée.',
    certifications: ['Certifications EU reconnues', 'Europass'],
    salaryContext: 'Variable selon le pays. Convergence progressive EU.',
    keyIndustries: ['Variable selon le pays'],
    culturalNotes: [
      'Libre circulation des travailleurs EU',
      'Reconnaissance des diplômes EU',
      'Contexte spécifique à préciser par le candidat',
    ],
  },
  
  other_world: {
    name: 'Autre pays (hors EU)',
    aiAdoptionLevel: 'mainstream',
    laborMarket: {
      flexibility: 'medium',
      protections: 'medium',
      pivotCulture: 'Variable selon le pays. Contexte local à préciser.',
    },
    careerMindset: 'Contexte très variable. Adaptation culturelle essentielle.',
    certifications: ['Certifications internationales (PMI, CFA, etc.)'],
    salaryContext: 'Très variable selon le pays.',
    keyIndustries: ['Variable selon le pays'],
    culturalNotes: [
      'Contexte spécifique à préciser par le candidat',
      'Visa/permis de travail = enjeu potentiel',
    ],
  },
};

// ============================================================================
// GÉNÉRATION DES INSTRUCTIONS GÉOGRAPHIQUES POUR CHAQUE LLM
// ============================================================================

/**
 * LLM #1 : Tasks - Contexte pour la génération des tâches
 */
export function getGeoContextForTasks(country: GeoZone | undefined): string {
  if (!country) return '';
  
  const profile = GEO_PROFILES[country];
  
  return `

---

# 🌍 CONTEXTE GÉOGRAPHIQUE : ${profile.name}

## Spécificités du marché du travail local
${profile.culturalNotes.map(n => `- ${n}`).join('\n')}

## Industries dominantes dans ce pays
${profile.keyIndustries.join(', ')}

## Adaptation des tâches
- Utilise les termes et pratiques spécifiques à ${profile.name}
- Référence les outils/logiciels utilisés localement
- Intègre les contraintes réglementaires locales (ex: ${country === 'france' ? 'URSSAF, DSN, TVA intracommunautaire' : country === 'usa' ? 'IRS, GAAP, SOX compliance' : 'réglementation locale'})
- Les tâches doivent être reconnues par un professionnel de ${profile.name}
`;
}

/**
 * LLM #2 : Vulnerability - Contexte pour l'analyse de vulnérabilité
 */
export function getGeoContextForVulnerability(country: GeoZone | undefined): string {
  if (!country) return '';
  
  const profile = GEO_PROFILES[country];
  
  const aiUrgency = {
    early_adopter: 'TRÈS ÉLEVÉE - L\'IA est déjà massivement déployée, le temps presse',
    fast_follower: 'ÉLEVÉE - L\'IA arrive rapidement, anticipation nécessaire',
    mainstream: 'MODÉRÉE - L\'IA se déploie progressivement, temps pour se préparer',
    laggard: 'FAIBLE - L\'IA arrive plus lentement, mais ne pas se reposer',
  };
  
  return `

---

# 🌍 CONTEXTE GÉOGRAPHIQUE : ${profile.name}

## Niveau d'urgence IA dans ce pays
**${aiUrgency[profile.aiAdoptionLevel]}**

## Contexte du marché du travail
- **Flexibilité du marché** : ${profile.laborMarket.flexibility}
- **Niveau de protection** : ${profile.laborMarket.protections}
- **Culture du pivot** : ${profile.laborMarket.pivotCulture}

## Mentalité carrière locale
${profile.careerMindset}

## Points d'attention spécifiques
${profile.culturalNotes.map(n => `- ${n}`).join('\n')}

## Adapter le ton et les recommandations
- Tiens compte de la culture locale (${country === 'france' ? 'prudence, diplômes' : country === 'usa' ? 'action rapide, personal branding' : 'adaptation locale'})
- Les recommandations doivent être RÉALISTES pour ${profile.name}
- Utilise les références locales (formations, certifications, réseaux)
`;
}

/**
 * LLM #3 : Action Plan - Contexte pour le plan d'action
 */
export function getGeoContextForActionPlan(country: GeoZone | undefined): string {
  if (!country) return '';
  
  const profile = GEO_PROFILES[country];
  
  return `

---

# 🌍 CONTEXTE GÉOGRAPHIQUE : ${profile.name}

## Certifications reconnues localement
${profile.certifications.map(c => `- ${c}`).join('\n')}

## Contexte salarial
${profile.salaryContext}

## Industries porteuses localement
${profile.keyIndustries.join(', ')}

## Adaptation du plan d'action
- **Formations** : Recommande des formations accessibles et reconnues en ${profile.name}
- **Networking** : Adapte les conseils de réseautage à la culture locale (${country === 'france' ? 'Alumni grandes écoles, réseaux professionnels' : country === 'usa' ? 'LinkedIn agressif, meetups, conférences' : country === 'germany' ? 'IHK, associations professionnelles' : 'réseaux locaux'})
- **Timing** : ${profile.laborMarket.flexibility === 'very_high' || profile.laborMarket.flexibility === 'high' ? 'Le marché est fluide, transition rapide possible' : 'Le marché est rigide, prévoir une transition plus longue'}
- **Ressources** : Utilise les plateformes locales (${country === 'france' ? 'France Travail, APEC, OpenClassrooms' : country === 'usa' ? 'Indeed, LinkedIn Learning, Coursera' : 'plateformes locales'})

## Mentalité à intégrer
${profile.careerMindset}
`;
}

/**
 * LLM #4 : Pivot Jobs - Contexte pour les suggestions de métiers
 */
export function getGeoContextForPivot(country: GeoZone | undefined): string {
  if (!country) return '';
  
  const profile = GEO_PROFILES[country];
  
  return `

---

# 🌍 CONTEXTE GÉOGRAPHIQUE : ${profile.name}

## Industries en croissance localement
${profile.keyIndustries.map(i => `- ${i}`).join('\n')}

## Contexte salarial pour calibrer les propositions
${profile.salaryContext}

## Culture de la reconversion
${profile.laborMarket.pivotCulture}

## Contraintes locales à intégrer
${profile.culturalNotes.map(n => `- ${n}`).join('\n')}

## Adapter les propositions de métiers
- Les titres de postes doivent être ceux utilisés en ${profile.name} (${country === 'france' ? 'ex: Contrôleur de gestion, pas Financial Controller' : country === 'usa' ? 'ex: FP&A Manager, pas Contrôleur de gestion' : 'titres locaux'})
- Les fourchettes salariales doivent être réalistes pour ${profile.name}
- Les chemins de transition doivent tenir compte des certifications locales : ${profile.certifications.slice(0, 3).join(', ')}
- La culture du changement est : ${profile.laborMarket.flexibility === 'very_high' || profile.laborMarket.flexibility === 'high' ? 'OUVERTE - le pivot est accepté' : 'PRUDENTE - le pivot nécessite une justification solide'}

## Mentalité locale
${profile.careerMindset}
`;
}

/**
 * Récupère le nom du pays pour affichage
 */
export function getCountryName(country: GeoZone | undefined): string {
  if (!country) return 'Non précisé';
  return GEO_PROFILES[country]?.name || country;
}

