# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [2.1.0] - 2026-01-03

### ✨ Ajouté

#### Synchronisation Totale du Plan d'Action (Audit + Portrait Humain)
- **Interface RoadmapAction enrichie** avec nouveaux champs :
  - `resilienceScore` : Score 1-10 de protection contre le remplacement
  - `suggestedTool` : Outil concret suggéré (ChatGPT, No-code, etc.)
  - `sourceData` : Source des données (Audit, Portrait Humain, etc.)

- **Injection de données hybrides** :
  - Pilier 1 : Zone de Rejet + Tâche vulnérable
  - Pilier 2 : Carré d'As + Passions Concrètes
  - Pilier 3 : Métier Idéal + Secteur Cible

- **Verbes d'impact** (wording Consulting) :
  - Déléguer, Implémenter, Configurer (Pilier 1)
  - Déployer, Sécuriser, Arbitrer (Pilier 2)
  - Négocier, Implémenter (Pilier 3)

#### Module Portrait de Mutation (Parcours Pivot)
- **Nouveau composant `PortraitMutation.tsx`** avec 5 sections :
  1. Passions Concrètes (texte libre)
  2. Le Carré d'As (4 talents naturels)
  3. Zone de Rejet (tags ajoutables)
  4. L'Horizon Cible (secteur + 2 métiers idéaux)
  5. Le Manifeste Humain (texte libre)

- **Interface `UserIntention`** dans le store Zustand
- **Wiring Intelligence** :
  - Ajustement Ikigai (Engagement pondéré par passions/secteur)
  - Zone de Rejet → Colonne ÉLIMINER de la matrice ERAC
  - Métiers Idéaux → Priorité dans les Niches de Résilience

#### Séparation Phase 1 / Phase 2
- **Route `/strategy`** pour la Phase 2
- **Composant `StrategyFlow.tsx`** orchestrateur de la Phase 2
- **Step6 redirige vers `/strategy`** après validation du diagnostic

#### Export PDF Stratégique
- **Nouveau fichier `lib/reportGenerator.ts`**
- Export PDF complet avec jsPDF + jsPDF-autotable :
  - Synthèse exécutive
  - Méthodologie ERAC
  - Audit détaillé des tâches
  - Actifs stratégiques
  - Matrice ERAC & Ikigai
  - Plan d'Action par piliers

### 🔧 Modifié
- **`lib/store.ts`** : Version `apex-audit-storage-v6`
  - Ajout de `userIntention` dans le state
  - `generateRoadmap()` accepte maintenant `userIntention`
  - Calculs dynamiques avec données Portrait Humain
- **`Step8Roadmap.tsx`** : Affichage des nouveaux KPIs (Résilience, Outil, Source)
- **`Step7Ikigai.tsx`** : Intégration du Portrait de Mutation dans les calculs

---

## [2.0.0] - 2026-01-03

### ✨ Ajouté

#### Phase 2 : Strategic Mutation Plan
- **Étape 7 - Matrice Ikigai 2.0**
  - Radar Chart à 4 dimensions (Capital Actif, Zone de Risque, Opportunités, Levier Économique)
  - Score global stratégique
  - Liste des "Métiers Refuges" avec scores de correspondance
  - Affichage de la Signature Stratégique (5 talents)
  - Badges parcours (Augmentation / Pivot)

- **Étape 8 - Plan d'Action Stratégique**
  - Roadmap en 3 piliers :
    - Pilier 1 : Délégation Technologique
    - Pilier 2 : Renforcement de Signature
    - Pilier 3 : Positionnement Marché
  - Actions cliquables avec toggle completion
  - Barre de progression dynamique
  - Badges de priorité (Immédiat, 1-3 mois, 3-6 mois)
  - CTA Export PDF (placeholder)
  - Bouton Nouvel Audit

#### Store Zustand étendu
- Nouvelle interface `StrategyData`
- Nouvelle interface `NicheOpportunity`
- Nouvelle interface `RoadmapAction`
- Action `generateStrategy()` - Génère les scores et opportunités
- Action `toggleRoadmapAction(id)` - Toggle completion action
- Générateurs dynamiques d'opportunités et roadmap selon profil

#### Endpoint API
- `POST /api/analyze-job` - Analyse IA (mock, prêt pour intégration)
  - Structure de requête/réponse définie
  - Mock data par persona (salarié/freelance/leader)
  - Action `addTasksFromAI()` dans le store

### 🔧 Modifié
- Stepper mis à jour pour 8 étapes
- AuditFlow étendu pour gérer les étapes 7-8
- Navigation étendue (max step: 8)
- Traductions FR/EN ajoutées pour Phase 2
- Bouton "Accéder à l'Ikigai" dans Step6 maintenant fonctionnel

---

## [1.5.0] - 2026-01-02

### ✨ Ajouté

#### Radar Chart Résilience
- Nouveau composant `ResilienceRadar.tsx`
- Visualisation des 5 dimensions dans Step6Verdict
- Intégration recharts

#### Structure Analyse IA
- Endpoint `/api/analyze-job` (mock)
- Bouton "Générer les tâches" dans Step3 si jobDescription présente
- Loading state et gestion d'erreurs

### 🔧 Modifié
- Layout Step6 réorganisé avec Radar à gauche

---

## [1.4.0] - 2026-01-02

### ✨ Ajouté

#### Amélioration UX Step3
- Slider "Heures par semaine" (0.5-40h)
- Calcul du score pondéré par temps
- Auto-déploiement de la dernière tâche ajoutée
- Tri des tâches par date de création (récentes en premier)
- Affichage du total heures avec indicateur santé

#### Tooltips Step4
- Exemples concrets au survol des cartes talents
- Animation Framer Motion pour les tooltips

### 🔧 Modifié
- Subtitle Step3 : "quotidien" retiré
- Interface `Task` : ajout `hoursPerWeek`
- Calcul moyenne résilience pondérée

---

## [1.3.0] - 2026-01-02

### ✨ Ajouté

#### Étape 5 refonte
- Titre : "Diagnostic de l'Écosystème Technologique"
- 3 slots pour outils avec input + suggestions
- Sélecteur niveau 3 options (Débutant/Avancé/Expert)
- Validation : au moins 1 outil requis

#### Étape 4 refonte
- Titre : "Inventaire de vos Actifs Stratégiques"
- 12 nouveaux actifs stratégiques avec descriptions
- Grille 3x4 avec icônes Lucide
- Slider de maîtrise 1-5 étoiles

### 🔧 Modifié
- `STRATEGIC_ASSETS` remplace `AVAILABLE_TALENTS`
- Types `SkillLevel` : français → anglais (beginner/advanced/expert)
- Types `Temporality` : français → anglais

---

## [1.2.0] - 2026-01-01

### ✨ Ajouté

#### Lexique dynamique
- Fichier `lib/lexicon.ts`
- Wording adapté par persona (Salarié/Freelance/Leader)
- Descriptions objectives par profil + goal
- Badge "Mode Diagnostic : [Persona]"

#### 5ème curseur résilience
- "Exécution Physique / Manuelle" pour menace robotique
- Intégré dans Task, Step3, Step6

### 🔧 Modifié
- Step1 : Wording "Expert Consulting"
  - "Ingénierie de l'Employabilité" / "Pivot Stratégique Haute-Valeur" (Salarié)
  - "Scalabilité de la Valeur" / "Mutation du Modèle d'Affaires" (Freelance)
  - "Audit d'Efficience Opérationnelle" / "Ingénierie de la Transition" (Leader)
- Bouton final : "Lancer le Deep Audit →"

---

## [1.1.0] - 2025-12-31

### ✨ Ajouté

#### Authentification
- NextAuth.js avec providers :
  - Credentials (démo: password `demo123`)
  - GitHub OAuth
  - Google OAuth
- Page `/auth/signin` customisée
- Page `/auth/error`
- Protection route `/audit`

#### Internationalisation
- next-intl configuré
- Fichiers `messages/fr.json` et `messages/en.json`
- Composant `LanguageSwitcher`
- Cookie `NEXT_LOCALE` pour persistence

### 🔧 Modifié
- Layout avec providers (SessionProvider, NextIntlClientProvider)
- Middleware pour i18n et auth

---

## [1.0.0] - 2025-12-30

### ✨ Ajouté

#### Phase 1 : Diagnostic complet
- **Étape 1 - La Matrice** : Sélection persona (Salarié/Freelance/Leader) et goal (Augmentation/Pivot)
- **Étape 2 - Context Mapping** : Poste, secteur, upload fiche de poste
- **Étape 3 - Audit Temporel** : Ajout tâches avec 4 curseurs de résilience
- **Étape 4 - Signature Talents** : Sélection 5 talents parmi catégories
- **Étape 5 - Tech Scan** : 3 outils et niveaux de maîtrise
- **Étape 6 - Le Verdict** : Dashboard avec scores et synthèse

#### Infrastructure
- Next.js 15 avec App Router
- TypeScript
- Tailwind CSS avec Design System "Expert Dark"
- Zustand store avec persistence localStorage
- Framer Motion pour animations
- Radix UI pour composants accessibles
- Lucide React pour icônes

#### Composants UI
- `Stepper` - Navigation 6 étapes
- `SelectionCard` - Cartes glassmorphism
- `ResilienceSlider` - Curseurs colorés
- `ScoreRing` - Cercle de score SVG
- `TalentBadge` - Badge avec étoiles
- `NavigationButtons` - Boutons Retour/Suivant

---

## Types de changements

- `✨ Ajouté` pour les nouvelles fonctionnalités
- `🔧 Modifié` pour les changements de fonctionnalités existantes
- `🗑️ Supprimé` pour les fonctionnalités retirées
- `🐛 Corrigé` pour les corrections de bugs
- `🔒 Sécurité` pour les corrections de vulnérabilités
- `📝 Documentation` pour les changements de documentation

