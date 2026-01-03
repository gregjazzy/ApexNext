# APEX Next v2.1

> **GPS de la Mutation Professionnelle face à l'IA**

APEX Next est un outil de diagnostic stratégique qui évalue la résilience professionnelle face à l'automatisation (IA + Robotique) et génère un plan d'action personnalisé avec synchronisation totale des données Audit + Portrait Humain.

![Version](https://img.shields.io/badge/version-2.1-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Concept

APEX Next analyse votre profil professionnel à travers **8 étapes** pour identifier vos vulnérabilités et opportunités face à la transformation digitale :

### Phase 1 : Diagnostic (Étapes 1-6)
1. **La Matrice** - Sélection du profil (Salarié/Freelance/Leader) et objectif (Augmentation/Pivot)
2. **Context Mapping** - Poste, secteur, description de missions
3. **Audit des Processus** - Analyse des tâches avec 5 curseurs de résilience
4. **Inventaire des Actifs** - Sélection de 5 talents parmi 12 compétences stratégiques
5. **Tech Scan** - Évaluation de la maîtrise des outils (3 maximum)
6. **Le Verdict** - Dashboard avec score global et radar de résilience

### Phase 2 : Stratégie (Étapes 7-8)
7. **Matrice Ikigai 2.0** - Visualisation 4 dimensions + Métiers Refuges + Value Curves
8. **Plan d'Action** - Roadmap en 3 piliers avec actions dynamiques, KPIs de résilience et outils suggérés

### Module Portrait de Mutation (Parcours Pivot)
Pour le parcours "Pivot", un module additionnel capture le portrait humain :
- **Passions Concrètes** - Ce qui fait vibrer l'utilisateur
- **Le Carré d'As** - 4 talents naturels
- **Zone de Rejet** - Ce qui épuise l'énergie
- **L'Horizon Cible** - Secteur cible + 2 métiers idéaux
- **Le Manifeste Humain** - Vision et impact souhaité

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
│   ├── strategy/               # PHASE 2 - Stratégie (Steps 7-8) ★
│   ├── globals.css             # Design System "Expert Dark"
│   ├── layout.tsx              # Root layout avec providers
│   └── page.tsx                # Landing page
├── components/
│   ├── steps/                  # Composants des 8 étapes
│   │   ├── Step1Matrix.tsx
│   │   ├── Step2Context.tsx
│   │   ├── Step3Tasks.tsx
│   │   ├── Step4Talents.tsx
│   │   ├── Step5Software.tsx
│   │   ├── Step6Verdict.tsx    # → Redirige vers /strategy
│   │   ├── Step7Ikigai.tsx
│   │   └── Step8Roadmap.tsx    # + Export PDF
│   ├── ui/                     # Composants UI réutilisables
│   │   ├── NavigationButtons.tsx
│   │   ├── ResilienceRadar.tsx
│   │   ├── ResilienceSlider.tsx
│   │   ├── ScoreRing.tsx
│   │   ├── SelectionCard.tsx
│   │   ├── Stepper.tsx
│   │   └── ...
│   ├── AuditFlow.tsx           # Orchestrateur Phase 1
│   ├── StrategyFlow.tsx        # Orchestrateur Phase 2 ★
│   └── PortraitMutation.tsx    # Module Portrait (Pivot) ★
├── lib/
│   ├── store.ts                # Zustand store avec persistence (~2100 lignes)
│   ├── lexicon.ts              # Dictionnaire dynamique par persona
│   ├── reportGenerator.ts      # Export PDF (jsPDF) ★
│   └── utils.ts                # Utilitaires (cn, getResilienceColor)
├── types/
│   └── jspdf-autotable.d.ts    # Types jsPDF ★
├── messages/
│   ├── fr.json                 # Traductions français
│   └── en.json                 # Traductions anglais
└── i18n/                       # Configuration next-intl
```

★ = Nouveaux fichiers v2.1

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
| **jsPDF + autotable** | Export PDF stratégique ★ |

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
    goal: 'augmentation' | 'pivot' | null;
    jobTitle: string;
    industry: string;
    jobDescription: string;
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
    example: string;
    level: number;  // 1-5
    selected: boolean;
  }>;
  
  // Software (3 max)
  software: Array<{
    id: string;
    name: string;
    level: 'debutant' | 'avance' | 'expert';
  }>;
  
  // Strategy (Phase 2)
  strategy: {
    capitalActif: number;
    zoneRisque: number;
    opportunitesNiche: NicheOpportunity[];
    levierEconomique: number;
    roadmap: RoadmapAction[];
    generatedAt: number | null;
    parcours: 'augmentation' | 'pivot' | null;
  };
}
```

### Les 12 Actifs Stratégiques

| ID | Nom | Description |
|----|-----|-------------|
| `arbitrage-incertitude` | Arbitrage en Incertitude | Décider quand les données sont incomplètes |
| `synthese-strategique` | Synthèse Stratégique | Transformer l'information en vision claire |
| `intelligence-negociation` | Intelligence de Négociation | Gérer conflits et accords complexes |
| `pensee-systemique` | Pensée Systémique | Comprendre les impacts organisationnels |
| `diagnostic-crise` | Diagnostic de Crise | Identifier et résoudre les problèmes inédits |
| `tactique-relationnelle` | Tactique Relationnelle | Construire des réseaux d'influence |
| `innovation-rupture` | Innovation de Rupture | Imaginer des concepts nouveaux |
| `pilotage-ia` | Pilotage de l'IA (IA Ops) | Orchestrer des agents IA |
| `ethique-gouvernance` | Éthique & Gouvernance | Responsabilité des décisions automatisées |
| `leadership-transition` | Leadership de Transition | Mobiliser dans les phases de mutation |
| `analyse-critique` | Analyse Critique & Biais | Détecter erreurs et biais IA |
| `communication-influence` | Communication d'Influence | Convaincre des parties divergentes |

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
```

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

## 📁 Structure des Étapes

### Étape 1 : La Matrice
```
Persona → Salarié | Freelance | Leader/RH
Objectif → Augmentation (optimiser) | Pivot (transformer)
```

Le lexique UI s'adapte dynamiquement selon le persona sélectionné.

### Étape 3 : Audit des Processus
Chaque tâche est évaluée sur **5 dimensions** :
1. **Données** - Vulnérabilité à l'automatisation IA
2. **Décision** - Complexité du jugement requis
3. **Relationnel** - Nécessité d'interactions humaines
4. **Créativité** - Besoin d'innovation
5. **Exécution Physique** - Vulnérabilité robotique

### Étape 6 : Le Verdict
- **Score Global** = (Résilience × 0.6) + (Talents × 0.4)
- Radar Chart des 5 dimensions
- Zones vulnérables vs résilientes

### Étape 7 : Matrice Ikigai 2.0
4 dimensions visualisées :
1. **Capital Actif** - Force talents + tech
2. **Zone de Risque** - Vulnérabilité automatisation
3. **Opportunités** - Score moyen métiers refuges
4. **Levier Économique** - Potentiel marché

### Étape 8 : Plan d'Action
3 piliers :
1. **Délégation Technologique** - Automatiser le low-value
2. **Renforcement de Signature** - Consolider les talents
3. **Positionnement Marché** - Affirmer sa différenciation

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
- [ ] Intégration IA (OpenAI/Anthropic) pour analyse documents
- [ ] Dashboard historique des audits
- [ ] Pondération des scores par persona/objectif

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
