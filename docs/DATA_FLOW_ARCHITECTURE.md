# APEX Next — Architecture des Flux de Données

> Document de référence pour identifier tous les inputs, outputs et transformations de données.

---

## 📊 Vue d'ensemble des flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PHASE 1 : DIAGNOSTIC                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  Step 1      Step 2       Step 3       Step 4      Step 5      Step 6      │
│  Matrice  →  Contexte  →  Tâches   →  Talents  →  Tech     →  Verdict     │
│  (Config)    (Poste)      (Audit)     (Actifs)    (Outils)    (Analyse)    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PHASE 2 : STRATÉGIE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  Portrait Mutation  →  Ikigai (ERAC)  →  Roadmap                           │
│  (Vision future)       (Arbitrage)       (Actions)                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📥 INVENTAIRE DES INPUTS

### Step 1 — Matrice (Configuration)

| Champ | Type | Valeurs possibles | Stockage | Obligatoire |
|-------|------|-------------------|----------|-------------|
| `persona` | enum | `salarie`, `freelance`, `leader` | `context.persona` | ✅ |
| `goal` | enum | `augmentation`, `pivot`, `reclassement` | `context.goal` | ✅ |

**Impact** : Détermine tout le parcours utilisateur et les calculs.

---

### Step 2 — Contexte (Analyse du Poste)

| Champ | Type | Exemple | Stockage | Obligatoire |
|-------|------|---------|----------|-------------|
| `jobTitle` | string | "Responsable Comptable" | `context.jobTitle` | ✅ |
| `sector` | string | "Banque / Finance" | `currentPosition.sector` | ✅ |
| `experience` | enum | `junior`, `mid`, `senior`, `expert` | `currentPosition.experience` | ✅ |
| `teamSize` | number | 5 | `currentPosition.teamSize` | ❌ |
| `remotePercentage` | number (0-100) | 40 | `currentPosition.remotePercentage` | ❌ |
| `jobDescription` | string (long) | Texte libre ou upload | `currentPosition.responsibilities` | ❌ |
| `uploadedFile` | File | .txt, .pdf | Parsing → tâches | ❌ |

**Transformation attendue (LLM)** :
- Extraire les tâches clés de la description de poste
- Classifier le secteur pour ajuster les pondérations
- Estimer le niveau d'automatisation du secteur

---

### Step 3 — Audit des Tâches

| Champ | Type | Structure | Stockage | Obligatoire |
|-------|------|-----------|----------|-------------|
| `tasks` | array | Voir structure ci-dessous | `tasks[]` | ✅ (min 3) |

**Structure d'une tâche** :
```typescript
interface Task {
  id: string;
  title: string;              // Nom de la tâche
  category: TaskCategory;     // 'cognitive' | 'relational' | 'physical' | 'creative'
  frequency: Frequency;       // 'daily' | 'weekly' | 'monthly' | 'quarterly'
  timePercentage: number;     // % du temps de travail (0-100)
  automationRisk: number;     // Score 0-100 (calculé ou LLM)
  resilience: number;         // Score 0-100 (slider utilisateur)
  ailesScore?: number;        // Score composite (calculé)
}
```

**Sources des tâches** :
1. Génération automatique (LLM) depuis `jobDescription`
2. Saisie manuelle par l'utilisateur
3. Suggestions sectorielles (base de données)

**Transformation attendue (LLM)** :
- Générer 5-10 tâches depuis une description de poste
- Classifier chaque tâche (cognitive, relational, etc.)
- Estimer le `automationRisk` de chaque tâche

---

### Step 3 (bis) — Scanner Phantom Charge (Emails)

| Champ | Type | Exemple | Stockage | Obligatoire |
|-------|------|---------|----------|-------------|
| `dailyVolume` | number | 80 | `phantomCharge.dailyVolume` | ✅ (si activé) |
| `dailyHours` | number | 2 | `phantomCharge.dailyHours` | ✅ (si activé) |
| `dailyMinutes` | number | 30 | `phantomCharge.dailyMinutes` | ✅ (si activé) |
| `fluxAuto` | number (%) | 30 | `phantomCharge.fluxAuto` | ✅ |
| `fluxBasNiveau` | number (%) | 50 | `phantomCharge.fluxBasNiveau` | ✅ |
| `fluxStrategique` | number (%) | 20 | `phantomCharge.fluxStrategique` | ✅ |

**Contrainte** : `fluxAuto + fluxBasNiveau + fluxStrategique = 100%`

**Calcul (fixe, pas LLM)** :
```typescript
// Temps hebdomadaire total
const weeklyHours = (dailyHours + dailyMinutes/60) * 5;

// Gisement de temps récupérable
const potentialGain = weeklyHours * (
  (fluxAuto/100 * 0.95) +      // 95% automatisable
  (fluxBasNiveau/100 * 0.70) + // 70% automatisable
  (fluxStrategique/100 * 0.30) // 30% automatisable
);

// Convertir en heures/mois
const monthlyGain = potentialGain * 4;
```

---

### Step 4 — Talents (Actifs Humains)

| Champ | Type | Structure | Stockage | Obligatoire |
|-------|------|-----------|----------|-------------|
| `talents` | array | Voir structure ci-dessous | `talents[]` | ✅ (5 sélectionnés) |

**Structure d'un talent** :
```typescript
interface Talent {
  id: string;
  name: { fr: string; en: string };
  category: 'cognitive' | 'interpersonal' | 'execution' | 'leadership';
  description: { fr: string; en: string };
  ailesScore: number;          // Score de résilience IA (1-5)
  selected: boolean;           // Sélectionné par l'utilisateur
  level: number;               // Auto-évaluation (1-5)
}
```

**Contrainte** : Exactement 5 talents sélectionnés.

**Calcul du score talent** :
```typescript
const talentScore = selectedTalents.reduce((sum, t) => {
  return sum + (t.level * t.ailesScore);
}, 0) / (5 * 5 * 5) * 100; // Normaliser sur 100
```

---

### Step 5 — Stack Technologique

| Champ | Type | Structure | Stockage | Obligatoire |
|-------|------|-----------|----------|-------------|
| `software` | array | Voir structure ci-dessous | `software[]` | ❌ |

**Structure d'un outil** :
```typescript
interface Software {
  id: string;
  name: string;               // "Excel", "Salesforce", etc.
  category: string;           // "Productivité", "CRM", etc.
  proficiency: number;        // Niveau maîtrise (1-5)
  ailesScore: number;         // Résilience IA de l'outil (1-5)
  selected: boolean;
}
```

**Transformation attendue (LLM)** :
- Suggérer des outils IA pertinents pour le profil
- Évaluer la maturité digitale globale

---

### Step 6 — Verdict (Pas d'input, que des outputs)

Voir section OUTPUTS ci-dessous.

---

### Portrait de Mutation (Phase 2 - Pivot uniquement)

| Champ | Type | Exemple | Stockage | Obligatoire |
|-------|------|---------|----------|-------------|
| `targetRole` | string | "Consultant Data" | `userIntention.targetRole` | ✅ |
| `motivation` | string | "Passion pour la data" | `userIntention.motivation` | ✅ |
| `constraints` | string | "Mobilité géographique limitée" | `userIntention.constraints` | ❌ |
| `timeline` | enum | `3m`, `6m`, `12m`, `24m` | `userIntention.timeline` | ✅ |
| `riskTolerance` | number (1-5) | 3 | `userIntention.riskTolerance` | ✅ |

**Transformation attendue (LLM)** :
- Valider la cohérence target role vs profil actuel
- Identifier les gaps de compétences
- Suggérer des étapes de transition

---

## 📤 INVENTAIRE DES OUTPUTS

### Scores calculés (Step 6 - Verdict)

| Output | Formule | Plage | Affichage |
|--------|---------|-------|-----------|
| `resilienceScore` | Moyenne pondérée des `task.resilience` | 0-100% | Jauge + Badge |
| `talentScore` | Voir formule Step 4 | 0-100% | Jauge + Badge |
| `globalScore` | `(resilienceScore * 0.6) + (talentScore * 0.4)` | 0-100% | Score final |
| `expositionIA` | `100 - resilienceScore` | 0-100% | Pourcentage risque |

**Interprétation des scores** :
```typescript
const getScoreLabel = (score: number) => {
  if (score >= 80) return { label: "Excellent", color: "emerald" };
  if (score >= 60) return { label: "Solide", color: "blue" };
  if (score >= 40) return { label: "À renforcer", color: "amber" };
  return { label: "Critique", color: "rose" };
};
```

---

### Analyse des tâches (Step 6)

| Output | Source | Structure |
|--------|--------|-----------|
| `vulnerableTasks` | `tasks.filter(t => t.resilience < 40)` | Liste de tâches |
| `resilientTasks` | `tasks.filter(t => t.resilience >= 70)` | Liste de tâches |
| `taskAnalysis` | LLM | Commentaire textuel par tâche |

**Transformation attendue (LLM)** :
- Générer un commentaire stratégique pour chaque tâche vulnérable
- Suggérer des actions de protection

---

### Phantom Charge Output

| Output | Calcul | Affichage |
|--------|--------|-----------|
| `weeklyEmailTime` | `(dailyHours + dailyMinutes/60) * 5` | "X heures/semaine" |
| `potentialGainWeekly` | Voir formule ci-dessus | "+X heures récupérables" |
| `potentialGainMonthly` | `potentialGainWeekly * 4` | Dashboard KPI |
| `shouldInjectRoadmapAction` | `potentialGainWeekly > 2` | Boolean |

---

### Roadmap (Step 8)

| Output | Source | Structure |
|--------|--------|-----------|
| `roadmapActions` | Générées selon profil | Array d'actions |
| `triageIntelligent` | Si `phantomCharge.gain > 2h` | Action injectée |
| `priorityActions` | Top 3 urgentes | Mise en avant |

**Structure ACTUELLE d'une action Roadmap** :
```typescript
interface RoadmapAction {
  id: string;
  pillar: 'delegation' | 'reinforcement' | 'positioning';
  title: string;
  description: string;
  priority: 'immediate' | 'short_term' | 'long_term';
  completed: boolean;
  eracCategory?: string;
  kpi?: string;
  resilienceScore?: number;
  suggestedTool?: string;
  sourceData?: string;
}
```

### ⚠️ MANQUE CRITIQUE : Micro-tâches

**Ce qui manque pour un plan d'action vraiment actionnable :**
```typescript
interface RoadmapAction {
  // ... champs existants ...
  
  // 🆕 À AJOUTER
  microsteps: MicroStep[];        // Sous-tâches concrètes
  estimatedDuration: string;      // "2 semaines", "1 mois"
  resources?: Resource[];         // Liens, formations, outils
  checkpoints?: string[];         // Points de validation
}

interface MicroStep {
  id: string;
  title: string;
  description?: string;
  duration: string;               // "30 min", "2h", "1 jour"
  type: 'action' | 'learning' | 'practice' | 'validation';
  completed: boolean;
  resources?: Resource[];
}

interface Resource {
  type: 'link' | 'video' | 'course' | 'tool' | 'template';
  title: string;
  url?: string;
  isFree: boolean;
}
```

**Transformation attendue (LLM)** :
- Générer des actions personnalisées selon le profil
- **Décomposer chaque action en 3-7 micro-tâches concrètes**
- Estimer la durée de chaque étape
- Suggérer des ressources spécifiques (gratuit/payant)
- Créer des checkpoints de validation

---

## 🔄 MATRICE DES TRANSFORMATIONS

### Transformations FIXES (règles codées)

| Input | → | Output | Logique |
|-------|---|--------|---------|
| `task.category` | → | `task.automationRisk` (base) | Lookup table par catégorie |
| `phantomCharge.*` | → | `potentialGain` | Formule mathématique |
| `talents[].level` | → | `talentScore` | Moyenne pondérée |
| `tasks[].resilience` | → | `resilienceScore` | Moyenne pondérée |

### Transformations VARIABLES (LLM)

| Input | → | Output | Rôle du LLM |
|-------|---|--------|-------------|
| `sector` | → | `sectorModifier` | Ajuster coefficients selon secteur |
| `jobDescription` | → | `tasks[]` | Extraire et classifier les tâches |
| `tasks[]` | → | `taskAnalysis[]` | Générer commentaires stratégiques |
| `userIntention` | → | `transitionPlan` | Valider cohérence et suggérer étapes |
| `globalProfile` | → | `roadmapActions[]` | Personnaliser les recommandations |

---

---

## 📋 EXEMPLE DE PLAN D'ACTION COMPLET (Objectif final)

### Exemple : Freelance Consultant en Pivot vers Data Analyst

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                     ROADMAP PERSONNALISÉE — PIVOT DATA                       ║
║                     Durée estimée : 6 mois | 3 piliers                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│ PILIER 1 : DÉLÉGATION & EFFICIENCE                                          │
│ Objectif : Libérer 8h/semaine pour la formation                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ▶ ACTION 1.1 : Automatiser la veille client (vulnérabilité 72%)             │
│   Durée : 2 semaines | KPI : 3h/sem libérées                                │
│                                                                              │
│   □ Micro-tâche 1 : Créer un compte Zapier gratuit (15 min)                 │
│   □ Micro-tâche 2 : Connecter Gmail + Notion (30 min)                       │
│   □ Micro-tâche 3 : Configurer le trigger "nouveau client" (1h)             │
│   □ Micro-tâche 4 : Tester avec 3 emails réels (30 min)                     │
│   □ Micro-tâche 5 : Documenter le workflow (30 min)                         │
│                                                                              │
│   📚 Ressources :                                                            │
│   - [Gratuit] Tuto Zapier débutant (YouTube, 20 min)                        │
│   - [Gratuit] Template Notion CRM                                           │
│                                                                              │
│ ▶ ACTION 1.2 : Déléguer la facturation récurrente                           │
│   Durée : 1 semaine | KPI : 2h/sem libérées                                 │
│                                                                              │
│   □ Micro-tâche 1 : Choisir un outil (Stripe/Pennylane) (1h)                │
│   □ Micro-tâche 2 : Configurer les templates de facture (2h)                │
│   □ Micro-tâche 3 : Activer l'envoi automatique (30 min)                    │
│   □ Micro-tâche 4 : Migrer 3 clients existants (1h)                         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ PILIER 2 : RENFORCEMENT DE SIGNATURE                                        │
│ Objectif : Acquérir les compétences Data                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ▶ ACTION 2.1 : Maîtriser Python pour la Data (niveau intermédiaire)         │
│   Durée : 8 semaines | KPI : Projet portfolio complété                      │
│                                                                              │
│   □ Semaine 1-2 : Bases Python (variables, boucles, fonctions)              │
│     └─ Ressource : DataCamp "Intro to Python" (gratuit)                     │
│   □ Semaine 3-4 : Pandas & manipulation de données                          │
│     └─ Ressource : Kaggle "Pandas Course" (gratuit)                         │
│   □ Semaine 5-6 : Visualisation (Matplotlib, Seaborn)                       │
│     └─ Ressource : YouTube "Corey Schafer" (gratuit)                        │
│   □ Semaine 7-8 : Projet portfolio : Analyse dataset réel                   │
│     └─ Checkpoint : Publier sur GitHub                                      │
│                                                                              │
│ ▶ ACTION 2.2 : Certification SQL (talent "Analyse" à renforcer)             │
│   Durée : 3 semaines | KPI : Certification obtenue                          │
│                                                                              │
│   □ Micro-tâche 1 : Installer PostgreSQL local (1h)                         │
│   □ Micro-tâche 2 : Cours SQL basics (5h sur 1 semaine)                     │
│   □ Micro-tâche 3 : Exercices LeetCode SQL (2h/semaine x 2)                 │
│   □ Micro-tâche 4 : Passer certification HackerRank SQL (2h)                │
│                                                                              │
│   📚 Ressources :                                                            │
│   - [Gratuit] Mode Analytics SQL Tutorial                                   │
│   - [Payant] DataCamp SQL Track (promo -50%)                                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ PILIER 3 : POSITIONNEMENT & AUTORITÉ                                        │
│ Objectif : Devenir visible sur le marché Data                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ ▶ ACTION 3.1 : Construire un portfolio Data public                          │
│   Durée : 4 semaines | KPI : 3 projets publiés                              │
│                                                                              │
│   □ Micro-tâche 1 : Créer compte GitHub + README pro (2h)                   │
│   □ Micro-tâche 2 : Projet 1 — Analyse exploratoire (dataset public)        │
│   □ Micro-tâche 3 : Projet 2 — Dashboard interactif (Streamlit)             │
│   □ Micro-tâche 4 : Projet 3 — Projet métier (ex: analyse RH)               │
│   □ Micro-tâche 5 : Rédiger les README détaillés de chaque projet           │
│                                                                              │
│ ▶ ACTION 3.2 : Activer le réseau LinkedIn "Data"                            │
│   Durée : Ongoing | KPI : 500 connexions Data + 2 posts/semaine             │
│                                                                              │
│   □ Micro-tâche 1 : Refaire le titre LinkedIn (Data Analyst Junior)         │
│   □ Micro-tâche 2 : Suivre 50 profils Data influents                        │
│   □ Micro-tâche 3 : Poster premier projet portfolio                         │
│   □ Micro-tâche 4 : Commenter 3 posts/jour pendant 30 jours                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
RÉCAPITULATIF
═══════════════════════════════════════════════════════════════════════════════
Total micro-tâches : 24
Temps libéré (Pilier 1) : 5h/semaine → Réinvesti en formation
Nouvelles compétences : Python, SQL, Data Viz, Portfolio
Durée totale : 6 mois
Budget formation : 0€ (ressources gratuites) ou ~100€ (certifications payantes)
═══════════════════════════════════════════════════════════════════════════════
```

### Logique de génération des micro-tâches

| Type d'action | Nombre de micro-tâches | Durée moyenne |
|---------------|------------------------|---------------|
| Automatisation simple | 3-5 | 2-4h total |
| Automatisation complexe | 5-7 | 1-2 semaines |
| Apprentissage compétence | 5-8 | 2-8 semaines |
| Projet portfolio | 4-6 | 1-4 semaines |
| Networking/Visibilité | 4-6 | Ongoing |

### Sources des micro-tâches

1. **Base de templates** : Actions communes pré-définies (automatisation email, création GitHub, etc.)
2. **LLM personnalisation** : Adaptation au contexte métier et niveau de l'utilisateur
3. **Ressources dynamiques** : Liens vers formations actualisés (API ou base de données)

---

## 🎯 POINTS D'INJECTION LLM

### Priorité 1 — Génération de tâches (Step 3)
```
INPUT:  jobTitle + sector + jobDescription
OUTPUT: tasks[] avec title, category, automationRisk
PROMPT: "Analyse ce poste et génère 5-10 tâches principales..."
```

### Priorité 2 — Analyse du Verdict (Step 6)
```
INPUT:  tasks[] + talents[] + scores
OUTPUT: Commentaire global + analyse par tâche
PROMPT: "Analyse ce profil et génère un verdict stratégique..."
```

### Priorité 3 — Roadmap personnalisée (Step 8)
```
INPUT:  Tout le profil + intention utilisateur
OUTPUT: roadmapActions[] avec microsteps[]
PROMPT TYPE: "Génère un plan d'action concret pour ce profil..."
```

**Sous-prompts pour micro-tâches :**
```
PROMPT 3.1 (Délégation):
"Pour automatiser la tâche '[taskName]' (vulnérabilité [X]%), 
génère 3-5 micro-tâches concrètes avec :
- Durée estimée
- Outil suggéré
- Niveau de difficulté"

PROMPT 3.2 (Renforcement):
"Pour développer la compétence '[talentName]' de niveau [currentLevel] à [targetLevel],
génère un plan d'apprentissage avec :
- Ressources gratuites/payantes
- Jalons de progression
- Exercices pratiques"

PROMPT 3.3 (Positionnement):
"Pour se positionner en tant que '[targetRole]' dans le secteur '[sector]',
génère une stratégie de visibilité avec :
- Actions LinkedIn/Portfolio
- Réseaux/communautés à rejoindre
- Certifications valorisantes"
```

### Priorité 4 — Ajustement sectoriel
```
INPUT:  sector
OUTPUT: Coefficients de pondération ajustés
PROMPT: "Pour le secteur X, ajuste les coefficients d'automatisation..."
```

---

## 📁 MAPPING STOCKAGE (Zustand Store)

```typescript
// Résumé du store
interface AuditStore {
  // CONFIG
  context: {
    persona: 'salarie' | 'freelance' | 'leader';
    goal: 'augmentation' | 'pivot' | 'reclassement';
    jobTitle: string;
  };
  
  // POSTE ACTUEL
  currentPosition: {
    sector: string;
    experience: string;
    teamSize: number;
    remotePercentage: number;
    responsibilities: string;
  };
  
  // AUDIT
  tasks: Task[];
  talents: Talent[];
  software: Software[];
  phantomCharge: PhantomChargeData;
  
  // STRATÉGIE
  userIntention: UserIntention;   // Portrait de Mutation
  strategy: {
    erac: ERACMatrix;
    roadmap: RoadmapAction[];
    generatedAt: number;
  };
  
  // LEADER/RH
  enterpriseTargets: EnterpriseTargets;  // Job Designer
  cohortData: CohortData;                 // Cohortes
}
```

---

## ✅ CHECKLIST PRÉ-LLM

- [ ] Tous les inputs sont identifiés et typés
- [ ] Tous les outputs sont définis avec leur formule/source
- [ ] Les transformations fixes vs LLM sont clarifiées
- [ ] Les prompts prioritaires sont identifiés
- [ ] Le mapping stockage est à jour

---

## 🚀 PROCHAINES ÉTAPES

1. **Valider ce document** avec l'équipe
2. **Créer les prompts système** pour chaque point d'injection
3. **Implémenter l'API LLM** (route `/api/analyze`)
4. **Brancher les composants** sur l'API
5. **Tester et ajuster** les prompts


