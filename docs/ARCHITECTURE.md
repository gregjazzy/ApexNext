# Architecture Technique APEX Next v2.1

Ce document détaille l'architecture technique de l'application APEX Next.

---

## 📁 Structure des Fichiers

```
apex-next/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── analyze-job/        # POST /api/analyze-job
│   │   │   └── route.ts        # Endpoint analyse IA (mock)
│   │   └── auth/               # NextAuth.js
│   │       └── [...nextauth]/
│   │           └── route.ts    # Auth routes
│   ├── auth/                   # Pages d'authentification
│   │   ├── signin/page.tsx     # Page connexion
│   │   └── error/page.tsx      # Page erreur
│   ├── audit/page.tsx          # PHASE 1 - Diagnostic (Steps 1-6)
│   ├── strategy/page.tsx       # PHASE 2 - Stratégie (Steps 7-8) ★
│   ├── globals.css             # Design System
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing/redirect
│
├── components/
│   ├── steps/                  # Composants des 8 étapes
│   │   ├── index.ts            # Barrel exports
│   │   ├── Step1Matrix.tsx     # Sélection persona/goal
│   │   ├── Step2Context.tsx    # Contexte professionnel
│   │   ├── Step3Tasks.tsx      # Audit des tâches
│   │   ├── Step4Talents.tsx    # Sélection 5/12 talents
│   │   ├── Step5Software.tsx   # Stack technique
│   │   ├── Step6Verdict.tsx    # Dashboard diagnostic → /strategy
│   │   ├── Step7Ikigai.tsx     # Matrice Ikigai 2.0
│   │   └── Step8Roadmap.tsx    # Plan d'action + Export PDF
│   │
│   ├── ui/                     # Composants UI
│   │   ├── LanguageSwitcher.tsx
│   │   ├── NavigationButtons.tsx
│   │   ├── ResilienceRadar.tsx # Radar Chart recharts
│   │   ├── ResilienceSlider.tsx
│   │   ├── ScoreRing.tsx
│   │   ├── SelectionCard.tsx
│   │   ├── Stepper.tsx
│   │   ├── TalentBadge.tsx
│   │   └── UserMenu.tsx
│   │
│   ├── AuditFlow.tsx           # Orchestrateur Phase 1
│   ├── StrategyFlow.tsx        # Orchestrateur Phase 2 ★
│   └── PortraitMutation.tsx    # Module Portrait de Mutation (Pivot) ★
│
├── lib/
│   ├── store.ts                # Zustand store (~2100 lignes)
│   ├── lexicon.ts              # Dictionnaire dynamique
│   ├── reportGenerator.ts      # Export PDF (jsPDF) ★
│   └── utils.ts                # Utilitaires
│
├── types/
│   └── jspdf-autotable.d.ts    # Types jsPDF autotable ★
│
├── messages/                   # Traductions i18n
│   ├── fr.json
│   └── en.json
│
├── i18n/                       # Configuration next-intl
│   ├── config.ts
│   └── request.ts
│
├── auth.ts                     # Configuration NextAuth
├── middleware.ts               # Middleware i18n + auth
└── next.config.mjs
```

★ = Nouveaux fichiers v2.1

---

## 🗄️ State Management (Zustand)

### Configuration

Le store utilise `zustand` avec le middleware `persist` pour sauvegarder l'état dans `localStorage`.

```typescript
// lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuditStore = create<AuditStore>()(
  persist(
    (set, get) => ({
      // State & Actions
    }),
    {
      name: 'apex-audit-storage-v4',
      partialize: (state) => ({
        // Sélection des champs à persister
      }),
    }
  )
);
```

### Clé de Version

Changer la clé `name` reset le localStorage :
- `v1` → Initial
- `v2` → Ajout des 12 actifs stratégiques
- `v3` → Ajout du 5e curseur (execution physique)
- `v4` → Phase 2 (strategy)
- `v5` → Moteur de Mutation Radicale (Pivot)
- `v6` → Portrait de Mutation + Synchronisation Totale

### Actions Principales

```typescript
// Navigation
setStep(step: number)
nextStep()  // max: 8
prevStep()  // min: 1

// Context
setPersona(persona)
setGoal(goal)
setJobTitle(title)
setIndustry(industry)
setJobDescription(desc)
setYearsExperience(years)

// Tasks
addTask(name) → taskId
addTasksFromAI(tasks[])  // Bulk add
updateTask(id, partial)
removeTask(id)
clearTasks()

// Talents
initializeTalents()  // Charge les 12 actifs
toggleTalent(id)     // Max 5 sélectionnés
setTalentLevel(id, level)

// Software
addSoftware(name)    // Max 3
updateSoftware(id, level)
removeSoftware(id)

// Strategy
generateStrategy()   // Calcule les scores Phase 2
toggleRoadmapAction(id)

// User Intention (Portrait de Mutation - Parcours Pivot) ★
setPassionsConcretes(passions: string)
setNaturalTalents(talents: string[])
setRejectionZone(zone: string)
setTargetSector(sector: string)
setIdealJobs(jobs: string[])
setHumanManifesto(manifesto: string)

// Mutation Drivers (Pivot) ★
setMutationDrivers(drivers: string[])

// Computed
getSelectedTalents() → Talent[]
getResilienceScore() → number
getTalentScore() → number
computeKPIs() → { productivity, timeLiberated, resilienceIndex }

// Reset
reset()
```

---

## 🎨 Lexique Dynamique

Le fichier `lib/lexicon.ts` adapte le wording selon le persona sélectionné.

### Structure

```typescript
interface LexiconEntry {
  salarie: { fr: string; en: string };
  freelance: { fr: string; en: string };
  leader: { fr: string; en: string };
}

// Exemple
export const contextLexicon = {
  title: {
    salarie: { fr: 'Analyse du Poste', en: 'Job Analysis' },
    freelance: { fr: "Audit d'Activité", en: 'Activity Audit' },
    leader: { fr: 'Mapping de Structure', en: 'Structure Mapping' },
  },
  // ...
};
```

### Utilisation

```typescript
import { getLexiconValue, contextLexicon } from '@/lib/lexicon';

const persona = useAuditStore(state => state.context.persona) || 'salarie';
const locale = useLocale();

const title = getLexiconValue(contextLexicon.title, persona, locale);
```

---

## 🔐 Authentification

### Configuration NextAuth (`auth.ts`)

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Demo',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Démo: password = 'demo123'
        if (credentials?.password === 'demo123') {
          return { id: '1', email: credentials.email, name: 'Demo User' };
        }
        return null;
      },
    }),
    GitHubProvider({ ... }),
    GoogleProvider({ ... }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
```

### Middleware Protection

```typescript
// middleware.ts
export const config = {
  matcher: ['/audit/:path*'],
};

// Redirige vers /auth/signin si non authentifié
```

---

## 🌍 Internationalisation

### Configuration (`next.config.mjs`)

```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  // ...
});
```

### Fichiers de Messages

```
messages/
├── fr.json  # Français (défaut)
└── en.json  # Anglais
```

### Structure des Traductions

```json
{
  "common": { ... },
  "auth": { ... },
  "stepper": { ... },
  "step1": { ... },
  "step2": { ... },
  "step3": { ... },
  "step4": { ... },
  "step5": { ... },
  "step6": { ... },
  "step7": { ... },
  "step8": { ... },
  "language": { ... }
}
```

### Utilisation

```typescript
import { useTranslations, useLocale } from 'next-intl';

function MyComponent() {
  const t = useTranslations('step1');
  const locale = useLocale();
  
  return <h1>{t('title')}</h1>;
}
```

---

## 📊 Calcul des Scores

### Score de Résilience (Tâches)

```typescript
// Moyenne pondérée par heures/semaine
const getResilienceScore = () => {
  const tasks = get().tasks;
  if (tasks.length === 0) return 0;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  tasks.forEach(task => {
    const taskScore = (
      task.resilience.donnees +
      task.resilience.decision +
      task.resilience.relationnel +
      task.resilience.creativite +
      task.resilience.execution
    ) / 5;
    
    const weight = task.hoursPerWeek;
    weightedSum += taskScore * weight;
    totalWeight += weight;
  });
  
  return Math.round(weightedSum / totalWeight);
};
```

### Score Talents

```typescript
const getTalentScore = () => {
  const selected = get().getSelectedTalents();
  if (selected.length === 0) return 0;
  
  const totalLevel = selected.reduce((acc, t) => acc + t.level, 0);
  return Math.round((totalLevel / (selected.length * 5)) * 100);
};
```

### Score Global (Verdict)

```typescript
const overallScore = Math.round(
  (resilienceScore * 0.6) + (talentScore * 0.4)
);
```

### Génération Stratégie (Phase 2)

```typescript
generateStrategy: () => {
  const state = get();
  
  // Capital Actif = talents + tech bonus
  const techBonus = state.software.reduce((acc, s) => {
    return acc + (s.level === 'expert' ? 20 : s.level === 'avance' ? 12 : 5);
  }, 0);
  const capitalActif = Math.min(100, talentScore + techBonus / 3);
  
  // Zone de Risque = inverse résilience
  const zoneRisque = 100 - resilienceScore;
  
  // Levier Économique
  const levierEconomique = Math.round(
    (capitalActif * 0.6) + (resilienceScore * 0.4)
  );
  
  // Génération opportunités + roadmap
  // ...
};
```

---

## 🔌 API Endpoints

### `POST /api/analyze-job`

Analyse IA du document de poste pour suggestion de tâches.

**Status actuel:** Mock avec données génériques par persona.

**Pour intégration IA:**

```typescript
// app/api/analyze-job/route.ts

// TODO: Remplacer le mock par:
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: `Analyse cette fiche de poste et extrait les tâches principales 
                avec leur niveau de résilience face à l'automatisation...`
    },
    {
      role: 'user',
      content: jobDescription
    }
  ],
  response_format: { type: 'json_object' }
});
```

---

## 🎭 Composants Clés

### AuditFlow (Phase 1 - Diagnostic)

Orchestrateur de la Phase 1 (étapes 1-6) :

```typescript
// components/AuditFlow.tsx
const stepComponents: Record<number, React.ComponentType> = {
  1: Step1Matrix,
  2: Step2Context,
  3: Step3Tasks,
  4: Step4Talents,
  5: Step5Software,
  6: Step6Verdict,
};

const CurrentStepComponent = stepComponents[currentStep];
```

### StrategyFlow (Phase 2 - Stratégie) ★

Orchestrateur de la Phase 2 (étapes 7-8) avec insertion conditionnelle du Portrait de Mutation :

```typescript
// components/StrategyFlow.tsx
const STRATEGY_STEPS = [
  { step: 7, component: Step7Ikigai, label: 'Ikigai' },
  { step: 8, component: Step8Roadmap, label: "Plan d'Action" },
];

// Si goal === 'pivot', insère PortraitMutation entre les étapes
```

### PortraitMutation (Parcours Pivot) ★

Module de capture du "Portrait Humain" avec 5 sections :

```typescript
// components/PortraitMutation.tsx
interface UserIntention {
  passionsConcretes: string;     // Section 1
  naturalTalents: string[];      // Section 2 (4 talents)
  rejectionZone: string;         // Section 3
  targetSector: string;          // Section 4
  idealJobs: string[];           // Section 4 (2 métiers)
  humanManifesto: string;        // Section 5
}
```

### ResilienceSlider

Slider personnalisé avec couleur dynamique selon le score :

```typescript
<ResilienceSlider
  value={score}
  onChange={setScore}
  min={0}
  max={100}
  step={1}
  showValue={true}
/>
```

### ResilienceRadar

Radar Chart (recharts) pour visualiser les 5 dimensions :

```typescript
<ResilienceRadar
  data={{
    donnees: 45,
    decision: 60,
    relationnel: 75,
    creativite: 50,
    execution: 30,
  }}
/>
```

---

## 🧪 Tests

### Structure recommandée

```
__tests__/
├── components/
│   └── steps/
│       ├── Step1Matrix.test.tsx
│       └── ...
├── lib/
│   ├── store.test.ts
│   └── lexicon.test.ts
└── e2e/
    └── audit-flow.spec.ts
```

### Commandes

```bash
# Unit tests (à configurer)
npm run test

# E2E avec Playwright (à configurer)
npm run test:e2e
```

---

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Via CLI
vercel

# Ou connecter le repo GitHub à Vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Variables d'environnement Production

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<généré avec openssl rand -base64 32>
```

---

## 📝 Conventions de Code

### Nommage

- **Composants:** PascalCase (`Step1Matrix.tsx`)
- **Hooks:** camelCase avec `use` (`useAuditStore`)
- **Utilitaires:** camelCase (`getResilienceColor`)
- **Types:** PascalCase (`Persona`, `Goal`, `Task`)

### Structure des Composants

```typescript
'use client';

import { ... } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useAuditStore } from '@/lib/store';
import { NavigationButtons } from '@/components/ui/NavigationButtons';

export function StepXName() {
  // Hooks
  const t = useTranslations('stepX');
  const locale = useLocale();
  const { ... } = useAuditStore();
  
  // State local
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => { ... }, []);
  
  // Handlers
  const handleAction = () => { ... };
  
  // Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Content */}
      <NavigationButtons
        onPrev={prevStep}
        onNext={nextStep}
        canProceed={isValid}
      />
    </motion.div>
  );
}
```

---

## 🔄 Flux de Données

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   User UI   │────▶│  Component   │────▶│   Zustand   │
│  (Actions)  │     │   (Step X)   │     │   Store     │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                    │
                           │                    ▼
                           │              ┌─────────────┐
                           │              │ localStorage│
                           │              │ (persist)   │
                           ▼              └─────────────┘
                    ┌──────────────┐
                    │  Re-render   │
                    │  (reactive)  │
                    └──────────────┘
```

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [next-intl](https://next-intl-docs.vercel.app/)
- [NextAuth.js](https://next-auth.js.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

