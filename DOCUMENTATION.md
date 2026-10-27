# Documentation Technique et Guide du Projet : Gestion de Tâches

Bienvenue sur la documentation complète du projet **Gestion de Tâches**. Je l'ai rédigée pour présenter en détail chaque outil, bibliothèque, concept et architecture que j'ai mis en place dans ce projet.

---

## 1. Vue d'ensemble du projet

Ce projet est une application web moderne d'organisation et de productivité (inspirée de Notion et Linear) développée avec **Angular**. 

### Fonctionnalités principales :
- **Gestion des tâches :** Ajout, modification, marquage comme terminée, suppression.
- **Organisation avancée :** Priorités (*Haute, Normale, Basse*), dates limites et heures d'échéance avec détection de retard.
- **Étiquettes / Tags :** Catégorisation par badges prédéfinis (`#Angular`, `#Travail`, `#Études`, `#Personnel`, `#Urgent`) et ajout de tags personnalisés.
- **Vues Notion :**
  1. **Vue Liste :** Affichage classique détaillé et rapide.
  2. **Vue Kanban :** Tableau à 3 colonnes (*À faire*, *En cours*, *Terminée*) avec déplacement dynamique.
  3. **Vue Calendrier :** Grille mensuelle avec positionnement des tâches selon leur date limite.
  4. **Vue Tableau :** Vue tabulaire Notion avec filtres et actions rapides.
- **Sous-tâches & Étapes :** Décomposition d'une tâche avec calcul dynamique et barre de progression.
- **Éditeur Markdown & Notes :** Zone de description enrichie (titres, listes à puces, cases à cocher, liens) et notes rapides sauvegardées automatiquement.
- **Design Responsive multi-plateformes :** Interface fluide adaptée aux téléphones mobiles, tablettes et grands écrans.
- **Persistance des données :** Stockage local dans le navigateur via `localStorage`.

---

## 2. Les Outils et l'Environnement de Développement

Voici la liste des outils fondamentaux que j'utilise pour concevoir, compiler et exécuter l'application :

### 2.1. Node.js & npm
- **Rôle :** Environnement d'exécution JavaScript côté machine et gestionnaire de paquets officiel.
- **Utilisation :**
  - Installation des dépendances via `npm install`.
  - Exécution des scripts du projet (`npm start`, `npm test`, `npm run build`).

### 2.2. TypeScript (v5.x)
- **Rôle :** Surcouche typée de JavaScript.
- **Ce qu'il apporte :** 
  - Détection précoce des erreurs à la compilation.
  - Typage strict des modèles de données (par exemple l'interface `Task` dans [task.model.ts](file:///c:/Users/NKHOLLHOW%20YENO%20Guy%20A/.gemini/antigravity-ide/scratch/gestion-de-taches/src/app/features/tasks/task.model.ts)).
  - Autocomplétion et confort de développement exceptionnel.

### 2.3. Git & GitHub
- **Rôle :** Système de contrôle de version distribué.
- **Utilisation :**
  - Gestion par branches thématiques :
    - `feature/lucide-icons-modif`
    - `fix/responsive`
    - `fix/description-notes-detaillees`
    - `main`
  - Historique traçable de chaque modification et publication distante sur GitHub.

---

## 3. Le Framework : Angular

J'ai structuré ce projet en m'appuyant sur les fonctionnalités les plus récentes et performantes d'Angular :

### 3.1. Standalone Components (Sans `NgModule`)
Tous les composants du projet (`TaskListComponent`, `TaskFormComponent`, `TaskItemComponent`, `TaskDetailComponent`) sont **standalone**.
- **Avantage :** Pas besoin de modules lourds. Chaque composant déclare explicitement dans son tableau `imports: [...]` ce dont il a besoin (`RouterLink`, `FormsModule`, icônes Lucide, etc.).

### 3.2. Angular Signals & Reactivité (`signal`, `computed`)
Plutôt que d'utiliser des observables complexes partout, j'utilise le moteur de réactivité natif des Signals d'Angular :
- `signal()` : Pour stocker l'état local (ex: filtre sélectionné, texte de recherche, titre en cours d'édition).
- `computed()` : Pour dériver automatiquement des valeurs sans redéclencher des calculs manuels (ex: nombre de tâches restantes, filtrage par statut ou par tag, calcul du pourcentage de sous-tâches terminées).

### 3.3. Communication par `input()` et `output()`
- `input.required<Task>()` : Pour passer les données du parent vers l'enfant de manière typée.
- `output<number>()` : Pour émettre des événements personnalisés du composant enfant vers le parent (ex: clic sur cocher ou supprimer).

### 3.4. Nouvelle syntaxe de template Control Flow
Au lieu des anciennes directives `*ngIf` et `*ngFor`, j'utilise la nouvelle syntaxe native Angular :
- `@if (...) { } @else { }` : Rendu conditionnel clair et performant.
- `@for (item of items; track item.id) { } @empty { }` : Boucles optimisées avec suivi de clé unique (`track`) et gestion intégrée de l'état vide (`@empty`).

### 3.5. Angular Router
- Gestion de la navigation entre la liste générale (`/tasks`) et la vue détaillée d'une tâche (`/tasks/:id`).
- Récupération des paramètres d'URL via `ActivatedRoute` avec protection contre les identifiants invalides ou inexistants.

---

## 4. Les Librairies et Packages Utilisés

### 4.1. `@lucide/angular` (Lucide Icons)
- **Rôle :** Bibliothèque d'icônes vectorielles moderne, élégante et cohérente.
- **Pourquoi je l'ai choisie :**
  - Remplace avantageusement les gros blocs SVG bruts qui alourdissaient le code HTML.
  - Arbre de dépendances léger (*tree-shakeable*) : seules les icônes réellement utilisées sont incluses dans le bundle final.
- **Icônes intégrées dans le projet :**
  - `LucideCalendar` & `LucideClock` : Pour les dates limites et les heures d'échéance.
  - `LucideTrash2` & `LucideX` : Pour la suppression de tâches, sous-tâches ou liens.
  - `LucideTag` : Pour la gestion et le filtrage des étiquettes.
  - `LucideListTodo` & `LucideCheckSquare` : Pour les sous-tâches et les cases à cocher.
  - `LucideList`, `LucideColumns`, `LucideTable` : Pour la barre d'onglets de changement de vue Notion.
  - `LucideFileText`, `LucideStickyNote`, `LucideLink`, `LucideExternalLink` : Pour la documentation, notes et liens externes.

### 4.2. Vitest & Angular Testing Library
- **Rôle :** Suite d'exécution des tests unitaires rapides.
- **Utilisation :**
  - Validation automatique du service métier dans [task.spec.ts](file:///c:/Users/NKHOLLHOW%20YENO%20Guy%20A/.gemini/antigravity-ide/scratch/gestion-de-taches/src/app/features/tasks/task.spec.ts).
  - Tests unitaires des composants (`task-list.spec.ts`, `task-detail.spec.ts`, etc.).
  - Isolation des données grâce à `localStorage.clear()` exécuté avant chaque test.

---

## 5. Architecture des Dossiers et Fichiers

Voici comment j'ai organisé le code source du projet :

```
src/
├── app/
│   ├── app.routes.ts          # Définition des routes de l'application (/tasks, /tasks/:id)
│   ├── app.config.ts          # Fournisseurs globaux (Routing, etc.)
│   ├── app.ts / app.html      # Composant racine de l'application
│   │
│   └── features/tasks/        # Module fonctionnel des tâches
│       ├── task.model.ts      # Définition des types et interfaces TypeScript (Task, SubTask, etc.)
│       ├── task.ts            # Service centralisé : état réactif (Signals) et méthodes CRUD
│       ├── task.spec.ts       # Tests unitaires du service
│       │
│       ├── task-list/         # Composant de la page principale
│       │   ├── task-list.ts   # Logique des 4 vues (Liste, Kanban, Calendrier, Table) et filtres
│       │   ├── task-list.html # Template HTML des vues
│       │   └── task-list.css  # Styles et media queries responsives
│       │
│       ├── task-item/         # Composant carte individuelle d'une tâche
│       │   ├── task-item.ts   # Émission des actions et formatage des dates
│       │   ├── task-item.html # Template avec icônes Lucide
│       │   └── task-item.css  # Styles adaptatifs (720px breakpoint)
│       │
│       ├── task-form/         # Formulaire de création rapide de tâche
│       │   ├── task-form.ts   # Validation du titre, date, heure et tags
│       │   ├── task-form.html # Template du formulaire
│       │   └── task-form.css  # Grille responsive et sélecteur de tags
│       │
│       └── task-detail/       # Page détaillée complète d'une tâche
│           ├── task-detail.ts # Moteur Markdown, gestion sous-tâches, liens et notes
│           ├── task-detail.html# Template de la vue détail
│           └── task-detail.css # Styles avancés et mise en page responsive
│
├── styles.css                 # Design System global : variables CSS, typographie et layout
└── index.html                 # Page HTML racine et balise meta viewport
```

---

## 6. Guide d'Exécution

Pour démarrer et tester le projet sur n'importe quel ordinateur :

1. **Installer les dépendances :**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Démarrer le serveur de développement :**
   ```bash
   npm start
   ```
   Rendez-vous sur [http://localhost:4200](http://localhost:4200) dans votre navigateur.

3. **Lancer la compilation de production :**
   ```bash
   npx ng build
   ```

4. **Exécuter les tests unitaires :**
   ```bash
   npm test
   ```
