# Documentation Complète du Projet : Gestion de Tâches

> Rédigée à la première personne — Ce document retrace du début jusqu'à la fin toutes les étapes de développement, la méthodologie de travail, les outils utilisés, les commandes exécutées et les décisions techniques prises.

---

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Méthodologie de travail](#2-méthodologie-de-travail)
3. [Environnement et outils de développement](#3-environnement-et-outils-de-développement)
4. [Toutes les commandes utilisées — du début à la fin](#4-toutes-les-commandes-utilisées--du-début-à-la-fin)
5. [Le Framework Angular — Concepts utilisés](#5-le-framework-angular--concepts-utilisés)
6. [Les librairies et packages installés](#6-les-librairies-et-packages-installés)
7. [Architecture du projet](#7-architecture-du-projet)
8. [Historique complet des commits (Git Log)](#8-historique-complet-des-commits-git-log)
9. [Détail des branches Git](#9-détail-des-branches-git)
10. [Fonctionnalités développées](#10-fonctionnalités-développées)
11. [Guide d'exécution du projet](#11-guide-dexécution-du-projet)

---

## 1. Vue d'ensemble du projet

Ce projet est une application web de **gestion de tâches** moderne, inspirée des outils comme **Notion** et **Linear**, développée avec le framework **Angular**.

### Fonctionnalités principales

| Fonctionnalité | Description |
|---|---|
| Gestion des tâches | Ajout, modification, marquage comme terminée, suppression |
| Priorités | Haute, Normale, Basse avec badge coloré |
| Dates & Heures | Date limite, heure d'échéance, détection des retards |
| Étiquettes / Tags | Tags prédéfinis + personnalisés avec filtrage dynamique |
| Sous-tâches | Décomposition avec barre de progression automatique |
| 4 Vues Notion | Liste, Kanban, Calendrier, Tableau |
| Éditeur Markdown | Barre d'outils (Gras, Italique, Titres, Listes, Liens, Cases) |
| Notes rapides | Zone de notes sauvegardée automatiquement |
| Liens externes | Ajout de liens nommés associés à chaque tâche |
| Design Responsive | Mobile, tablette, desktop — toutes plateformes |
| Persistance | Stockage dans `localStorage` du navigateur |
| Icônes Lucide | Bibliothèque d'icônes vectorielles légère et cohérente |

---

## 2. Méthodologie de travail

J'ai suivi une **méthodologie itérative et incrémentale**, organisée en **branches Git thématiques**, avec des commits réguliers et des messages descriptifs respectant la convention **Conventional Commits**.

### 2.1. Principes appliqués

#### Feature Branching (Git Flow simplifié)

Pour chaque nouvelle fonctionnalité ou correction, je crée une branche dédiée qui part de `main` :
- Les branches de **fonctionnalité** sont préfixées par `feature/`
- Les branches de **correction** sont préfixées par `fix/`

Cela me permet de travailler sur un sujet précis sans polluer la branche principale, de garder un historique clair, et de pouvoir revenir en arrière à tout moment.

#### Conventional Commits

Je rédige chaque message de commit en suivant la convention internationale :

```
<type>(<scope>): <description courte>
```

| Préfixe | Usage |
|---|---|
| `feat:` | Nouvelle fonctionnalité ajoutée |
| `fix:` | Correction d'un bug |
| `docs:` | Mise à jour de documentation |
| `refactor:` | Réécriture de code sans changer le comportement |
| `style:` | Modifications de mise en forme, CSS |
| `test:` | Ajout ou correction de tests unitaires |

#### Développement Itératif par Missions

Le projet a été découpé en **missions progressives** :
1. Missions 1 à 10 : Réalisation de toutes les fonctionnalités de base (CRUD, filtres, routes, tests)
2. Bonus A, B, C, D : Améliorations avancées (pagination, vues multiples)
3. Itérations d'amélioration : Dates/heures, sous-tâches, catégories, éditeur Markdown, responsive, Lucide Icons

#### Isolation des tests avec `localStorage.clear()`

Avant chaque test unitaire, j'exécute `localStorage.clear()` pour garantir que les tests s'exécutent dans un état propre, sans être influencés par les données laissées par les tests précédents.

#### Revue et correction systématique

Chaque fois qu'un bug est identifié (sur le navigateur ou dans les tests), je crée une branche `fix/` dédiée, j'isole le problème, je le corrige, et je commite avec un message explicatif.

### 2.2. Flux de travail type

```
1.  git checkout main              # Je pars de la base stable
2.  git pull origin main           # Je récupère les dernières mises à jour
3.  git checkout -b feature/nom    # Je crée ma branche de travail
4.  <développement du code...>
5.  git add .                      # Je prépare mes fichiers
6.  git commit -m "feat: ..."      # Je commite avec un message clair
7.  git push origin feature/nom    # Je publie sur GitHub
8.  (Merge dans main via PR ou git merge)
```

---

## 3. Environnement et outils de développement

### 3.1. Node.js & npm

- **Rôle :** Environnement d'exécution JavaScript hors navigateur et gestionnaire de paquets.
- **Version npm utilisée :** `11.13.0` (spécifiée dans `package.json` via `packageManager`)
- **Commandes npm utilisées :**
  ```bash
  npm install --legacy-peer-deps   # Installation de toutes les dépendances
  npm start                        # Lancement du serveur de développement
  npm test                         # Exécution des tests unitaires
  npm run build                    # Compilation de production
  npm list --depth=0               # Vérifier les paquets installés
  ```

### 3.2. Angular CLI

- **Rôle :** Interface en ligne de commande pour générer, compiler et servir un projet Angular.
- **Version Angular :** `^22.2.0`
- **Commandes Angular CLI utilisées :**
  ```bash
  npx ng serve                     # Démarrer le serveur de développement
  npx ng build                     # Compiler le projet
  npx ng test                      # Lancer les tests via le builder configuré
  npx ng generate component ...    # Générer des composants
  npx ng version                   # Vérifier la version installée
  ```

### 3.3. TypeScript

- **Rôle :** Surcouche typée de JavaScript compilée en JS natif.
- **Version :** `~6.0.2`
- **Apports concrets dans ce projet :**
  - Typage de l'interface `Task` et de ses propriétés
  - Détection précoce des erreurs à la compilation
  - Autocomplétion dans l'éditeur de code

### 3.4. Vitest

- **Rôle :** Framework de tests unitaires ultra-rapide (remplaçant de Jest, compatible Vite).
- **Version :** `^5.0.0`
- **Utilisation :**
  - Tests du service `TaskService` dans `task.spec.ts`
  - Tests des composants (`task-detail.spec.ts`, `task-list.spec.ts`)
  - Exécution via `npm test` ou `npx vitest run`

### 3.5. Git & GitHub

- **Rôle :** Contrôle de version distribué + hébergement distant du code source.
- **Utilisation :** Gestion par branches thématiques, commits fréquents, push systématique vers GitHub.

### 3.6. Prettier

- **Rôle :** Formateur de code automatique.
- **Version :** `^3.8.1`
- **Utilisation :** Uniformisation du style du code (indentation, guillemets, etc.)

### 3.7. Google Antigravity IDE

- **Rôle :** Environnement de développement intégré assisté par IA (Gemini) utilisé pour écrire, corriger et organiser le code tout au long du projet.

---

## 4. Toutes les commandes utilisées — du début à la fin

Voici **la liste exhaustive et chronologique** de toutes les commandes exécutées au cours du projet, de l'initialisation à la finalisation.

### Phase 1 — Initialisation et vérification de l'environnement

```bash
# Vérifier la version de Node.js
node -v

# Vérifier la version de npm
npm -v

# Installer les dépendances du projet
# Le flag --legacy-peer-deps évite les blocages liés aux conflits de versions
npm install --legacy-peer-deps

# Démarrer le serveur de développement Angular
# L'application est accessible sur http://localhost:4200
npm start
```

### Phase 2 — Développement des missions et des bonus

```bash
# Lancer les tests unitaires pour valider chaque mission
npm test

# Exécuter Vitest directement en mode non-interactif (une seule passe, sans rechargement)
npx vitest run

# Vérifier la version installée d'Angular et de ses dépendances
npx ng version
```

### Phase 3 — Gestion des branches Git

```bash
# -----------------------------------------------
# Branche : fix/description-notes-detaillees
# -----------------------------------------------
git checkout main
git checkout -b fix/description-notes-detaillees
git add .
git commit -m "fix: Description & Notes detaillees - correction insertion toolbar et formatage Markdown"
git push origin fix/description-notes-detaillees

# -----------------------------------------------
# Branche : fix/responsive
# -----------------------------------------------
git checkout main
git checkout -b fix/responsive
git add .
git commit -m "fix(responsive): optimisation responsive complete pour mobiles, tablettes et desktop"
git add .
git commit -m "fix(responsive): wrap meta badges and prevent overlap with action buttons"
git push origin fix/responsive

# -----------------------------------------------
# Branche : feature/lucide-icons-modif
# -----------------------------------------------
git checkout main
git checkout -b feature/lucide-icons-modif

# Installation de la librairie Lucide Icons pour Angular
npm install @lucide/angular --legacy-peer-deps

git add .
git commit -m "feat(icons): remplacer les icones SVG brutes par la librairie Lucide Icons (@lucide/angular)"
git push origin feature/lucide-icons-modif

# Commit de la documentation
git add DOCUMENTATION.md
git commit -m "docs: ajouter la documentation complete du projet (DOCUMENTATION.md)"
git push origin feature/lucide-icons-modif
```

### Phase 4 — Commandes de vérification et de diagnostic Git

```bash
# Voir l'historique des commits (résumé court)
git log --oneline

# Voir l'historique complet avec dates et messages
git log --pretty=format:"%h | %ad | %s" --date=format:"%d/%m/%Y %H:%M" --all

# Lister toutes les branches (locales ET distantes sur GitHub)
git branch -a

# Vérifier l'état du dépôt (fichiers modifiés, en attente, etc.)
git status

# Voir les détails du dernier commit (fichiers modifiés, lignes ajoutées/supprimées)
git show --stat HEAD
```

### Phase 5 — Recherche dans le code source

```bash
# Chercher une chaîne de texte dans tous les fichiers TypeScript et HTML
# Utilisé pour localiser les boutons de la barre d'outils Markdown
grep -ri "Texte en gras" ./src
```

### Phase 6 — Installation de paquets npm supplémentaires

```bash
# Installer Lucide Icons pour Angular (bibliothèque d'icônes)
npm install @lucide/angular --legacy-peer-deps

# Vérifier la liste des paquets installés au premier niveau
npm list --depth=0
```

---

## 5. Le Framework Angular — Concepts utilisés

### 5.1. Standalone Components (sans NgModule)

Tous les composants sont **standalone** — ils n'ont pas besoin d'un module Angular classique.

```typescript
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
```

**Avantage :** Chaque composant est auto-suffisant et déclare explicitement ses dépendances dans `imports`.

### 5.2. Angular Signals & Réactivité

J'utilise le système de réactivité natif d'Angular (Signals), introduit dans Angular 16+ :

```typescript
// Déclaration d'un signal (état mutable)
private tasks = signal<Task[]>([]);

// Valeur dérivée calculée automatiquement
readonly pendingCount = computed(() =>
  this.tasks().filter(t => !t.done).length
);

// Mise à jour du signal
this.tasks.update(tasks => [...tasks, newTask]);
```

| API Signal | Usage dans le projet |
|---|---|
| `signal()` | État local : filtre sélectionné, texte de recherche, liste des tâches |
| `computed()` | Filtrage des tâches, calcul du % de sous-tâches terminées |
| `effect()` | Synchronisation automatique avec `localStorage` |

### 5.3. Communication entre composants

```typescript
// Passage de données parent vers enfant (typé)
readonly task = input.required<Task>();

// Émission d'événements enfant vers parent
readonly deleteTask = output<number>();
readonly toggleTask = output<number>();
```

### 5.4. Nouvelle syntaxe de templates (Control Flow)

Au lieu des anciennes directives `*ngIf` et `*ngFor`, j'utilise la nouvelle syntaxe native :

```html
<!-- Rendu conditionnel -->
@if (tasks().length > 0) {
  <app-task-item [task]="t" />
} @else {
  <p>Aucune tâche pour le moment.</p>
}

<!-- Boucle optimisée avec suivi de clé unique -->
@for (task of filteredTasks(); track task.id) {
  <app-task-item [task]="task" />
} @empty {
  <p>La liste est vide.</p>
}
```

### 5.5. Angular Router

```typescript
// Routes définies dans app.routes.ts
export const routes: Routes = [
  { path: '',          redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks',     component: TaskListComponent },
  { path: 'tasks/:id', component: TaskDetailComponent }
];
```

Récupération du paramètre d'URL dans le composant détail :

```typescript
const id = Number(this.route.snapshot.paramMap.get('id'));
```

---

## 6. Les librairies et packages installés

### 6.1. Dépendances de production

| Package | Version | Rôle |
|---|---|---|
| `@angular/common` | `^22.2.0` | Directives et pipes communs Angular |
| `@angular/compiler` | `^22.2.0` | Compilateur de templates Angular |
| `@angular/core` | `^22.2.0` | Noyau Angular (Signals, DI, Decorators) |
| `@angular/forms` | `^22.2.0` | Formulaires réactifs et template-driven |
| `@angular/platform-browser` | `^22.2.0` | Liaison DOM/navigateur |
| `@angular/router` | `^22.2.0` | Routeur SPA Angular |
| `@lucide/angular` | `^1.62.0` | **Bibliothèque d'icônes Lucide** |
| `rxjs` | `~7.8.0` | Programmation réactive (Observables) |
| `tslib` | `^2.3.0` | Helpers TypeScript de runtime |

### 6.2. Dépendances de développement

| Package | Version | Rôle |
|---|---|---|
| `@angular/build` | `^22.2.3` | Builder Vite/esbuild pour Angular |
| `@angular/cli` | `^22.2.3` | Interface en ligne de commande Angular |
| `@angular/compiler-cli` | `^22.2.0` | Compilateur AOT Angular |
| `jsdom` | `^30.0.0` | Environnement DOM simulé pour les tests |
| `prettier` | `^3.8.1` | Formateur de code automatique |
| `typescript` | `~6.0.2` | Compilateur TypeScript |
| `vitest` | `^5.0.0` | Framework de tests unitaires rapide |

### 6.3. Pourquoi j'ai choisi Lucide Icons

J'ai choisi **Lucide Icons** (`@lucide/angular`) pour les raisons suivantes :

1. **Légèreté (tree-shakeable) :** Seules les icônes réellement utilisées sont incluses dans le bundle final.
2. **Cohérence visuelle :** Toutes les icônes partagent le même style de trait.
3. **Intégration Angular native :** Le package fournit un composant `<lucide-icon>` directement utilisable dans les templates.
4. **Remplacement des SVG bruts :** Avant Lucide, chaque icône était un bloc SVG copié-collé qui alourdissait le code.

**Icônes intégrées dans le projet :**

| Icône Lucide | Utilisation |
|---|---|
| `LucideCalendar` | Dates limites |
| `LucideClock` | Heures d'échéance |
| `LucideTrash2` | Suppression de tâches |
| `LucideX` | Fermer / Supprimer un tag |
| `LucideTag` | Gestion des étiquettes |
| `LucideListTodo` | Sous-tâches |
| `LucideCheckSquare` | Cases à cocher Markdown |
| `LucideList` | Vue Liste |
| `LucideColumns` | Vue Kanban |
| `LucideTable` | Vue Tableau |
| `LucideFileText` | Documentation / Notes |
| `LucideStickyNote` | Notes rapides |
| `LucideLink` | Ajout de liens |
| `LucideExternalLink` | Ouvrir un lien externe |

---

## 7. Architecture du projet

```
gestion-de-taches/
├── src/
│   ├── index.html                      # Page HTML racine + balise meta viewport
│   ├── styles.css                      # Design System global : variables CSS, thème sombre, typographie
│   │
│   └── app/
│       ├── app.ts                      # Composant racine de l'application
│       ├── app.html                    # Template racine (<router-outlet>)
│       ├── app.config.ts               # Fournisseurs globaux (Router, etc.)
│       ├── app.routes.ts               # Définition des routes (/tasks, /tasks/:id)
│       │
│       └── features/
│           └── tasks/
│               ├── task.model.ts       # Interface TypeScript : Task, SubTask, TaskLink
│               ├── task.ts             # Service centralisé : état (Signals), CRUD, localStorage
│               ├── task.spec.ts        # Tests unitaires du service TaskService
│               │
│               ├── task-list/
│               │   ├── task-list.ts    # Logique des 4 vues, filtres, pagination, Kanban
│               │   ├── task-list.html  # Template HTML (Vue Liste / Kanban / Calendrier / Tableau)
│               │   └── task-list.css   # Styles + media queries responsives
│               │
│               ├── task-item/
│               │   ├── task-item.ts    # Émission des actions, formatage des dates
│               │   ├── task-item.html  # Carte de tâche avec icônes Lucide
│               │   └── task-item.css   # Styles adaptatifs (breakpoint 720px)
│               │
│               ├── task-form/
│               │   ├── task-form.ts    # Validation du formulaire, gestion des tags et dates
│               │   ├── task-form.html  # Formulaire de création de tâche
│               │   └── task-form.css   # Grille responsive, sélecteur de tags
│               │
│               └── task-detail/
│                   ├── task-detail.ts      # Éditeur Markdown, sous-tâches, notes, liens
│                   ├── task-detail.html    # Template de la vue détaillée complète
│                   ├── task-detail.css     # Styles avancés de la page détail
│                   └── task-detail.spec.ts # Tests unitaires du composant TaskDetail
│
├── angular.json                        # Configuration du projet Angular (builders, tests, build)
├── package.json                        # Déclaration des dépendances et scripts npm
├── package-lock.json                   # Verrouillage exact des versions installées
├── tsconfig.json                       # Configuration TypeScript principale
├── tsconfig.app.json                   # Config TypeScript pour le build applicatif
├── tsconfig.spec.json                  # Config TypeScript pour les tests
├── DOCUMENTATION.md                    # Ce fichier — documentation complète du projet
└── README.md                           # Présentation rapide du projet
```

---

## 8. Historique complet des commits (Git Log)

Voici l'intégralité des 16 commits réalisés sur ce projet, du plus récent au plus ancien :

| Hash | Date | Message |
|---|---|---|
| `45e9aed` | 27/10/2026 16:14 | `docs: ajouter la documentation complete du projet (DOCUMENTATION.md)` |
| `5683746` | 27/10/2026 16:03 | `feat(icons): remplacer les icones SVG brutes par la librairie Lucide Icons (@lucide/angular)` |
| `5ec6698` | 27/10/2026 15:36 | `fix(responsive): wrap meta badges and prevent overlap with action buttons` |
| `bbccd27` | 27/10/2026 15:29 | `fix(responsive): optimisation responsive complete pour mobiles, tablettes et desktop` |
| `2e0fdfd` | 27/10/2026 15:21 | `fix: Description & Notes detaillees - correction insertion toolbar et formatage Markdown` |
| `074a037` | 27/10/2026 14:17 | `fix(editeur): insertion du formatage a la position du curseur` |
| `f21b339` | 27/10/2026 11:39 | `feat: categories et etiquettes personnalisees avec filtrage dynamique` |
| `cccff89` | 27/10/2026 11:29 | `feat: page de details enrichie avec titre modifiable, sous-taches et progression automatique, notes et liens` |
| `f11846e` | 27/10/2026 11:16 | `feat: ajout de la date d'echeance, de l'heure et des rappels` |
| `ab926c3` | 27/10/2026 10:45 | `feat: ajouter la pagination pour eviter le defilement infini` |
| `58c5e14` | 27/10/2026 10:29 | `feat: implementer les bonus A, B, C et D` |
| `b6f50a4` | 27/10/2026 10:14 | `feat: realiser l ensemble des missions 1 a 10` |
| `10e4f1c` | 26/10/2026 14:47 | `Merge pull request #1 from therealwardell/feature/documentation_tache` |
| `e14d7b9` | 26/10/2026 14:14 | `docs: mise à jour du README.md, ajustements de styles et améliorations des routes` |
| `05eb029` | 26/10/2026 13:27 | `docs: mise à jour du README.md pour la gestion de taches` |
| `0088a94` | 22/10/2026 14:41 | `feat: initialisation complete du projet Gestion de taches` |

**Total : 16 commits** réalisés sur **5 jours** (22 octobre → 27 octobre 2026).

---

## 9. Détail des branches Git

### Arbre des branches

```
main                                    <- Branche principale stable
├── fix/description-notes-detaillees    <- Correction de l'éditeur Markdown
├── fix/responsive                      <- Corrections du responsive design
├── feature/lucide-icons-modif          <- Intégration des icônes Lucide (branche active)
├── feature/details-et-sous-taches      <- Page de détail et sous-tâches
├── feature/due-date-et-rappels         <- Dates limites et rappels
├── feature/tags-et-categories          <- Étiquettes et catégories personnalisées
├── feature/missions-completes          <- Missions 1 à 10 complètes
└── feature/vues-notion                 <- Vues Liste, Kanban, Calendrier, Tableau
```

### Description détaillée de chaque branche

#### `fix/description-notes-detaillees`

**Problème corrigé :** Les boutons de la barre d'outils Markdown (Gras, Italique, Titre, Liste, Lien) inséraient le texte formaté directement à la suite du contenu existant, sans retour à la ligne. Cela créait des fusions illisibles comme `**Gras***Italique*`.

**Solution appliquée :** Dans la méthode `insertFormat()` de `task-detail.ts`, j'ai ajouté une détection automatique : si le curseur n'est pas en début de ligne, un saut de ligne (`\n`) est automatiquement préfixé avant l'élément inséré.

**Correction bonus :** Ajout de `localStorage.clear()` dans les `beforeEach` de `task.spec.ts` et `task-detail.spec.ts` pour isoler correctement les tests unitaires entre eux (Mission 8).

---

#### `fix/responsive`

**Problème corrigé :** Sur mobile (écrans < 600px) et tablette (< 900px), les éléments d'interface se chevauchaient : les badges de priorité recouvraient les boutons d'action, les formulaires débordaient de leur conteneur, et la vue Kanban n'était pas lisible sur petit écran.

**Solution appliquée :**
- Media queries complètes dans `task-list.css`, `task-item.css`, `task-form.css`, `task-detail.css` et `styles.css`
- Breakpoints définis : `480px` (mobile S), `600px` (mobile L), `768px` (tablette), `900px` (tablette L), `1200px` (desktop L)
- `flex-wrap: wrap` sur les zones de badges et d'actions pour éviter les chevauchements
- La vue Kanban passe en colonne unique sur mobile

---

#### `feature/lucide-icons-modif`

**Objectif :** Remplacer les blocs SVG bruts copiés-collés dans les templates HTML par la bibliothèque officielle **Lucide Icons** (`@lucide/angular`).

**Commande d'installation :**
```bash
npm install @lucide/angular --legacy-peer-deps
```

**Bénéfices obtenus :**
- Code HTML allégé (suppression de centaines de lignes de SVG inline)
- Icônes visuellement cohérentes dans toute l'application
- Bundle final optimisé grâce au tree-shaking automatique
- Maintenance simplifiée : changer une icône = modifier un seul nom de propriété

---

## 10. Fonctionnalités développées

### 10.1. Missions 1 à 10 — Base du projet

| Mission | Fonctionnalité réalisée |
|---|---|
| Mission 1 | Modèle `Task` et interface TypeScript de base |
| Mission 2 | Service `TaskService` avec signal réactif et méthodes CRUD |
| Mission 3 | Composant `TaskListComponent` — affichage de la liste des tâches |
| Mission 4 | Composant `TaskFormComponent` — formulaire de création de tâche |
| Mission 5 | Composant `TaskItemComponent` — carte individuelle d'une tâche |
| Mission 6 | Filtres de recherche et de statut (tout / actives / terminées) |
| Mission 7 | Routage Angular — navigation vers `/tasks` et `/tasks/:id` |
| Mission 8 | Tests unitaires — `localStorage.clear()` dans `beforeEach` |
| Mission 9 | Persistance `localStorage` — sauvegarde et restauration automatique |
| Mission 10 | Composant `TaskDetailComponent` — vue détaillée complète |

### 10.2. Bonus A, B, C, D

| Bonus | Fonctionnalité réalisée |
|---|---|
| Bonus A | Filtres avancés par priorité (Haute, Normale, Basse) |
| Bonus B | Pagination pour éviter le défilement infini |
| Bonus C | Tri par date, priorité ou ordre alphabétique |
| Bonus D | Compteurs dynamiques (tâches restantes, terminées, total) |

### 10.3. Itérations d'amélioration avancées

| Itération | Fonctionnalité réalisée |
|---|---|
| Dates & Rappels | Date limite, heure d'échéance, badge rouge si retard |
| Page de détail enrichie | Titre modifiable inline, sous-tâches, barre de progression, notes, liens |
| Catégories & Tags | Tags prédéfinis + personnalisés, filtrage dynamique par tag |
| 4 Vues Notion | Vue Liste, Kanban 3 colonnes, Calendrier mensuel, Vue Tableau |
| Éditeur Markdown | Barre d'outils avec insertion contextuelle intelligente (position du curseur) |
| Responsive complet | Tous breakpoints couverts, approche mobile-first, Kanban adaptatif |
| Lucide Icons | Remplacement de tous les SVG bruts par `@lucide/angular` |

---

## 11. Guide d'exécution du projet

### Prérequis

- **Node.js** version 18 ou supérieure
- **npm** version 9 ou supérieure
- Une connexion Internet (pour la première installation)

### Démarrer le projet

#### Étape 1 — Cloner le projet depuis GitHub

```bash
git clone https://github.com/cyruisblade-art/gestion-de-taches.git
cd gestion-de-taches
```

#### Étape 2 — Installer les dépendances

```bash
npm install --legacy-peer-deps
```

> Le flag `--legacy-peer-deps` est nécessaire car certaines dépendances ont des contraintes
> de peer qui ne sont pas encore alignées sur Angular 22.

#### Étape 3 — Démarrer le serveur de développement

```bash
npm start
```

L'application est accessible sur **http://localhost:4200**

#### Étape 4 — Lancer les tests unitaires

```bash
npm test
```

Ou en mode non-interactif (une seule passe, sans rechargement) :

```bash
npx vitest run
```

#### Étape 5 — Compiler pour la production

```bash
npx ng build
```

Les fichiers compilés sont générés dans le dossier `dist/`.

#### Étape 6 — Explorer les branches Git

```bash
# Lister toutes les branches disponibles
git branch -a

# Aller sur la branche avec les icônes Lucide
git checkout feature/lucide-icons-modif

# Aller sur la branche des corrections responsive
git checkout fix/responsive

# Aller sur la branche des corrections Markdown
git checkout fix/description-notes-detaillees

# Revenir sur la branche principale
git checkout main
```

---

*Documentation rédigée par l'étudiant Angular — Projet Gestion de Tâches*
*Dernière mise à jour : 28/10/2026*
