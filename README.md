# APEX Next v2.2

> **GPS de la Mutation Professionnelle face à l'IA**

APEX Next est un outil de diagnostic stratégique qui évalue la résilience professionnelle face à l'automatisation (IA + Robotique) et génère un plan d'action personnalisé avec synchronisation totale des données Audit + Portrait Humain.

![Version](https://img.shields.io/badge/version-2.2-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Concept

APEX Next analyse votre profil professionnel à travers **8 étapes** pour identifier vos vulnérabilités et opportunités face à la transformation digitale :

### Centre de Commandement (StrategyHub) ★
Après la sélection du Persona et de l'Objectif, l'utilisateur accède au **Centre de Commandement** — une cartographie visuelle des étapes à compléter :

| Étape | Nom | Status |
|-------|-----|--------|
| 1 | Diagnostic de Vulnérabilité | Obligatoire |
| 2 | Portrait de Mutation | Requis (Pivot) / Absent (Augmentation) |
| 2b | Tableau de Bord de Cohorte | Mode Reclassement uniquement ★ |
| 2c | Exigences Stratégiques (GPEC) | Mode Reclassement uniquement ★ |
| 3 | Arbitrage Stratégique (Ikigai) | Obligatoire |
| 4 | Roadmap Opérationnelle | Obligatoire |

### Phase 1 : Diagnostic (Étapes 1-6)
1. **La Matrice** - Sélection du profil et objectif
   - Persona : Salarié / Freelance / Leader-RH
   - Objectif : Augmentation / Pivot / **Reclassement (PSE)** ★
2. **Context Mapping** - Poste, secteur, description de missions
3. **Audit des Processus** - Analyse des tâches avec 5 curseurs de résilience
4. **Inventaire des Actifs** - Sélection de 5 talents parmi 12 compétences stratégiques
5. **Tech Scan** - Évaluation de la maîtrise des outils (3 maximum)
6. **Le Verdict** - Dashboard avec score global et radar de résilience

### Phase 2 : Stratégie (Étapes 7-8)
7. **Matrice Ikigai 2.0** - Visualisation 4 dimensions + Métiers Refuges + Value Curves
   - **Module GPEC** : Analyse de Réemployabilité avec matching collaborateurs × Métiers de Demain ★
8. **Plan d'Action** - Roadmap en 3 piliers avec :
   - Actions dynamiques basées sur les données de l'audit
   - KPIs de résilience (score 1-10)
   - Outils suggérés par action
   - **Gap de Compétences GPEC** avec heures de formation ★

---

## 🆕 Nouveautés v2.2

### Mode Reclassement / PSE (Leader RH) ★
Un nouveau parcours dédié aux RH pilotant un plan de reclassement collectif :
- **Cellule de Reclassement Stratégique** comme option dans la Matrice
- **Tableau de Bord de Cohorte** avec progression des collaborateurs
- **Génération d'invitations** pour les collaborateurs

### Module GPEC (Exigences Stratégiques) ★
Interface pour définir les besoins de l'organisation :
- **Métiers de Demain** : postes cibles à pourvoir
- **Compétences Clés** par catégorie :
  - Haptiques (dextérité, coordination)
  - Relationnelles (négociation, empathie)
  - Techniques (Python, Figma, etc.)

### Algorithme de Matching ★
Calcul automatique de la compatibilité collaborateur × poste cible :
- **Score de Compatibilité** (0-100%)
- **Recommandation** : Idéal / Bonne Affinité / Possible / Difficile
- **Gap de Compétences** avec :
  - Niveau actuel vs niveau requis
  - Heures de formation estimées
  - Catégorie de compétence

### Interface Améliorée
- **Bouton "Nouvel Audit"** visible et explicite sur toutes les pages
- **Navigation Hub** avec badges de statut (Terminé / À faire / Verrouillé)
- **Compteur de progression** corrigé (0/4 étapes)

---

## 🏗️ Architecture

```
apex-next/
├── app/
│   ├── api/
│   │   ├── analyze-job/        # Endpoint IA (mock, prêt pour intégration)
│   │   └── auth/               # NextAuth.js routes
│   ├── auth/
│   │   ├── signin/             # Page de connexion
│   │   └── error/              # Page d'erreur auth
│   ├── audit/                  # PHASE 1 - Diagnostic (Steps 1-6)
│   ├── strategy/               # PHASE 2 - Stratégie (Steps 7-8)
│   ├── hub/                    # Centre de Commandement ★
│   ├── portrait/               # Portrait de Mutation (standalone) ★
│   ├── cohort/                 # Tableau de Bord Cohorte (GPEC) ★
│   ├── gpec/                   # Exigences Stratégiques (GPEC) ★
│   ├── globals.css             # Design System "Expert Dark"
│   ├── layout.tsx              # Root layout avec providers
│   └── page.tsx                # Landing page
├── components/
│   ├── steps/                  # Composants des 8 étapes
│   │   ├── Step1Matrix.tsx     # + Mode Reclassement ★
│   │   ├── Step2Context.tsx
│   │   ├── Step3Tasks.tsx
│   │   ├── Step4Talents.tsx
│   │   ├── Step5Software.tsx
│   │   ├── Step6Verdict.tsx    # → Redirige vers /hub
│   │   ├── Step7Ikigai.tsx     # + Module GPEC ★
│   │   └── Step8Roadmap.tsx    # + Gap de Compétences ★
│   ├── ui/                     # Composants UI réutilisables
│   │   ├── NavigationButtons.tsx
│   │   ├── ResilienceRadar.tsx
│   │   ├── ResilienceSlider.tsx
│   │   ├── ScoreRing.tsx
│   │   ├── SelectionCard.tsx
│   │   ├── Stepper.tsx
│   │   ├── BackToHub.tsx       # Navigation retour Hub ★
│   │   └── ResetButton.tsx     # Bouton Nouvel Audit ★
│   ├── AuditFlow.tsx           # Orchestrateur Phase 1
│   ├── StrategyFlow.tsx        # Orchestrateur Phase 2
│   ├── StrategyHub.tsx         # Centre de Commandement ★
│   ├── PortraitMutation.tsx    # Module Portrait (Pivot)
│   ├── CohortDashboard.tsx     # Tableau de Bord Cohorte ★
│   ├── EnterpriseTarget.tsx    # Module GPEC ★
│   └── EmployeeMatchResults.tsx # Résultats Matching GPEC ★
├── lib/
│   ├── store.ts                # Zustand store (~2500 lignes)
│   ├── lexicon.ts              # Dictionnaire dynamique par persona
│   ├── reportGenerator.ts      # Export PDF (jsPDF)
│   └── utils.ts                # Utilitaires (cn, getResilienceColor)
├── types/
│   └── jspdf-autotable.d.ts    # Types jsPDF
├── messages/
│   ├── fr.json                 # Traductions français
│   └── en.json                 # Traductions anglais
└── i18n/                       # Configuration next-intl
```

★ = Nouveaux fichiers v2.2

---

## 🔧 Stack Technique

| Technologie | Usage |
|------------|-------|
| **Next.js 15** | Framework React avec App Router |
| **TypeScript** | Typage statique |
| **Tailwind CSS** | Design System "Expert Dark" |
| **Zustand** | State management avec persistence |
| **Framer Motion** | Animations et transitions |
| **Recharts** | Visualisations (Radar Chart, Value Curves) |
| **NextAuth.js** | Authentification (Credentials, GitHub, Google) |
| **next-intl** | Internationalisation (FR/EN) |
| **Radix UI** | Composants accessibles (Slider, Select) |
| **Lucide React** | Icônes |
| **jsPDF + autotable** | Export PDF stratégique |

---

## 📊 Modèle de Données

### Store Zustand (`lib/store.ts`)

```typescript
interface AuditStore {
  // Navigation
  currentStep: number;  // 1-8
  
  // Context
  context: {
    persona: 'salarie' | 'freelance' | 'leader' | null;
    goal: 'augmentation' | 'pivot' | 'reclassement' | null;  // ★ + reclassement
    jobTitle: string;
    industry: string;
    jobDescription: string;
    mutationDrivers: MutationDriver[];  // Filtres d'aspiration (Pivot)
  };
  
  // Tasks (5 dimensions de résilience)
  tasks: Array<{
    id: string;
    name: string;
    temporalite: 'quotidien' | 'hebdomadaire' | 'mensuel' | 'strategique';
    hoursPerWeek: number;
    resilience: {
      donnees: number;      // 0-100 : Vulnérabilité IA données
      decision: number;     // 0-100 : Prise de décision
      relationnel: number;  // 0-100 : Aspect humain
      creativite: number;   // 0-100 : Innovation
      execution: number;    // 0-100 : Vulnérabilité robotique
    };
  }>;
  
  // Talents (5 sur 12 actifs stratégiques)
  talents: Array<{
    id: string;
    name: string;
    description: string;
    level: number;  // 1-5
    selected: boolean;
  }>;
  
  // User Intention (Pivot) ★
  userIntention: {
    passionsConcretes: string;
    carreDAs: string[];      // 4 talents naturels
    zoneDeRejet: string;
    horizonCible: {
      secteurCible: string;
      metiersIdeaux: string[];
    };
    manifesteHumain: string;
  };
  
  // Enterprise Targets (GPEC) ★
  enterpriseTargets: {
    targetName: string;
    futureJobs: Array<{
      id: string;
      title: string;
      description: string;
      keySkills: {
        haptic: string[];
        relational: string[];
        technical: string[];
      };
      requiredLevel: number;
    }>;
    employeeMatches: EmployeeMatch[];  // Résultats matching
  };
  
  // Cohort Data (Reclassement) ★
  cohortData: {
    name: string;
    targetCompletionDate: string | null;
    members: CohortMember[];
    stats: {
      total: number;
      completed: number;
      inProgress: number;
      notStarted: number;
    };
  };
  
  // Strategy (Phase 2)
  strategy: {
    ikigai: IkigaiDimensions;
    eracActions: ERACAction[];
    opportunitesNiche: NicheOpportunity[];
    gapAnalysis: GapAnalysis;
    roadmap: RoadmapAction[];
    valueCurve: ValueCurvePoint[];
    businessModel: BusinessModel;
  };
}
```

### Interface EmployeeMatch (GPEC) ★

```typescript
interface EmployeeMatch {
  employeeId: string;
  employeeName: string;
  futureJobId: string;
  futureJobTitle: string;
  compatibilityScore: number;        // 0-100%
  recommendation: 'ideal' | 'good' | 'possible' | 'difficult';
  strengths: string[];
  competenceGaps: Array<{
    competenceId: string;
    competenceName: string;
    category: 'haptique' | 'relationnelle' | 'technique';
    currentLevel: number;
    requiredLevel: number;
    gap: number;
    trainingHours: number;
  }>;
}
```

---

## 🎨 Design System

### Thème "Expert Dark"

```css
/* Fond */
background: slate-950 avec grille technique

/* Cartes */
.apex-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgb(30, 41, 59);
  backdrop-filter: blur(12px);
}

/* Typographie */
Titres: font-serif (autorité)
UI/Data: font-sans (Inter)

/* Couleurs sémantiques */
Résilient (≥60%): emerald
Vulnérable (40-59%): amber
Critique (<40%): rose

/* Couleurs par parcours */
Augmentation: emerald-500
Pivot: indigo-500 / violet-500
Reclassement: rose-500 / violet-500  ★
```

### Couleurs Catégories de Compétences (GPEC) ★

| Catégorie | Couleur |
|-----------|---------|
| Haptique | amber |
| Relationnelle | rose |
| Technique | blue |

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Démarrage

```bash
# Cloner le repo
git clone https://github.com/gregjazzy/ApexNext.git
cd ApexNext

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build
npm start
```

### Variables d'environnement

Créer un fichier `.env.local` :

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth (optionnel)
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret

# IA (pour intégration future)
OPENAI_API_KEY=your-openai-key
# ou
ANTHROPIC_API_KEY=your-anthropic-key
```

---

## 🔐 Authentification

### Mode Démo
- Email : n'importe quel email valide
- Password : `demo123`

### Providers OAuth
- GitHub
- Google

---

## 🌍 Internationalisation

L'application supporte **Français** (défaut) et **Anglais**.

Le sélecteur de langue est disponible dans le header. La préférence est persistée via cookie `NEXT_LOCALE`.

---

## 📁 Parcours Utilisateur

### Parcours Standard (Salarié/Freelance)

```
Matrice (Persona + Objectif)
    ↓
Centre de Commandement (Hub)
    ├── Diagnostic de Vulnérabilité (Steps 2-6)
    │       ↓
    ├── Portrait de Mutation (si Pivot)
    │       ↓
    ├── Arbitrage Stratégique (Ikigai + ERAC)
    │       ↓
    └── Roadmap Opérationnelle (Plan d'Action)
```

### Parcours Reclassement (Leader RH) ★

```
Matrice (Leader + Reclassement)
    ↓
Centre de Commandement (Hub)
    ├── Diagnostic de Vulnérabilité
    │       ↓
    ├── Tableau de Bord de Cohorte
    │   └── Progression collaborateurs (X/50 complétés)
    │       ↓
    ├── Exigences Stratégiques (GPEC)
    │   └── Définition Métiers de Demain + Compétences Clés
    │       ↓
    ├── Arbitrage Stratégique
    │   └── Module GPEC : Analyse de Réemployabilité
    │   └── Matching collaborateurs × postes cibles
    │       ↓
    └── Roadmap Opérationnelle
        └── Gap de Compétences par collaborateur
        └── Heures de formation totales
```

---

## 🔌 API Endpoints

### `POST /api/analyze-job`

Analyse IA du document de poste (mock actuellement, prêt pour intégration).

**Request:**
```json
{
  "jobDescription": "...",
  "jobTitle": "Chef de projet",
  "industry": "tech",
  "persona": "salarie"
}
```

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "name": "Coordination équipes",
      "hoursPerWeek": 10,
      "temporalite": "quotidien",
      "resilience": {
        "donnees": 30,
        "decision": 60,
        "relationnel": 85,
        "creativite": 45,
        "execution": 20
      }
    }
  ],
  "summary": "5 tâches identifiées"
}
```

---

## 🛠️ Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run start` | Démarrer en production |
| `npm run lint` | Linter ESLint |

---

## 📈 Roadmap

### ✅ Complété
- [x] Phase 1 : Diagnostic (6 étapes)
- [x] Phase 2 : Stratégie (Ikigai + Roadmap)
- [x] Authentification NextAuth
- [x] Internationalisation FR/EN
- [x] Radar Chart résilience
- [x] Lexique dynamique par persona
- [x] Export PDF stratégique (jsPDF)
- [x] Module Portrait de Mutation (Pivot)
- [x] Synchronisation Totale Plan d'Action (Audit + Portrait Humain)
- [x] Séparation Phase 1/Phase 2 avec routes distinctes
- [x] KPIs de résilience et outils suggérés
- [x] Centre de Commandement (StrategyHub) ★
- [x] Mode Reclassement / PSE pour Leader RH ★
- [x] Module GPEC (Exigences Stratégiques) ★
- [x] Algorithme de Matching avec score de compatibilité ★
- [x] Gap de Compétences dans le Roadmap ★
- [x] Bouton Reset explicite et visible ★

### 🔜 À venir
- [ ] Intégration IA (OpenAI/Anthropic) pour analyse documents
- [ ] Dashboard historique des audits
- [ ] Pondération des scores par persona/objectif
- [ ] Export Excel du Gap de Compétences (GPEC)
- [ ] Notifications email pour collaborateurs (Reclassement)
- [ ] Benchmarking sectoriel

---

## 📄 License

MIT © 2024 APEX Next

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de créer une issue ou une pull request.

---

<p align="center">
  <strong>APEX Next</strong> — Votre GPS de la Mutation Professionnelle
</p>
