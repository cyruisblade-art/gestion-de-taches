# Gestion de tâches

Bienvenue sur le projet !

C'est une petite application web pour gérer une liste de tâches (une « todo list ») : on peut **ajouter** une tâche, la **cocher** quand elle est faite, la **supprimer**, **filtrer** la liste et voir le **détail** d'une tâche.

Elle est faite avec **Angular**, un outil pour créer des sites web en **TypeScript** (du JavaScript avec des types).

Ce document t'explique comment lancer le projet, comment il est rangé, puis te donne une **liste de missions**, de la plus simple à la plus difficile. Prends ton temps, fais-les dans l'ordre, et n'hésite jamais à poser des questions.

---

## 1. Installer et lancer le projet

### Ce qu'il te faut

- **Node.js** (version LTS) : https://nodejs.org → télécharge et installe la version « LTS ».
- **VS Code** : https://code.visualstudio.com
- **Git** : https://git-scm.com

Pour vérifier que Node est bien installé, ouvre un terminal et tape :

```bash
node -v
npm -v
```

Tu dois voir deux numéros de version s'afficher.

### Lancer l'application

Dans un terminal ouvert dans le dossier du projet :

```bash
npm install
```

Télécharge tout ce dont le projet a besoin (dossier `node_modules`). À faire **une seule fois** (ou quand quelqu'un ajoute une dépendance).

```bash
npm start
```

Lance l'application. Ouvre ton navigateur sur **http://localhost:4200**. Tu dois voir la liste des tâches.
Laisse ce terminal ouvert : dès que tu modifies un fichier et que tu enregistres, la page se met à jour toute seule.
Pour arrêter : `Ctrl + C` dans le terminal.

```bash
npm test
```

Lance les **tests automatiques**. Ce sont des petits programmes qui vérifient que le code fonctionne. Tout doit être vert. Si quelque chose est rouge, lis le message : il dit quel test a échoué et pourquoi.

---

## 2. Petit lexique

| Mot | Ce que ça veut dire ici |
|---|---|
| **Composant** | Un morceau de page. Il est fait de 3 fichiers : `.ts` (le code), `.html` (ce qu'on affiche), `.css` (le style). Exemple : `task-item` = la carte d'une tâche. |
| **Service** | Un fichier qui contient les données et les actions. Ici `task.ts` contient la liste des tâches et les fonctions `add`, `toggle`, `remove`. |
| **Signal** | Une variable « intelligente » : quand sa valeur change, l'affichage se met à jour tout seul. On lit sa valeur avec des parenthèses : `tasks()`. On la change avec `.set(...)` ou `.update(...)`. |
| **computed** | Une valeur calculée à partir d'autres signals, recalculée automatiquement. Exemple : le nombre de tâches restantes. |
| **input() / output()** | La façon dont un composant parent et un composant enfant se parlent. `input()` = une donnée que le parent donne à l'enfant. `output()` = un message que l'enfant envoie au parent (par exemple « on m'a cliqué »). |
| **Route** | Une adresse dans l'application. `/tasks` = la liste, `/tasks/2` = le détail de la tâche n°2. |
| **Test** | Un fichier `.spec.ts` qui vérifie automatiquement qu'un morceau de code fait bien ce qu'il doit faire. Il porte le même nom que le fichier qu'il teste : `task.ts` est testé par `task.spec.ts`. |
| **Branche / commit / PR** | Voir la partie 5 (Git). |

---

## 3. Comment le code est rangé

Tout le code intéressant est dans `src/app/features/tasks/` :

```
features/tasks/
├── task.model.ts     ← À quoi ressemble une tâche : id, titre, faite ou non, priorité
├── task.ts           ← Le SERVICE : la liste des tâches + ajouter / cocher / supprimer
├── task.spec.ts      ← Les tests du service
├── task-list/        ← La page principale (compteur, filtres, formulaire, liste)
├── task-form/        ← Le formulaire « Nouvelle tâche »
├── task-item/        ← La carte d'une seule tâche dans la liste
└── task-detail/      ← La page de détail d'une tâche
```

Chaque dossier de composant contient les mêmes fichiers. Exemple avec `task-list/` :

| Fichier | À quoi il sert |
|---|---|
| `task-list.ts` | Le code : les données affichées et les fonctions appelées quand on clique |
| `task-list.html` | Ce qui est affiché à l'écran |
| `task-list.css` | Le style (couleurs, tailles, espacements), uniquement pour ce composant |
| `task-list.spec.ts` | Les tests de ce composant |

Autres fichiers utiles :

- `src/app/app.routes.ts` : la liste des adresses (routes) de l'application.
- `src/styles.css` : les couleurs et styles communs à tout le site. Les couleurs y sont rangées dans des **variables**, par exemple `--color-primary` (le bleu). Dans les autres fichiers CSS, on les utilise comme ça : `color: var(--color-primary);`

### Comment les morceaux se parlent

```
task-list (la page)
 ├── affiche task-form  ── quand on valide le formulaire, il prévient task-list
 └── affiche plusieurs task-item ── quand on coche ou supprime, ils préviennent task-list
                        │
                        ▼
            task-list demande au service (task.ts) de faire le changement
```

**Règle importante** : seules les fonctions du service (`task.ts`) modifient la liste des tâches. Les composants demandent au service, ils ne modifient jamais la liste eux-mêmes.

### Par où commencer la lecture

1. `task.model.ts`
2. `task.ts`
3. `task-list/task-list.ts` puis `task-list.html`
4. `task-form/` et `task-item/`
5. `task-detail/`

Pour chaque fichier, essaie de répondre à : « Qu'est-ce que ce fichier affiche ou fait ? ». Note tes questions au fur et à mesure.

---

## 4. Les TODO dans le code

Dans les fichiers du projet, tu trouveras des commentaires qui commencent par **`TODO Mission`** suivi d'un numéro. Ils sont placés **exactement à l'endroit où tu dois écrire du code** et expliquent quoi faire.

Ils ont cette forme selon le type de fichier :

```ts
// TODO Mission 4 : ...                  (fichiers .ts)
```
```html
<!-- TODO Mission 6 : ... -->            (fichiers .html)
```
```css
/* TODO Mission 5 : ... */               (fichiers .css)
```

**Pour trouver tous les TODO d'une mission** : dans VS Code, fais `Ctrl + Shift + F` (recherche dans tout le projet) et tape par exemple `TODO Mission 6`. Tu obtiens la liste de tous les endroits à modifier.

**Quand tu as fini un TODO**, supprime le commentaire. À la fin d'une mission, la recherche `TODO Mission X` ne doit plus rien trouver.

---

## 5. Comment travailler avec Git

Pour **chaque mission** :

```bash
# 1. Repartir de la dernière version
git checkout main
git pull

# 2. Créer une branche pour la mission (un nom court, sans espace ni accent)
git checkout -b feature/mission-4-confirmation

# 3. Travailler... puis enregistrer ton travail régulièrement
git add .
git commit -m "feat: confirmation avant suppression d'une tâche"

# 4. Envoyer ta branche
git push -u origin feature/mission-4-confirmation
```

5. Sur GitHub, ouvre une **Pull Request (PR)** vers `main`. Explique en quelques lignes ce que tu as fait et comment le tester.
6. Je relis, je te fais des retours, et on fusionne ensemble.

**Début des messages de commit :**

- `feat:` nouvelle fonctionnalité
- `fix:` correction d'un bug
- `test:` ajout ou modification de tests
- `style:` changement de CSS / d'apparence
- `docs:` documentation

### Avant de dire « j'ai fini »

- [ ] Ça marche dans le navigateur (j'ai testé à la main)
- [ ] `npm test` est tout vert
- [ ] J'ai ajouté les tests demandés dans la mission
- [ ] La recherche `TODO Mission X` ne trouve plus rien pour ma mission
- [ ] La page reste correcte quand je rétrécis la fenêtre (affichage mobile)
- [ ] J'ai coché la mission dans ce README

> **Bloqué depuis plus d'une heure ?** Viens me voir. Dis-moi ce que tu essaies de faire et ce que tu as déjà essayé. C'est normal d'être bloqué, ça fait partie du travail.

---

## 6. Tes missions

Chaque mission indique sa difficulté (facile, moyen ou difficile), les **fichiers à modifier**, les **fichiers à créer** s'il y en a, et ce qu'il faut obtenir à la fin.

Coche chaque mission terminée en remplaçant `[ ]` par `[x]`.

### Vue d'ensemble

| Mission | Fichiers à modifier | Fichiers à créer |
|---|---|---|
| 1, 2 | aucun | aucun |
| 3 | `task.ts` | aucun |
| 4 | `task-list.ts`, `task-list.spec.ts` | aucun |
| 5 | `styles.css`, `task-detail.css` | aucun |
| 6 | `task.ts`, `task.spec.ts`, `task-list.ts`, `task-list.html`, `task-list.css` | aucun |
| 7 | `task-list.ts`, `task-list.html`, `task-list.css`, `task-list.spec.ts` | aucun |
| 8 | `task.ts`, `task.spec.ts`, `task-list.spec.ts`, `task-detail.spec.ts` | `task-storage.ts`, `task-storage.spec.ts` |
| 9 | `task-detail.ts`, `task-detail.html`, `task-detail.css`, `task-detail.spec.ts` | aucun |
| 10 | `task.ts`, `task.spec.ts`, `task-detail.ts`, `task-detail.html` | dossier `task-edit/` (4 fichiers) |
| Bonus A | `task-list.ts`, `task-list.html` | aucun |
| Bonus B | aucun | `task-item.spec.ts` |
| Bonus C | `task.model.ts`, `task.ts`, `task-form.ts`, `task-form.html`, `task-form.spec.ts`, `task-list.ts`, `task-item.ts`, `task-item.html`, `task-item.css`, `task-detail.html` | aucun |

---

### Étape 1 - Découvrir le projet

- [ ] **Mission 1 : Installer et explorer** (facile)
  - Installe et lance le projet (partie 1).
  - Utilise l'application : ajoute des tâches, coche-les, filtre, ouvre un détail, supprime.
  - Essaie d'ajouter une tâche avec un titre vide ou de 2 lettres : que se passe-t-il ?
  - Appuie sur F5 : que deviennent les tâches que tu as ajoutées ? (On corrigera ça en mission 8.)
  - Lance `npm test` et regarde les résultats.

- [ ] **Mission 2 : Lire le code** (facile)
  - Lis les fichiers dans l'ordre de la partie 3.
  - Fais `Ctrl + Shift + F` → `TODO Mission` pour voir tous les endroits où tu vas travailler.
  - Retrouve dans le code : où est définie la liste des tâches de départ ? Où est vérifié qu'un titre fait au moins 3 caractères ?
  - On en discute ensemble.

- [ ] **Mission 3 : Ta première modification** (facile)
  - **Fichier à modifier** : `src/app/features/tasks/task.ts` (cherche `TODO Mission 3`).
  - **Étapes** :
    1. Ajoute une 5e tâche dans la liste de départ, sur le même modèle que les 4 autres, avec `id: 5`.
    2. Change la valeur de `_nextId` de `5` à `6` (c'est le numéro que prendra la prochaine tâche ajoutée).
    3. Vérifie qu'elle apparaît dans le navigateur et que `npm test` est toujours vert.
    4. Fais ta première branche, ton premier commit et ta première PR (partie 5).

---

### Étape 2 - Petites améliorations

- [ ] **Mission 4 : Confirmer avant de supprimer** (facile)
  - **Objectif** : quand on clique sur « Supprimer », le navigateur demande « Voulez-vous vraiment supprimer cette tâche ? ». Si on clique sur « Annuler », rien ne se passe.
  - **Fichiers à modifier** (cherche `TODO Mission 4`) :
    | Fichier | Quoi faire |
    |---|---|
    | `task-list/task-list.ts` | Ajouter la confirmation dans la fonction `onRemoved` |
    | `task-list/task-list.spec.ts` | Adapter le test `onRemoved doit appeler taskService.remove` (le TODO explique comment) |
  - **À savoir** : `window.confirm('Votre question')` affiche une fenêtre avec OK / Annuler. Elle renvoie `true` si on clique sur OK, `false` sinon.
  - **Exemple de structure** :
    ```ts
    if (window.confirm('...')) {
      // ici, l'utilisateur a cliqué sur OK
    }
    ```
  - **C'est réussi quand** : « Annuler » garde la tâche, « OK » la supprime.

- [ ] **Mission 5 : Remplacer des couleurs écrites en dur** (facile)
  - **Le problème** : dans `task-detail.css`, le badge « Terminée » utilise des couleurs écrites directement (`#dcfce7` et `#15803d`). Toutes les autres couleurs du projet sont rangées dans des variables dans `styles.css`, pour pouvoir les changer à un seul endroit.
  - **Fichiers à modifier** (cherche `TODO Mission 5`) :
    | Fichier | Quoi faire |
    |---|---|
    | `src/styles.css` | Ajouter `--color-success-bg: #dcfce7;` et `--color-success-text: #15803d;` dans le bloc `:root` |
    | `task-detail/task-detail.css` | Remplacer `#dcfce7` par `var(--color-success-bg)` et `#15803d` par `var(--color-success-text)` |
  - **C'est réussi quand** : le badge « Terminée » de la page détail a exactement la même couleur qu'avant.

- [ ] **Mission 6 : Bouton « Supprimer les tâches terminées »** (moyen)
  - **Objectif** : un bouton sur la page principale qui supprime d'un coup toutes les tâches cochées. Il n'apparaît que s'il y a au moins une tâche terminée.
  - **Fichiers à modifier** (cherche `TODO Mission 6`) :
    | Fichier | Quoi faire |
    |---|---|
    | `task.ts` | Créer la fonction `removeDone()` qui garde seulement les tâches où `done` est `false` |
    | `task.spec.ts` | Ajouter les tests de `removeDone()` |
    | `task-list.ts` | Créer `doneCount` (nombre de tâches terminées) et la fonction `onRemoveDone()` |
    | `task-list.html` | Ajouter le bouton, affiché seulement si `doneCount() > 0` |
    | `task-list.css` | Donner un style au bouton |
  - **Étapes** :
    1. Dans `task.ts`, écris `removeDone()`. Regarde `remove()` juste au-dessus : c'est presque la même chose, seule la condition du `filter` change.
    2. Dans `task.spec.ts`, ajoute les tests décrits dans le TODO, puis lance `npm test`.
    3. Dans `task-list.ts`, crée `doneCount` avec `computed()` (inspire-toi de `remainingCount` dans `task.ts`), puis `onRemoveDone()` qui demande confirmation (comme en mission 4) et appelle `this.taskService.removeDone()`.
    4. Dans `task-list.html`, ajoute le bouton dans un `@if (doneCount() > 0) { ... }`, avec `(click)="onRemoveDone()"`.
  - **C'est réussi quand** : le bouton n'apparaît que s'il y a des tâches cochées, et un clic (après confirmation) les supprime toutes.

- [ ] **Mission 7 : Rechercher une tâche** (moyen)
  - **Objectif** : un champ « Rechercher une tâche… » au-dessus de la liste. Quand on tape du texte, seules les tâches dont le titre contient ce texte s'affichent. Ça marche même avec les majuscules (« LIRE » trouve « Lire la documentation »).
  - **Fichiers à modifier** (cherche `TODO Mission 7`) :
    | Fichier | Quoi faire |
    |---|---|
    | `task-list.ts` | Créer le signal `search` et l'utiliser dans `filteredTasks` |
    | `task-list.html` | Ajouter le champ de recherche |
    | `task-list.css` | Donner un style au champ |
    | `task-list.spec.ts` | Ajouter les tests de la recherche |
  - **Étapes** :
    1. Dans `task-list.ts`, crée `search = signal('')`.
    2. Dans `task-list.html`, ajoute l'`<input>`. Regarde comment le champ « Titre » est fait dans `task-form/task-form.html` : `[value]` affiche la valeur, `(input)` la met à jour quand on tape.
    3. Dans `filteredTasks`, après le filtre actives/terminées, garde seulement les tâches dont le titre contient la recherche.
  - **Indice** : `task.title.toLowerCase().includes(texte.toLowerCase())` renvoie `true` si le titre contient le texte, sans tenir compte des majuscules.
  - **C'est réussi quand** : la recherche marche en même temps que les filtres « Actives » / « Terminées », et un champ vide affiche tout.

---

### Étape 3 - Les grosses fonctionnalités

- [ ] **Mission 8 : Ne plus perdre les tâches au rechargement** (difficile) - *la plus importante*
  - **Le problème** : si tu appuies sur F5, toutes les tâches que tu as ajoutées disparaissent.
  - **Objectif** : sauvegarder les tâches dans le navigateur grâce au **localStorage** (une petite mémoire du navigateur qui garde du texte même après un rechargement ou une fermeture).
  - **À savoir** :
    ```ts
    // Enregistrer : on transforme la liste en texte avec JSON.stringify
    localStorage.setItem('tasks', JSON.stringify(liste));

    // Relire : on retransforme le texte en liste avec JSON.parse
    const texte = localStorage.getItem('tasks'); // vaut null s'il n'y a rien
    const liste = JSON.parse(texte);             // plante si le texte est abîmé -> utiliser try / catch
    ```
  - **Fichiers à créer** :
    | Fichier | À quoi il sert |
    |---|---|
    | `src/app/features/tasks/task-storage.ts` | Le **seul** fichier qui parle au localStorage. Il contient deux fonctions : `loadTasks()` pour relire les tâches enregistrées, et `saveTasks(tasks)` pour les enregistrer. Le service les utilisera sans savoir comment ça marche dedans. |
    | `src/app/features/tasks/task-storage.spec.ts` | Les tests de ces deux fonctions. |
  - **Contenu de départ de `task-storage.ts`** (copie-le, puis complète les deux fonctions) :
    ```ts
    import { Task } from './task.model';

    /** Nom sous lequel les tâches sont rangées dans le localStorage */
    const STORAGE_KEY = 'tasks';

    /**
     * Relit les tâches enregistrées.
     * Renvoie null s'il n'y a rien d'enregistré ou si le contenu est abîmé.
     */
    export function loadTasks(): Task[] | null {
      // 1. Lire le texte avec localStorage.getItem(STORAGE_KEY)
      // 2. Si c'est null, renvoyer null
      // 3. Sinon, essayer JSON.parse dans un try / catch
      // 4. Si JSON.parse plante (catch), renvoyer null
      return null;
    }

    /** Enregistre la liste des tâches */
    export function saveTasks(tasks: Task[]): void {
      // Transformer la liste en texte avec JSON.stringify et l'enregistrer avec localStorage.setItem
    }
    ```
  - **Contenu de départ de `task-storage.spec.ts`** (complète les trois tests) :
    ```ts
    import { loadTasks, saveTasks } from './task-storage';

    describe('task-storage', () => {
      beforeEach(() => {
        localStorage.clear(); // chaque test part d'un localStorage vide
      });

      it('loadTasks renvoie null si rien n est enregistre', () => {
        // appeler loadTasks() et vérifier que le résultat est null
      });

      it('loadTasks renvoie les taches enregistrees par saveTasks', () => {
        // appeler saveTasks([...une tâche...]), puis loadTasks(), et comparer avec toEqual
      });

      it('loadTasks renvoie null si le contenu est abime', () => {
        // localStorage.setItem('tasks', 'pas du json') puis vérifier que loadTasks() renvoie null
      });
    });
    ```
  - **Fichiers à modifier** (cherche `TODO Mission 8`) :
    | Fichier | Quoi faire |
    |---|---|
    | `task.ts` | Au démarrage, utiliser `loadTasks()` ; à chaque changement, appeler `saveTasks()` ; calculer `_nextId` à partir du plus grand `id` |
    | `task.spec.ts`, `task-list.spec.ts`, `task-detail.spec.ts` | Ajouter `localStorage.clear()` au début de chaque test, sinon les tests se gênent entre eux (un test supprime une tâche, et le suivant ne la retrouve plus) |
  - **Ordre conseillé** : d'abord `task-storage.ts` et ses tests (vérifie avec `npm test`), ensuite seulement `task.ts`.
  - **C'est réussi quand** :
    - j'ajoute une tâche, je fais F5 → elle est toujours là ;
    - je coche ou supprime, je fais F5 → c'est bien gardé ;
    - j'ajoute une tâche après F5 → elle a un nouveau numéro, différent de tous les autres ;
    - au tout premier lancement (rien d'enregistré), les tâches d'exemple s'affichent.
  - **Pour revenir à zéro** pendant tes essais : outils de développement du navigateur (F12) → onglet « Application » → « Local Storage » → `http://localhost:4200` → supprimer la ligne `tasks`.

- [ ] **Mission 9 : Cocher et supprimer depuis la page détail** (difficile)
  - **Objectif** : sur la page détail d'une tâche, ajouter deux boutons :
    - « Marquer comme terminée » (ou « Marquer comme active » si elle est déjà terminée) ;
    - « Supprimer » : après confirmation, supprime la tâche et revient automatiquement à la liste.
  - **Le piège** : aujourd'hui, la page détail **copie** la tâche une seule fois, à l'ouverture de la page (dans `ngOnInit`). Si tu coches la tâche, la copie ne change pas et l'écran ne se met pas à jour. Il faut d'abord remplacer cette copie par un `computed()` qui va chercher la tâche dans le service : il se recalculera tout seul à chaque changement. Le TODO dans `task-detail.ts` explique comment, étape par étape. **Viens me voir avant de commencer cette partie.**
  - **Fichiers à modifier** (cherche `TODO Mission 9`) :
    | Fichier | Quoi faire |
    |---|---|
    | `task-detail.ts` | Remplacer `signal` + `ngOnInit` par un `computed()` ; ajouter `onToggle()` et `onRemove()` |
    | `task-detail.html` | Ajouter les deux boutons dans le pied de la carte ; supprimer le bloc « Chargement… » devenu inutile |
    | `task-detail.css` | Donner un style aux deux boutons |
    | `task-detail.spec.ts` | Ajouter les tests des deux boutons |
  - **Indice pour revenir à la liste** :
    ```ts
    import { Router } from '@angular/router';
    // ...
    private router = inject(Router);
    // ...
    this.router.navigate(['/tasks']);
    ```
  - **C'est réussi quand** : cocher depuis la page détail met à jour les badges tout de suite, et supprimer ramène sur la liste où la tâche n'est plus là.

- [ ] **Mission 10 : Modifier une tâche** (difficile)
  - **Objectif** : sur la page détail, un bouton « Modifier » affiche un formulaire déjà rempli avec le titre et la priorité de la tâche. « Enregistrer » applique les changements, « Annuler » ferme le formulaire sans rien changer.
  - **Fichiers à créer** : un nouveau composant `task-edit`. Crée-le avec la commande :
    ```bash
    npx ng generate component features/tasks/task-edit
    ```
    Elle crée le dossier `src/app/features/tasks/task-edit/` avec 4 fichiers :
    | Fichier | À quoi il sert |
    |---|---|
    | `task-edit.ts` | Le code du formulaire de modification : il **reçoit** la tâche à modifier (`input`), garde le titre et la priorité en cours de saisie (`signal`), vérifie le titre, et **prévient** la page détail quand on clique sur « Enregistrer » ou « Annuler » (`output`) |
    | `task-edit.html` | Le formulaire affiché : champ titre, liste de priorités, boutons « Enregistrer » et « Annuler », message d'erreur |
    | `task-edit.css` | Le style du formulaire |
    | `task-edit.spec.ts` | Les tests du formulaire |

    Attention : la commande peut appeler la classe `TaskEdit`. Renomme-la en `TaskEditComponent`, comme les autres composants du projet (`TaskListComponent`, `TaskFormComponent`…), et vérifie que le sélecteur est bien `app-task-edit`.
  - **Contenu de `task-edit.ts`** : prends `task-form/task-form.ts` comme modèle, c'est presque le même formulaire. Les différences :
    ```ts
    // La tâche à modifier, donnée par la page détail
    task = input.required<Task>();

    // Messages envoyés à la page détail
    saved = output<{ title: string; priority: Task['priority'] }>();
    cancelled = output<void>();

    // Les champs commencent vides : il faut les remplir avec la tâche reçue.
    // Fais-le dans ngOnInit() :  this.title.set(this.task().title); (pareil pour la priorité)
    ```
    Pour `task-edit.html`, copie `task-form/task-form.html` et adapte : titre « Modifier la tâche », bouton « Enregistrer », et ajoute un bouton « Annuler » avec `type="button"` et `(click)="cancelled.emit()"`.
  - **Fichiers à modifier** (cherche `TODO Mission 10`) :
    | Fichier | Quoi faire |
    |---|---|
    | `task.ts` | Créer `update(id, title, priority)` : même vérification du titre que `add()`, et modification d'une seule tâche comme dans `toggle()` |
    | `task.spec.ts` | Ajouter les tests de `update()` |
    | `task-detail.ts` | Ajouter le signal `editing` (formulaire ouvert ou non), importer `TaskEditComponent`, créer `onSaved()` |
    | `task-detail.html` | Ajouter le bouton « Modifier » et afficher `<app-task-edit>` quand `editing()` est vrai |
  - **Tests à écrire dans `task-edit.spec.ts`** : le formulaire est pré-rempli avec la tâche ; un titre trop court affiche une erreur et n'envoie rien ; « Enregistrer » envoie `saved` avec le bon titre et la bonne priorité ; « Annuler » envoie `cancelled`. Inspire-toi de `task-form.spec.ts`. Pour donner la tâche au composant dans le test : `fixture.componentRef.setInput('task', uneTache);` avant `fixture.detectChanges()`.
  - **C'est réussi quand** : je modifie le titre d'une tâche, j'enregistre, la page détail et la liste affichent le nouveau titre ; « Annuler » ne change rien.

---

### Bonus - si tout le reste est fini

- [ ] **Bonus A : Trier la liste** (moyen)
  - **Objectif** : une liste déroulante « Trier par » avec deux choix : « Ordre d'ajout » et « Priorité » (haute, puis normale, puis basse).
  - **Fichiers à modifier** (cherche `TODO Bonus A`) : `task-list.ts` (signal `sortBy`, tri dans `filteredTasks`) et `task-list.html` (la liste déroulante, sur le modèle du champ « Priorité » de `task-form.html`).
  - **Indice** : `[...liste].sort((a, b) => ...)` trie une copie de la liste. Donne un nombre à chaque priorité (`haute: 0, normale: 1, basse: 2`) et compare ces nombres.

- [ ] **Bonus B : Écrire les tests de la carte de tâche** (moyen)
  - **Fichier à créer** : `src/app/features/tasks/task-item/task-item.spec.ts`. C'est le seul composant qui n'a pas encore de tests.
  - **Contenu de départ** :
    ```ts
    import { ComponentFixture, TestBed } from '@angular/core/testing';
    import { provideRouter } from '@angular/router';
    import { vi } from 'vitest';
    import { TaskItemComponent } from './task-item';
    import { Task } from '../task.model';

    describe('TaskItemComponent', () => {
      let fixture: ComponentFixture<TaskItemComponent>;
      let component: TaskItemComponent;
      const task: Task = { id: 1, title: 'Tache de test', done: false, priority: 'haute' };

      beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [TaskItemComponent],
          providers: [provideRouter([])], // nécessaire car la carte contient des liens
        }).compileComponents();

        fixture = TestBed.createComponent(TaskItemComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('task', task); // on donne la tâche à la carte
        fixture.detectChanges();
      });

      it('devrait afficher le titre de la tache', () => {
        // lire fixture.nativeElement.textContent et vérifier qu'il contient task.title
      });

      // À écrire :
      // - cliquer sur la case à cocher émet "toggled" avec l'id 1 (utiliser vi.spyOn(component.toggled, 'emit'))
      // - cliquer sur « Supprimer » émet "removed" avec l'id 1
      // - la carte a la classe "task-card--done" quand la tâche est terminée
    });
    ```

- [ ] **Bonus C : Date limite** (difficile)
  - **Objectif** : pouvoir donner une date limite (facultative) à une tâche, l'afficher, et afficher en rouge les tâches en retard.
  - **Fichiers à modifier** (cherche `TODO Bonus C`) : `task.model.ts` (nouveau champ), `task-form.ts` et `task-form.html` (champ date), `task.ts` (`add()` reçoit la date), `task-list.ts` (transmet la date au service), `task-item.ts`, `task-item.html`, `task-item.css` et `task-detail.html` (affichage), `task-form.spec.ts` (un test à adapter).
  - **Attention** : les tâches déjà enregistrées dans le localStorage n'auront pas de date. Le code doit fonctionner quand la date est absente.

- [ ] **Bonus D : Mettre à jour ce README** (facile)
  - Remplacer les parties 4 et 6 (TODO et missions) par une description de l'application terminée, avec une capture d'écran.

---

## 7. Pour apprendre

- Tutoriel officiel Angular, interactif et en ligne (très bien pour commencer) : https://angular.dev/tutorials/learn-angular
- Documentation Angular : https://angular.dev
- JavaScript, CSS et HTML expliqués en français : https://developer.mozilla.org/fr/

**Attention** : sur Internet, beaucoup d'exemples Angular sont **anciens**. Si tu vois `@NgModule`, `*ngIf`, `*ngFor` ou `@Input()`, c'est l'ancienne façon de faire. Dans ce projet on utilise `@if`, `@for`, `input()` et `signal()`. Dans le doute, demande-moi.
