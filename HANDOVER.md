# HANDOVER — APEX Next v2.3

> Document de passation technique pour reprise du projet
> 
> **Date** : Janvier 2026
> **Version** : 2.3
> **Repo** : https://github.com/gregjazzy/ApexNext

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Architecture Technique](#2-architecture-technique)
3. [État du Développement](#3-état-du-développement)
4. [Store Zustand (Cœur de l'Application)](#4-store-zustand-cœur-de-lapplication)
5. [Composants Clés](#5-composants-clés)
6. [Routes et Navigation](#6-routes-et-navigation)
7. [Fonctionnalités par Module](#7-fonctionnalités-par-module)
8. [Points d'Attention](#8-points-dattention)
9. [Prochaines Étapes Suggérées](#9-prochaines-étapes-suggérées)
10. [Instructions de Démarrage](#10-instructions-de-démarrage)

---

## 1. Vue d'Ensemble

### Concept
APEX Next est un **GPS de la Mutation Professionnelle** qui aide les utilisateurs à évaluer leur résilience face à l'automatisation (IA + Robotique) et à générer un plan d'action stratégique personnalisé.

### Personas Cibles
| Persona | Description | Objectifs possibles |
|---------|-------------|---------------------|
| **Salarié** | En poste, veut sécuriser son rôle ou se réorienter | Augmentation, Pivot |
| **Freelance** | Indépendant, optimise son activité ou pivote | Augmentation, Pivot |
| **Leader/RH** | Pilote des équipes ou des plans de transformation | Augmentation, Pivot, **Reclassement** |

### Parcours Disponibles
| Parcours | Description | Spécificités |
|----------|-------------|--------------|
| **Augmentation** | Optimiser le poste actuel | Focus efficience, délégation technologique |
| **Pivot** | Changer de métier/secteur | Portrait de Mutation, Métiers Refuges |
| **Reclassement** | PSE / Mutation de masse (RH) | GPEC, Cohorte, Matching collaborateurs |

---

## 2. Architecture Technique

### Stack
```
Next.js 15 (App Router) + TypeScript + Tailwind CSS
├── State: Zustand avec persistence localStorage
├── Auth: NextAuth.js (Credentials, GitHub, Google)
├── i18n: next-intl (FR/EN)
├── Charts: Recharts (Radar, Line, Area)
├── Animations: Framer Motion
├── PDF: jsPDF + jspdf-autotable
└── UI: Radix UI + Lucide Icons
```

### Structure des Dossiers
```
apex-next/
├── app/                      # Routes Next.js 15
│   ├── api/                  # API Routes
│   │   ├── analyze-job/      # Endpoint IA (mock)
│   │   └── auth/             # NextAuth handlers
│   ├── audit/                # Phase 1 - Diagnostic
│   ├── strategy/             # Phase 2 - Stratégie
│   ├── hub/                  # Centre de Commandement
│   ├── portrait/             # Portrait de Mutation
│   ├── cohort/               # Tableau de Bord Cohorte
│   ├── gpec/                 # Exigences Stratégiques
│   ├── auth/signin/          # Page de connexion
│   └── page.tsx              # Landing page
│
├── components/
│   ├── steps/                # Les 8 étapes de l'audit
│   │   ├── Step1Matrix.tsx   # Persona + Objectif
│   │   ├── Step2Context.tsx  # Contexte métier
│   │   ├── Step3Tasks.tsx    # Audit des tâches
│   │   ├── Step4Talents.tsx  # Sélection talents
│   │   ├── Step5Software.tsx # Outils maîtrisés
│   │   ├── Step6Verdict.tsx  # Dashboard résultats
│   │   ├── Step7Ikigai.tsx   # Matrice stratégique
│   │   └── Step8Roadmap.tsx  # Plan d'action
│   │
│   ├── ui/                   # Composants réutilisables
│   │   ├── NavigationButtons.tsx
│   │   ├── ResilienceRadar.tsx
│   │   ├── ResilienceSlider.tsx
│   │   ├── ScoreRing.tsx
│   │   ├── SelectionCard.tsx
│   │   ├── Stepper.tsx
│   │   ├── BackToHub.tsx
│   │   └── ResetButton.tsx
│   │
│   ├── AuditFlow.tsx         # Orchestrateur Phase 1
│   ├── StrategyFlow.tsx      # Orchestrateur Phase 2
│   ├── StrategyHub.tsx       # Centre de Commandement
│   ├── PortraitMutation.tsx  # Module Portrait
│   ├── CohortDashboard.tsx   # Gestion cohorte RH
│   ├── EnterpriseTarget.tsx  # Module GPEC
│   ├── EmployeeMatchResults.tsx  # Résultats matching (legacy)
│   └── GPECMatchingMatrix.tsx    # Matrice Matching Décideur ★★
│
├── lib/
│   ├── store.ts              # ZUSTAND STORE (~2500 lignes) ⭐
│   ├── lexicon.ts            # Dictionnaire dynamique
│   ├── reportGenerator.ts    # Export PDF
│   └── utils.ts              # Helpers (cn, colors)
│
├── messages/
│   ├── fr.json               # Traductions FR
│   └── en.json               # Traductions EN
│
└── i18n/                     # Config next-intl
```

---

## 3. État du Développement

### ✅ Fonctionnalités Complètes

| Module | Status | Notes |
|--------|--------|-------|
| Authentification | ✅ | NextAuth, mode demo (demo123) |
| Phase 1 Diagnostic | ✅ | 6 étapes complètes |
| Phase 2 Stratégie | ✅ | Ikigai + Roadmap |
| Export PDF | ✅ | jsPDF complet |
| Centre de Commandement | ✅ | Hub avec navigation |
| Portrait de Mutation | ✅ | Parcours Pivot |
| Mode Reclassement | ✅ | Nouveau parcours RH |
| Module GPEC | ✅ | Métiers de Demain + Compétences |
| Algorithme Matching | ✅ | **v2.3 : Multi-critères enrichi** ★★ |
| Gap de Compétences | ✅ | Affiché dans Roadmap |
| **Matrice Matching GPEC** | ✅ | **v2.3 : Vue décideur RH** ★★ |
| **Plan de Reskilling** | ✅ | **v2.3 : 3 phases intégrées** ★★ |
| Internationalisation | ✅ | FR/EN |
| Persistence | ✅ | localStorage via Zustand |

### 🔶 Fonctionnalités Partielles / Mock

| Module | Status | Notes |
|--------|--------|-------|
| API Analyze Job | 🔶 | Mock, prêt pour IA |
| OAuth GitHub/Google | 🔶 | Configuré mais nécessite clés |
| Invitations Cohorte | 🔶 | UI présente, backend absent |

### ❌ Non Implémenté

| Module | Notes |
|--------|-------|
| Intégration IA réelle | OpenAI/Anthropic pour analyse |
| Dashboard historique | Sauvegarde des audits passés |
| Notifications email | Pour cohorte RH |
| Export Excel GPEC | Gaps de compétences |

---

## 4. Store Zustand (Cœur de l'Application)

> **Fichier** : `lib/store.ts` (~2500 lignes)
> 
> C'est le cœur de l'application. Toute la logique métier est centralisée ici.

### Structure Principale

```typescript
interface AuditStore {
  // === NAVIGATION ===
  currentStep: number;  // 1-8
  
  // === CONTEXT (Step 1-2) ===
  context: {
    persona: 'salarie' | 'freelance' | 'leader' | null;
    goal: 'augmentation' | 'pivot' | 'reclassement' | null;
    jobTitle: string;
    jobDescription: string;
    industry: string;
    yearsExperience: number;
    teamSize: number;
    mutationDrivers: MutationDriver[];
  };
  
  // === TASKS (Step 3) ===
  tasks: Task[];  // Jusqu'à 5 tâches avec 5 curseurs de résilience
  
  // === TALENTS (Step 4) ===
  talents: Talent[];  // 12 disponibles, 5 à sélectionner
  
  // === SOFTWARE (Step 5) ===
  software: Software[];  // Jusqu'à 3 outils
  
  // === USER INTENTION (Pivot) ===
  userIntention: UserIntention;  // Portrait de Mutation
  
  // === ENTERPRISE TARGETS (GPEC) ===
  enterpriseTargets: EnterpriseTargets;  // Métiers de Demain + Matching
  
  // === COHORT DATA (Reclassement) ===
  cohortData: CohortData;  // Gestion de cohorte RH
  
  // === STRATEGY (Phase 2) ===
  strategy: {
    ikigai: IkigaiDimensions;
    eracActions: ERACAction[];
    opportunitesNiche: NicheOpportunity[];
    gapAnalysis: GapAnalysis;
    roadmap: RoadmapAction[];
    valueCurve: ValueCurvePoint[];
    businessModel: BusinessModel;
  };
  
  // === COMPUTED KPIs ===
  computedKPIs: ComputedKPIs;
}
```

### Actions Importantes

```typescript
// Navigation
setStep(step: number)
reset()  // Réinitialise tout le store

// Context
setPersona(persona)
setGoal(goal)
setJobTitle(title)
setMutationDrivers(drivers)

// Tasks
addTask(task)
updateTask(id, updates)
removeTask(id)

// Talents
toggleTalent(id)
setTalentLevel(id, level)
getSelectedTalents()

// User Intention (Pivot)
setPassionsConcretes(text)
setCarreDAs(talents)
setZoneDeRejet(text)
setHorizonCible(sector, jobs)
setManifesteHumain(text)

// Enterprise Targets (GPEC)
addFutureJob(job)
updateFutureJob(id, updates)
removeFutureJob(id)
addKeySkillToFutureJob(jobId, category, skill)
removeKeySkillFromFutureJob(jobId, category, skill)
calculateEmployeeMatches()  // ⭐ Algorithme de matching

// Cohort (Reclassement)
addCohortMember(member)
updateCohortMember(id, updates)
inviteCohortMembers()

// Strategy Generation
generateStrategy()  // Génère tout : Ikigai, ERAC, Roadmap, etc.
generateIkigai()
generateERACActions()
generateRoadmap()
generateNicheOpportunities()
generateGapAnalysis()
computeKPIs()
```

### Persistence

```typescript
// Le store utilise Zustand persist middleware
persist(
  (set, get) => ({ ... }),
  {
    name: 'apex-audit-storage',  // Clé localStorage
    partialize: (state) => ({
      // Seules ces propriétés sont persistées
      currentStep: state.currentStep,
      context: state.context,
      tasks: state.tasks,
      talents: state.talents,
      software: state.software,
      userIntention: state.userIntention,
      enterpriseTargets: state.enterpriseTargets,
      cohortData: state.cohortData,
      strategy: state.strategy,
      computedKPIs: state.computedKPIs,
    }),
  }
)
```

---

## 5. Composants Clés

### 5.1 StrategyHub.tsx (Centre de Commandement)

**Rôle** : Orchestration centrale après Step 1. Affiche les étapes disponibles selon le parcours.

```typescript
// Structure des nœuds
interface HubNode {
  id: string;
  step: number;
  title: { fr: string; en: string };
  subtitle: { fr: string; en: string };
  description: { fr: string; en: string };
  icon: LucideIcon;
  route: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

// Nœuds conditionnels selon le parcours
const visibleNodes = useMemo(() => {
  let nodes = [...HUB_NODES];
  
  if (isReclassement) {
    // Retire Portrait, ajoute Cohort + GPEC
    nodes = nodes.filter(n => n.id !== 'portrait');
    nodes.splice(1, 0, COHORT_NODE, ENTERPRISE_TARGET_NODE);
  } else if (isAugmentation) {
    // Retire Portrait complètement
    nodes = nodes.filter(n => n.id !== 'portrait');
  }
  
  return nodes;
}, [isReclassement, isAugmentation]);
```

### 5.2 Step1Matrix.tsx (Matrice Persona/Objectif)

**Rôle** : Première étape, sélection du profil et de l'objectif.

```typescript
// Les objectifs varient selon le persona
const getGoalOptions = (persona, locale) => {
  const baseGoals = [
    { id: 'augmentation', ... },
    { id: 'pivot', ... },
  ];
  
  // Leader/RH a accès au mode Reclassement
  if (persona === 'leader') {
    baseGoals.push({
      id: 'reclassement',
      title: "Cellule de Reclassement Stratégique",
      ...
    });
  }
  
  return baseGoals;
};
```

### 5.3 Step7Ikigai.tsx (Matrice Stratégique)

**Rôle** : Visualisation stratégique avec Radar Chart, Value Curves, ERAC, Métiers Refuges.

**Sections conditionnelles** :
- Filtre d'Aspiration (Pivot uniquement)
- Module GPEC avec EmployeeMatchResults (Reclassement uniquement)

### 5.4 Step8Roadmap.tsx (Plan d'Action)

**Rôle** : Affichage du plan d'action en 3 piliers avec checkboxes.

**Piliers selon parcours** :
- **Augmentation** : Délégation, Renforcement, Positionnement
- **Pivot** : Désengagement, Océan Bleu, Atterrissage

**Section GPEC** : Gap de Compétences avec heures de formation (Reclassement uniquement)

### 5.5 PortraitMutation.tsx

**Rôle** : Capture du portrait humain pour le parcours Pivot.

**Sections** :
1. Passions Concrètes (texte libre)
2. Le Carré d'As (4 talents naturels)
3. Zone de Rejet (anti-talents)
4. L'Horizon Cible (secteur + 2 métiers idéaux)
5. Le Manifeste Humain (vision)

### 5.6 EnterpriseTarget.tsx (Module GPEC)

**Rôle** : Définition des Métiers de Demain et Compétences Clés.

**Fonctionnalités** :
- Ajout/suppression de postes cibles
- Gestion des compétences par catégorie (Haptique, Relationnelle, Technique)
- Déclenchement du calcul de matching

### 5.7 EmployeeMatchResults.tsx

**Rôle** : Affichage des résultats de matching collaborateurs × postes.

**Données affichées** :
- Score de compatibilité (cercle progressif)
- Recommandation (Idéal/Bon/Possible/Difficile)
- Points forts identifiés
- Gap de compétences avec niveau actuel → requis
- Heures de formation par compétence

---

## 6. Routes et Navigation

### Tableau des Routes

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` | Landing page |
| `/auth/signin` | NextAuth | Page de connexion |
| `/audit` | `AuditFlow.tsx` | Phase 1 - Steps 1-6 |
| `/hub` | `StrategyHub.tsx` | Centre de Commandement |
| `/portrait` | `PortraitMutation.tsx` | Portrait de Mutation |
| `/cohort` | `CohortDashboard.tsx` | Tableau de Bord Cohorte |
| `/gpec` | `EnterpriseTarget.tsx` | Exigences Stratégiques |
| `/strategy` | `StrategyFlow.tsx` | Phase 2 - Steps 7-8 |

### Flux de Navigation

```
/ (Landing)
   │
   └──► /auth/signin (si non authentifié)
          │
          └──► /audit (Step 1 - Matrice)
                 │
                 └──► /hub (Centre de Commandement)
                        │
                        ├──► /audit (Diagnostic - Steps 2-6)
                        │       └──► Retour /hub
                        │
                        ├──► /portrait (si Pivot)
                        │       └──► Retour /hub
                        │
                        ├──► /cohort (si Reclassement)
                        │       └──► Retour /hub
                        │
                        ├──► /gpec (si Reclassement)
                        │       └──► Retour /hub
                        │
                        └──► /strategy (Steps 7-8)
                               └──► Export PDF / Nouvel Audit
```

---

## 7. Fonctionnalités par Module

### 7.1 Authentification

**Fichiers** : `app/api/auth/[...nextauth]/route.ts`, `lib/auth.ts`

```typescript
// Providers configurés
providers: [
  CredentialsProvider({
    // Mode demo : tout email avec password "demo123"
  }),
  GitHubProvider({ ... }),  // Nécessite GITHUB_ID/SECRET
  GoogleProvider({ ... }),  // Nécessite GOOGLE_CLIENT_ID/SECRET
]
```

### 7.2 Internationalisation

**Fichiers** : `messages/fr.json`, `messages/en.json`, `i18n/request.ts`

```typescript
// Usage dans les composants
const t = useTranslations('audit');
const locale = useLocale();
const l = locale === 'fr' ? 'fr' : 'en';

// Textes inline avec objet { fr: '...', en: '...' }
const label = { fr: 'Continuer', en: 'Continue' }[l];
```

### 7.3 Export PDF

**Fichier** : `lib/reportGenerator.ts`

```typescript
generatePDFReport({
  context,
  tasks,
  talents,
  software,
  strategy,
  computedKPIs,
  generatedAt,
}, locale);

// Génère un PDF structuré :
// - Page de garde
// - Synthèse Executive
// - Méthodologie
// - Audit Détaillé (tâches, talents)
// - Matrice ERAC
// - Plan d'Action
```

### 7.4 Moteur de Matching GPEC Enrichi (v2.3) ★★

**Fichier** : `lib/store.ts` → `calculateEmployeeMatches()`

L'algorithme de matching a été complètement refactorisé en v2.3 pour devenir un véritable **moteur multi-critères**.

#### Sources de Données Analysées

```
OFFRE (Portrait du Salarié)          DEMANDE (Poste Cible)
├── 12 Talents Stratégiques     ×     ├── Compétences Requises
├── Scores de Résilience (5D)   ×     │   ├── Haptique
│   ├── Données                       │   ├── Relationnelle
│   ├── Décision                      │   └── Technique
│   ├── Relationnel                   │
│   ├── Créativité                    ├── Niveau Requis (1-5)
│   └── Exécution                     ├── Score de Criticité
├── Carré d'As (4 talents innés)      └── Résistance Automatisation
└── Zone de Rejet (malus)
```

#### Logique de Calcul du Score

```typescript
calculateEmployeeMatches: () => set((state) => {
  // 1. Calcul profil de résilience moyen des tâches
  const avgResilience = calculateAverageResilience(state.tasks);
  
  // 2. Extraction des talents innés du Carré d'As
  const innateSkills = extractInnateSkills(state.userIntention.carreDAs);
  
  // 3. Zone de rejet pour pénaliser les mauvais matchs
  const rejectZone = state.userIntention.zoneDeRejet || [];
  
  for (const member of cohortData.members) {
    for (const job of enterpriseTargets.futureJobs) {
      // Pour chaque compétence requise du poste :
      for (const comp of job.requiredCompetences) {
        let currentLevel = 2;  // Base
        
        // BONUS Talents Stratégiques (+1-2 niveaux)
        if (talentMatchesCategory(selectedTalents, comp.category)) {
          currentLevel += Math.floor(talent.level / 2);
        }
        
        // BONUS Scores de Résilience (+1 niveau si > 70%)
        if (avgResilience[comp.category] > 70) {
          currentLevel += 1;
        }
        
        // BONUS Carré d'As (+1 niveau si matching sémantique)
        if (innateSkillMatches(innateSkills, comp.name)) {
          currentLevel += 1;
        }
        
        // MALUS Zone de Rejet (-1 niveau)
        if (competenceInRejectZone(comp, job, rejectZone)) {
          currentLevel -= 1;
        }
      }
      
      // BONUS Résistance à l'Automatisation
      const resilienceBonus = (job.automationResistance / 100) * 10;
      
      // Score final
      const compatibilityScore = baseScore + resilienceBonus;
    }
  }
});
```

#### Heures de Formation

```typescript
// Calcul pondéré par criticité de la compétence
const trainingHours = Math.abs(gap) * (20 + Math.floor(comp.criticalityScore / 20));
// Gap de 1 niveau, criticité 80% → 36h de formation
// Gap de 2 niveaux, criticité 100% → 80h de formation
```

### 7.5 Matrice de Matching GPEC (v2.3) ★★

**Fichier** : `components/GPECMatchingMatrix.tsx`

Nouvelle vue décideur pour les RH permettant de voir d'un coup d'œil quel salarié est le plus apte pour quel poste.

#### Fonctionnalités

| Fonction | Description |
|----------|-------------|
| **Dashboard KPIs** | Compteurs par recommandation (Idéal/Bon/Possible/Difficile) |
| **Filtre par poste** | Sélectionner un poste cible spécifique |
| **Filtre par recommandation** | Voir uniquement les candidats "Idéal", etc. |
| **Vue par poste** | Candidats triés par score décroissant |
| **Meilleur candidat** | Badge et mise en évidence pour chaque poste |
| **Total formation** | Heures de formation agrégées |
| **Modal détail** | Vue complète d'un match avec gaps détaillés |

#### Structure du Composant

```typescript
interface MatchingMatrixProps {
  onSelectMatch?: (match: EmployeeMatch) => void;
}

// Statistiques globales
const stats = useMemo(() => ({
  total: matches.length,
  ideal: matches.filter(m => m.recommendation === 'ideal').length,
  good: matches.filter(m => m.recommendation === 'good').length,
  possible: matches.filter(m => m.recommendation === 'possible').length,
  difficult: matches.filter(m => m.recommendation === 'difficult').length,
  avgScore: Math.round(matches.reduce((acc, m) => acc + m.compatibilityScore, 0) / total),
  totalTrainingHours: sumTrainingHours(matches),
}), [matches]);
```

### 7.6 Plan de Reskilling (v2.3) ★★

**Fichier** : `components/steps/Step8Roadmap.tsx`

Nouvelle section "Stratégie de Reskilling Recommandée" intégrée au Roadmap pour le mode GPEC.

#### 3 Phases

| Phase | Durée | Description |
|-------|-------|-------------|
| **1. Évaluation** | 2-4 semaines | Validation des portraits avec entretiens individuels |
| **2. Formation** | Variable | Parcours de reskilling personnalisés (budget = total heures) |
| **3. Transition** | 1-3 mois | Affectation aux postes cibles avec accompagnement |

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Phase 1 : Évaluation */}
  <div className="p-4 rounded-xl bg-blue-500/10">...</div>
  
  {/* Phase 2 : Formation */}
  <div className="p-4 rounded-xl bg-amber-500/10">
    Budget estimé: {totalTrainingHours}h
  </div>
  
  {/* Phase 3 : Transition */}
  <div className="p-4 rounded-xl bg-emerald-500/10">...</div>
</div>
```

---

## 8. Points d'Attention

### 8.1 Dette Technique

| Élément | Description | Priorité |
|---------|-------------|----------|
| Store monolithique | `store.ts` fait ~2500 lignes, pourrait être splitté | Moyenne |
| Types any implicites | Quelques endroits avec types non stricts | Basse |
| Tests absents | Aucun test unitaire/e2e | Haute |
| Vulnérabilités npm | 4 vulnérabilités signalées (jspdf deps) | Moyenne |

### 8.2 Points Sensibles

1. **Persistence localStorage** : Si le schéma du store change, les anciennes données peuvent causer des bugs. Le bouton "Nouvel Audit" permet de reset.

2. **Calcul des scores** : Les formules de vulnérabilité et résilience sont dans `store.ts`. Toute modification doit être testée car elle impacte tous les résultats.

3. **Mode Reclassement** : Le flux est plus complexe car il implique des données de cohorte qui ne sont pas encore connectées à un backend.

4. **Matching GPEC** : L'algorithme est basique (mock). Pour une vraie implémentation, il faudrait :
   - Une base de données de compétences normalisées
   - Un algorithme de matching plus sophistiqué (NLP, embeddings)

### 8.3 Limitations Connues

- **Pas de backend** : Tout est côté client (localStorage)
- **Pas de multi-utilisateurs** : Un seul audit à la fois
- **API IA mock** : L'endpoint `/api/analyze-job` retourne des données simulées
- **Cohorte non fonctionnelle** : L'envoi d'invitations est un placeholder

---

## 9. Prochaines Étapes Suggérées

### 9.1 Court Terme (Quick Wins)

1. **Ajouter des tests**
   - Jest + React Testing Library pour les composants
   - Tests du store Zustand

2. **Fixer les vulnérabilités npm**
   ```bash
   npm audit fix --force
   ```

3. **Améliorer le matching GPEC**
   - Ajouter des pondérations par compétence
   - Affiner le calcul des heures de formation

### 9.2 Moyen Terme

1. **Intégration IA**
   - Connecter OpenAI/Anthropic pour l'analyse de postes
   - Génération automatique des tâches depuis une description

2. **Backend**
   - Prisma + PostgreSQL pour persister les audits
   - API REST ou tRPC

3. **Dashboard Historique**
   - Liste des audits passés
   - Comparaison entre versions

### 9.3 Long Terme

1. **Mode SaaS**
   - Multi-tenant
   - Abonnements
   - Dashboard admin RH

2. **Fonctionnalités Avancées**
   - Benchmarking sectoriel
   - Rapports comparatifs
   - Intégration SIRH

---

## 10. Instructions de Démarrage

### 10.1 Installation

```bash
# Cloner le repo
git clone https://github.com/gregjazzy/ApexNext.git
cd ApexNext

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés
```

### 10.2 Variables d'Environnement

```env
# .env.local

# NextAuth (obligatoire)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-32-caracteres-minimum

# OAuth (optionnel)
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# IA (pour intégration future)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

### 10.3 Démarrage

```bash
# Développement
npm run dev

# Production
npm run build
npm start

# Lint
npm run lint
```

### 10.4 Accès Application

- **URL** : http://localhost:3000
- **Login Demo** : n'importe quel email + mot de passe `demo123`

### 10.5 Reset des Données

Si l'application se comporte bizarrement :
1. Ouvrir les DevTools (F12)
2. Application → Local Storage
3. Supprimer `apex-audit-storage`
4. Rafraîchir la page

Ou utiliser le bouton "Nouvel Audit" présent sur toutes les pages.

---

## 📞 Contacts & Ressources

| Ressource | Lien |
|-----------|------|
| Repository | https://github.com/gregjazzy/ApexNext |
| Documentation | README.md |
| Changelog | Commits Git |

---

<p align="center">
  <em>Document généré le Janvier 2026 — APEX Next v2.2</em>
</p>
