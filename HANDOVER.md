# 🔄 HANDOVER - APEX Next v2

> **Document de passation pour assurer la continuité du développement**
> Dernière mise à jour : 3 janvier 2026

---

## 📍 État Actuel du Projet

### Résumé en une phrase
**APEX Next est un outil de diagnostic stratégique en 8 étapes qui évalue la résilience professionnelle face à l'IA et génère un plan d'action personnalisé.**

### Version actuelle
- **Version** : 2.0.0
- **Commit** : `7c298ea`
- **Repo** : https://github.com/gregjazzy/ApexNext

### Ce qui est TERMINÉ ✅
1. **Phase 1 - Diagnostic** (Étapes 1-6) → 100% fonctionnel
2. **Phase 2 - Stratégie** (Étapes 7-8) → 100% fonctionnel
3. **Authentification** NextAuth (Credentials, GitHub, Google)
4. **Internationalisation** FR/EN avec next-intl
5. **Lexique dynamique** adapté par persona
6. **Radar Chart** résilience (5 dimensions)
7. **Documentation** complète (README, ARCHITECTURE, CHANGELOG)

### Ce qui est PRÉPARÉ (structure en place) 🔧
1. **Analyse IA documents** → Endpoint `/api/analyze-job` avec mock
2. **Bouton "Générer les tâches"** dans Step3 (appelle le mock)

### Ce qui reste À FAIRE 📝
1. **Intégration IA réelle** (OpenAI/Anthropic) pour `/api/analyze-job`
2. **Export PDF** du diagnostic (placeholder dans Step8)
3. **Pondération des scores** selon persona/objectif
4. **Dashboard historique** des audits (optionnel)

---

## 🏗️ Architecture Clé

### Stack Technique
```
Next.js 15 (App Router) + TypeScript + Tailwind CSS
Zustand (state) + Framer Motion (animations) + Recharts (graphiques)
NextAuth.js (auth) + next-intl (i18n)
```

### Fichiers Critiques à Connaître

| Fichier | Rôle | Lignes |
|---------|------|--------|
| `lib/store.ts` | Store Zustand central | ~650 |
| `lib/lexicon.ts` | Dictionnaire dynamique par persona | ~280 |
| `components/AuditFlow.tsx` | Orchestrateur des 8 étapes | ~120 |
| `components/steps/Step*.tsx` | Composants des étapes | ~200-350 chacun |
| `app/api/analyze-job/route.ts` | Endpoint IA (mock) | ~130 |
| `messages/fr.json` + `en.json` | Traductions | ~250 chacun |

### Store Zustand - Structure Principale

```typescript
// lib/store.ts - Clé localStorage: 'apex-audit-storage-v4'

interface AuditStore {
  currentStep: number;  // 1-8
  
  context: {
    persona: 'salarie' | 'freelance' | 'leader' | null;
    goal: 'augmentation' | 'pivot' | null;
    jobTitle: string;
    industry: string;
    jobDescription: string;
  };
  
  tasks: Task[];           // Tâches avec 5 curseurs résilience
  talents: Talent[];       // 12 actifs, 5 sélectionnés max
  software: Software[];    // 3 outils max
  strategy: StrategyData;  // Phase 2 (généré automatiquement)
}
```

### Les 8 Étapes

| # | Nom | Fichier | Description |
|---|-----|---------|-------------|
| 1 | La Matrice | `Step1Matrix.tsx` | Sélection persona + goal |
| 2 | Context Mapping | `Step2Context.tsx` | Poste, secteur, description |
| 3 | Audit Processus | `Step3Tasks.tsx` | Tâches + 5 curseurs résilience |
| 4 | Actifs Stratégiques | `Step4Talents.tsx` | Sélection 5/12 talents |
| 5 | Tech Scan | `Step5Software.tsx` | 3 outils + niveaux |
| 6 | Le Verdict | `Step6Verdict.tsx` | Dashboard + Radar |
| 7 | Matrice Ikigai | `Step7Ikigai.tsx` | Radar 4D + Métiers Refuges |
| 8 | Plan d'Action | `Step8Roadmap.tsx` | 3 piliers + actions |

---

## 🔑 Concepts Clés à Comprendre

### 1. Lexique Dynamique
Le wording UI change selon le persona sélectionné :
- **Salarié** → "Fiche de poste", "Analyse du Poste"
- **Freelance** → "Catalogue de services", "Audit d'Activité"
- **Leader** → "Périmètre BU", "Mapping de Structure"

```typescript
// lib/lexicon.ts
import { getLexiconValue, contextLexicon } from '@/lib/lexicon';
const title = getLexiconValue(contextLexicon.title, persona, locale);
```

### 2. Les 5 Dimensions de Résilience
Chaque tâche est évaluée sur :
1. **Données** (IA) - Vulnérabilité automatisation données
2. **Décision** - Complexité jugement humain
3. **Relationnel** - Interactions humaines requises
4. **Créativité** - Innovation nécessaire
5. **Exécution Physique** (Robotique) - Vulnérabilité systèmes autonomes

### 3. Les 12 Actifs Stratégiques
Talents non-automatisables définis dans `STRATEGIC_ASSETS` :
- Arbitrage en Incertitude
- Synthèse Stratégique
- Intelligence de Négociation
- Pensée Systémique
- Diagnostic de Crise
- Tactique Relationnelle
- Innovation de Rupture
- Pilotage de l'IA (IA Ops)
- Éthique & Gouvernance
- Leadership de Transition
- Analyse Critique & Biais
- Communication d'Influence

### 4. Calcul des Scores

```typescript
// Score Résilience = Moyenne pondérée par heures/semaine des 5 dimensions
// Score Talents = (sum levels / max possible) * 100
// Score Global = (Résilience * 0.6) + (Talents * 0.4)
```

### 5. Branchement Stratégique (Phase 2)
- **Augmentation** → Focus délégation tech + devenir référent IA
- **Pivot** → Focus exploration métiers refuges + reconversion

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev          # Lance sur http://localhost:3000

# Production
npm run build
npm start

# Si port occupé
lsof -ti:3000 | xargs kill -9
npm run dev -- -p 3000
```

---

## 🐛 Problèmes Connus / Résolus

### 1. Hydration Mismatch (Zustand)
**Cause** : Le store persiste dans localStorage, créant un décalage client/serveur.
**Solution** : Le store utilise `partialize` pour ne persister que certains champs.

### 2. next-intl Configuration
**Cause** : Erreurs "Could not locate request configuration module"
**Solution** : Fichiers `i18n/config.ts` et `i18n/request.ts` correctement configurés.

### 3. Types Temporality/SkillLevel
**Cause** : Valeurs FR initiales incompatibles avec i18n
**Solution** : Changées en anglais (`daily`/`weekly` au lieu de `quotidien`/`hebdomadaire`)

---

## 📋 Prochaine Feature à Implémenter

### Priorité 1 : Intégration IA pour analyse documents

**Où** : `/app/api/analyze-job/route.ts`

**Quoi** : Remplacer le mock par un appel réel OpenAI/Anthropic

**Code actuel (mock)** :
```typescript
// Ligne ~45 du fichier
// TODO: Intégrer l'IA ici (OpenAI ou Anthropic)
const mockTasks = getMockTasks(persona, jobTitle);
```

**Code à implémenter** :
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: `Tu es un expert en analyse de postes. Analyse cette fiche de poste 
      et extrait les tâches principales avec leur niveau de résilience face à 
      l'automatisation (IA et robotique). Pour chaque tâche, évalue sur 0-100 :
      - donnees: vulnérabilité à l'automatisation IA
      - decision: complexité de jugement requis
      - relationnel: besoin d'interactions humaines
      - creativite: besoin d'innovation
      - execution: vulnérabilité robotique
      
      Retourne un JSON avec le format:
      {
        "tasks": [
          {
            "name": "...",
            "hoursPerWeek": number,
            "temporalite": "quotidien|hebdomadaire|mensuel|strategique",
            "resilience": { donnees, decision, relationnel, creativite, execution }
          }
        ]
      }`
    },
    { role: 'user', content: jobDescription }
  ],
  response_format: { type: 'json_object' }
});

const data = JSON.parse(response.choices[0].message.content);
```

**Variable d'environnement requise** :
```env
OPENAI_API_KEY=sk-...
```

---

## 🎨 Design System Rappel

```css
/* Fond */
bg-slate-950 + grille technique 50px

/* Cartes */
.apex-card {
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgb(30, 41, 59);
  backdrop-filter: blur(12px);
}

/* Couleurs sémantiques */
Score ≥ 60% → emerald (vert)
Score 40-59% → amber (orange)
Score < 40% → rose (rouge)

/* Typographie */
Titres → font-serif
UI/Data → font-sans (Inter)
```

---

## 📁 Structure des Dossiers

```
apex-next/
├── app/
│   ├── api/
│   │   ├── analyze-job/route.ts    ← ENDPOINT IA À IMPLÉMENTER
│   │   └── auth/[...nextauth]/route.ts
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── error/page.tsx
│   ├── audit/page.tsx              ← PAGE PRINCIPALE
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── steps/                      ← 8 COMPOSANTS D'ÉTAPES
│   │   ├── Step1Matrix.tsx
│   │   ├── Step2Context.tsx
│   │   ├── Step3Tasks.tsx          ← CONTIENT BOUTON "GÉNÉRER TÂCHES"
│   │   ├── Step4Talents.tsx
│   │   ├── Step5Software.tsx
│   │   ├── Step6Verdict.tsx
│   │   ├── Step7Ikigai.tsx
│   │   ├── Step8Roadmap.tsx        ← CONTIENT BOUTON "EXPORT PDF"
│   │   └── index.ts
│   ├── ui/
│   └── AuditFlow.tsx               ← ORCHESTRATEUR
├── lib/
│   ├── store.ts                    ← ZUSTAND STORE (CŒUR)
│   ├── lexicon.ts                  ← DICTIONNAIRE DYNAMIQUE
│   └── utils.ts
├── messages/
│   ├── fr.json
│   └── en.json
├── docs/
│   └── ARCHITECTURE.md
├── README.md
├── CHANGELOG.md
└── HANDOVER.md                     ← CE FICHIER
```

---

## 🔗 Liens Utiles

- **Repo GitHub** : https://github.com/gregjazzy/ApexNext
- **Next.js Docs** : https://nextjs.org/docs
- **Zustand** : https://github.com/pmndrs/zustand
- **next-intl** : https://next-intl-docs.vercel.app/
- **Recharts** : https://recharts.org/

---

## 💬 Instructions pour le Prochain Chat

1. **Lire ce fichier** en premier pour comprendre le contexte
2. **Lire `lib/store.ts`** pour comprendre le modèle de données
3. **Lire `lib/lexicon.ts`** pour comprendre le système de wording dynamique
4. **Lancer `npm run dev`** et tester le flux complet des 8 étapes

### Pour reprendre le développement :
```
"Je reprends le développement d'APEX Next. 
J'ai lu le HANDOVER.md et je comprends l'architecture.
La prochaine tâche est : [décrire la tâche]"
```

---

## ✅ Checklist Avant de Commencer

- [ ] Cloner le repo : `git clone https://github.com/gregjazzy/ApexNext.git`
- [ ] Installer : `npm install`
- [ ] Lancer : `npm run dev`
- [ ] Tester le flux complet (8 étapes)
- [ ] Lire README.md, ARCHITECTURE.md, CHANGELOG.md
- [ ] Comprendre store.ts et lexicon.ts

---

**Bonne continuation ! 🚀**

