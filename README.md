# APEX Next v2 - Deep Audit Engine

> 🧭 GPS de la Mutation Professionnelle face à l'IA

APEX Next est un outil de diagnostic professionnel qui évalue votre résilience face à l'automatisation et l'IA. Il vous guide à travers un audit complet de vos tâches, talents et compétences techniques pour identifier vos zones de vulnérabilité et vos points forts.

## ✨ Fonctionnalités

### Étape 1 : Diagnostic (Implémenté)

- **La Matrice** : Définition du profil (Salarié, Freelance, Leader/RH) et de l'objectif (Augmentation ou Pivot)
- **Context Mapping** : Saisie du poste, industrie et import optionnel de fiche de poste
- **Audit Temporel** : Analyse des tâches avec 4 dimensions de résilience (Données, Décision, Relationnel, Créativité)
- **Signature des Talents** : Sélection de 5 talents majeurs avec niveau de maîtrise
- **Tech Scan** : Identification de 3 outils principaux et niveau d'expertise
- **Le Verdict** : Dashboard de résilience avec score global et analyse détaillée

### Étape 2 : Ikigai (À venir)

Construction de la trajectoire professionnelle idéale basée sur le diagnostic.

## 🎨 Design System

- **Thème** : Dark Consulting Premium (Slate 950)
- **Typographie** : Playfair Display (titres) + Inter (UI)
- **Composants** : Glass morphism avec backdrop-blur
- **Grille** : Pattern technique de fond subtil

## 🛠 Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS
- **État** : Zustand avec persistence
- **Animations** : Framer Motion
- **UI Components** : Radix UI
- **Icônes** : Lucide React

## 🚀 Démarrage

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm run dev

# Build production
npm run build
npm start
```

## 📁 Structure

```
/app
  /globals.css      # Design system et styles globaux
  /layout.tsx       # Layout principal
  /page.tsx         # Point d'entrée

/components
  /ui               # Composants réutilisables
  /steps            # Écrans du tunnel d'audit
  AuditFlow.tsx     # Orchestration du flux

/lib
  store.ts          # Store Zustand (état global)
  utils.ts          # Utilitaires
```

## 📊 Modèle de Données

```typescript
// Contexte utilisateur
interface AuditContext {
  persona: 'salarie' | 'freelance' | 'leader';
  goal: 'augmentation' | 'pivot';
  jobTitle: string;
  industry: string;
  jobDescription: string;
}

// Tâches avec scores de résilience
interface Task {
  name: string;
  temporality: 'daily' | 'weekly' | 'monthly' | 'strategic';
  resilience: {
    donnees: number;      // 0-100
    decision: number;     // 0-100
    relationnel: number;  // 0-100
    creativite: number;   // 0-100
  };
}

// Talents sélectionnés (Top 5)
interface Talent {
  name: string;
  category: string;
  level: 1 | 2 | 3 | 4 | 5;
}

// Stack technique (Top 3)
interface Software {
  name: string;
  level: 'debutant' | 'avance' | 'expert';
}
```

## 🎯 Philosophie

**Efficience** : Saisir la donnée une fois pour l'exploiter partout.

Les données collectées dans l'Étape 1 (Diagnostic) alimenteront l'Étape 2 (Ikigai) sans ressaisie.

---

Développé avec 💙 pour naviguer la transformation professionnelle.
