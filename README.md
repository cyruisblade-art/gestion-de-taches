# Gestion de tâches

Application Angular 22 de gestion de tâches (ajout, filtrage, changement d'état, suppression, page de détail).

Ce document est ton point d'entrée : il explique comment lancer le projet, comment le code est organisé, et surtout **ce qu'il reste à faire**, dans l'ordre. Coche les cases au fur et à mesure (`- [x]`) dans tes pull requests.

---

## 1. Démarrage

### Prérequis

- **Node.js** : une version LTS compatible Angular 22 (voir [angular.dev/reference/versions](https://angular.dev/reference/versions))
- **npm** 11 (le projet déclare `npm@11.13.0`)
- **VS Code** recommandé : accepte les extensions proposées à l'ouverture (`.vscode/extensions.json`)

### Commandes

```bash
npm install          # installer les dépendances (à faire une seule fois)
npm start            # serveur de dev sur http://localhost:4200
npm test             # tests unitaires (Vitest)
npm run build        # build de production dans dist/
npx prettier --write src   # formater le code (config dans .prettierrc)
```

> Avant chaque PR : `npm test` et `npm run build` doivent passer **sans erreur**.

---

## 2. Comprendre le code existant

### Arborescence

```
src/
├── styles.css                     # Design system global (variables CSS : couleurs, rayons, ombres)
└── app/
    ├── app.ts / app.html          # Composant racine (juste un <router-outlet />)
    ├── app.config.ts              # Configuration de l'application (router…)
    ├── app.routes.ts              # Routes : /tasks et /tasks/:id (chargées en lazy loading)
    └── features/tasks/
        ├── task.model.ts          # Interface Task { id, title, done, priority }
        ├── task.ts                # TaskService : état des tâches (signals) + add/toggle/remove/getById
        ├── task-list/             # Page liste : compteur, filtres, formulaire, liste
        ├── task-form/             # Formulaire d'ajout (validation : titre obligatoire, ≥ 3 caractères)
        ├── task-item/             # Carte d'une tâche (case à cocher, lien détail, suppression)
        └── task-detail/           # Page détail d'une tâche (/tasks/:id)
```

### Ordre de lecture conseillé

1. `task.model.ts` → la donnée
2. `task.ts` + `task.spec.ts` → la logique métier et ses tests
3. `task-list/` → la page qui assemble tout
4. `task-form/` puis `task-item/` → les composants enfants (communication par `input()` / `output()`)
5. `app.routes.ts` puis `task-detail/` → le routing

### Notions Angular à maîtriser

Le projet utilise l'Angular **moderne**. Ne mélange pas avec d'anciens tutoriels (NgModule, `*ngIf`, `@Input()`…).

| Notion | Où la voir | Doc |
|---|---|---|
| Composants standalone | tous les composants | https://angular.dev/guide/components |
| Signals : `signal`, `computed` | `task.ts`, `task-list.ts` | https://angular.dev/guide/signals |
| `input()` / `output()` | `task-item.ts`, `task-form.ts` | https://angular.dev/guide/components/inputs |
| Control flow `@if` / `@for` | tous les `.html` | https://angular.dev/guide/templates/control-flow |
| Routing + lazy loading | `app.routes.ts` | https://angular.dev/guide/routing |
| Injection de dépendances (`inject()`) | `task-list.ts`, `task-detail.ts` | https://angular.dev/guide/di |
| Tests avec TestBed + Vitest | fichiers `*.spec.ts` | https://angular.dev/guide/testing |

### Conventions du projet

- **Langue** : interface et tests en français ; noms de code (variables, méthodes) en anglais.
- **État** : toute modification des tâches passe par `TaskService`. Les composants ne modifient jamais la liste eux-mêmes.
- **Styles** : utiliser les variables de `src/styles.css` (`var(--color-primary)`…), jamais de couleur en dur.
- **Tests** : chaque nouvelle méthode de service ou comportement de composant arrive avec ses tests.
- **Accessibilité** : garder les `aria-label`, `role`, `label for` déjà en place sur tout nouvel élément.

---

## 3. Méthode de travail

1. Partir de `main` à jour : `git checkout main && git pull`
2. Créer une branche par tâche : `git checkout -b feature/<nom-court>` (ou `fix/<nom>`)
3. Faire de petits commits au format [Conventional Commits](https://www.conventionalcommits.org/fr/) :
   `feat: ...`, `fix: ...`, `test: ...`, `refactor: ...`, `style: ...`, `docs: ...`
4. Ouvrir une pull request vers `main`, avec dans la description : ce qui a été fait, comment tester, captures d'écran si l'UI change.
5. Attendre la relecture avant de merger. **Une PR = une tâche de la liste ci-dessous.**

### Définition de « terminé »

Une tâche est terminée quand :

- [ ] le comportement décrit dans les critères d'acceptation fonctionne dans le navigateur
- [ ] des tests couvrent le nouveau comportement, et `npm test` passe
- [ ] `npm run build` passe sans erreur ni nouvel avertissement
- [ ] le code est formaté avec Prettier
- [ ] l'interface reste utilisable au clavier et sur mobile (fenêtre < 600 px)
- [ ] la case correspondante est cochée dans ce README

En cas de blocage de plus d'une demi-journée : demande de l'aide, en expliquant ce que tu as déjà essayé.

---

## 4. TODO

Taille indicative : **S** = petit, **M** = moyen, **L** = gros. Fais les phases dans l'ordre ; à l'intérieur d'une phase, l'ordre est conseillé.

### Phase 0 — Prise en main

- [ ] **0.1** Installer le projet, lancer `npm start` et `npm test`, vérifier que tout est vert. **S**
- [ ] **0.2** Lire le code dans l'ordre conseillé (section 2) et noter tes questions. **S**
- [ ] **0.3** Faire un premier petit changement (par ex. ajouter une tâche initiale dans `task.ts`), ouvrir une PR pour valider le circuit branche → commit → PR → relecture. **S**

### Phase 1 — Qualité et dette technique

- [ ] **1.1 Tests de `TaskItemComponent`** **S**
  `task-item/` est le seul composant sans fichier `.spec.ts`.
  - Créer `task-item.spec.ts` (s'inspirer de `task-form.spec.ts`).
  - Tester : le titre s'affiche ; cocher la case émet `toggled` avec l'id ; cliquer sur « Supprimer » émet `removed` avec l'id ; la classe `task-card--done` est présente si `done = true`.
  - Astuce : fournir l'input requis avec `fixture.componentRef.setInput('task', {...})` et `provideRouter([])` (le composant utilise `routerLink`).

- [ ] **1.2 Centraliser la règle de validation du titre** **S**
  La règle « au moins 3 caractères » est écrite à trois endroits (`task.ts`, deux fois dans `task-form.ts`), et les messages d'erreur sont dupliqués entre `onSubmit()` et `onTitleChange()`.
  - Créer une constante `TASK_TITLE_MIN_LENGTH` (par ex. dans `task.model.ts`).
  - Extraire une méthode privée `validate(title): string` dans `TaskFormComponent` qui renvoie le message d'erreur (ou `''`).
  - Les tests existants doivent continuer à passer sans modification.

- [ ] **1.3 Factoriser les badges** **M**
  Les styles `.priority-badge` sont copiés dans `task-item.css` et `task-detail.css` (avec des tailles légèrement différentes), et `.status-badge` est dans `task-detail.css`.
  - Créer un composant `app-priority-badge` (input : la priorité) et l'utiliser dans `task-item` et `task-detail`.
  - Supprimer les styles dupliqués.

- [ ] **1.4 Supprimer les couleurs en dur** **S**
  `task-detail.css` utilise `#dcfce7` et `#15803d` pour le badge « Terminée ».
  - Ajouter des variables `--color-success-bg` / `--color-success-text` dans `styles.css` et les utiliser.

- [ ] **1.5 Nettoyer le CSS mort** **S**
  - `task-item.css` : la règle `.btn span { display: none; }` ne cible rien (les libellés des boutons ne sont pas dans des `<span>`). Décider : soit entourer les libellés « Détail » / « Supprimer » d'un `<span>` pour n'afficher que l'icône sur mobile (en gardant les `aria-label`), soit supprimer la règle.
  - `styles.css` : supprimer le commentaire obsolète en fin de fichier sur le pipe `titlecase`.

- [ ] **1.6 Corrections d'accessibilité** **S**
  - `task-form.html` : `aria-describedby="task-title-error"` pointe vers un élément qui n'existe pas quand il n'y a pas d'erreur → n'ajouter l'attribut que si `errorMessage()` est non vide (`[attr.aria-describedby]`).
  - `task-list.html` : le filtre « terminées » génère l'id `filter-terminées` (accent dans un id) → utiliser un id sans accent.
  - `task-list.html` : le `role="tabpanel"` n'est relié à aucun onglet → ajouter `aria-labelledby` vers le filtre actif.

- [ ] **1.7 Mettre en place ESLint** **S**
  - `ng add angular-eslint`, puis ajouter un script `"lint"` dans `package.json`.
  - Corriger les erreurs remontées (PR séparée si elles sont nombreuses).

### Phase 2 — Fonctionnalités

- [ ] **2.1 Persistance dans le navigateur (localStorage)** **M** — *priorité haute*
  Aujourd'hui, toutes les tâches sont perdues au rechargement de la page.
  - Critères d'acceptation :
    - après ajout / modification / suppression puis rechargement (F5), la liste est identique ;
    - au premier lancement (rien en stockage), les 4 tâches d'exemple s'affichent ;
    - si le contenu stocké est invalide (JSON cassé), l'application ne plante pas et repart des tâches d'exemple ;
    - les nouveaux identifiants restent uniques après rechargement (calculer `_nextId` à partir du plus grand id existant).
  - Piste : charger dans `TaskService` au démarrage, sauvegarder avec un `effect()` qui observe `_tasks`.
  - Tests : simuler `localStorage` (jsdom le fournit) et le vider dans un `beforeEach`.

- [ ] **2.2 Actions depuis la page détail** **M**
  - Ajouter sur `/tasks/:id` un bouton « Marquer comme terminée / active » et un bouton « Supprimer ».
  - Après suppression, rediriger vers `/tasks` (`Router.navigate`).
  - ⚠️ Piège : aujourd'hui `TaskDetailComponent` copie la tâche une seule fois dans `ngOnInit`, donc l'affichage ne se mettra pas à jour après un changement d'état. Remplacer par un `computed()` qui lit le service. Bonus : activer `withComponentInputBinding()` dans `app.config.ts` et recevoir l'id via `id = input<string>()` au lieu de `ActivatedRoute`.
  - Adapter `task-detail.spec.ts` en conséquence.

- [ ] **2.3 Modifier une tâche** **L**
  - Service : ajouter `update(id, changes: { title?, priority? })` avec la même validation que `add()` (titre rogné, ≥ 3 caractères, id inconnu → ne rien faire) + tests.
  - UI : permettre d'éditer le titre et la priorité depuis la page détail. Réutiliser `TaskFormComponent` en lui ajoutant un mode édition (input optionnel `initial`, libellé du bouton « Enregistrer ») plutôt que de dupliquer le formulaire.
  - Un bouton « Annuler » revient à l'affichage sans enregistrer.

- [ ] **2.4 Confirmation avant suppression** **S**
  - Demander confirmation avant de supprimer (dans la liste et dans la page détail).
  - Commencer simple (`window.confirm`), puis, si le temps le permet, une petite boîte de dialogue maison accessible (élément `<dialog>`).

- [ ] **2.5 Garder le filtre dans l'URL** **S**
  - Le filtre choisi doit apparaître dans l'URL (`/tasks?filtre=actives`) pour survivre au rechargement et pouvoir être partagé.
  - Une valeur inconnue dans l'URL retombe sur « toutes ».

- [ ] **2.6 Tri et recherche** **M**
  - Champ de recherche filtrant les tâches par titre (insensible à la casse et aux accents si possible).
  - Tri : par priorité (haute → basse) ou par ordre de création.
  - Se combine avec les filtres existants (tout passe par le `computed` `filteredTasks`).

- [ ] **2.7 « Supprimer les tâches terminées »** **S**
  - Bouton visible uniquement s'il existe au moins une tâche terminée, avec confirmation.
  - Méthode `removeDone()` dans le service + tests.

- [ ] **2.8 Dates (optionnel)** **L**
  - Ajouter `createdAt` (automatique) et `dueDate` (optionnelle, saisie dans le formulaire) au modèle `Task`.
  - Afficher la date d'échéance dans la carte et le détail ; mettre en évidence les tâches en retard.
  - Attention : changer le modèle impacte le service, les tests et les données déjà stockées en localStorage (prévoir les anciennes tâches sans date).

### Phase 3 — Finalisation

- [ ] **3.1 Intégration continue** **M**
  - Workflow GitHub Actions (`.github/workflows/ci.yml`) qui lance sur chaque PR : `npm ci`, `npm run lint`, `npm test -- --watch=false`, `npm run build`.

- [ ] **3.2 Tests de bout en bout (optionnel)** **M**
  - Installer Playwright et écrire 2–3 scénarios : ajouter une tâche, la cocher, filtrer, ouvrir son détail, la supprimer.

- [ ] **3.3 Documentation finale** **S**
  - Remplacer la section TODO de ce README par une section « Fonctionnalités » décrivant l'application terminée.
  - Ajouter une capture d'écran.

---

## 5. Ressources

- Documentation officielle Angular : https://angular.dev
- Tutoriel interactif Angular : https://angular.dev/tutorials/learn-angular
- Vitest : https://vitest.dev
- Accessibilité (formulaires, onglets) : https://developer.mozilla.org/fr/docs/Web/Accessibility
