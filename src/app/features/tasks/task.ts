import { Injectable, computed, signal } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // TODO Mission 3 : ajoute une 5e tâche à la fin de cette liste, sur le même modèle que les autres :
  //   { id: 5, title: '...', done: false, priority: 'normale' },
  //   N'oublie pas la virgule à la fin de la ligne précédente.
  //
  // TODO Mission 8 : cette liste est écrite « en dur » : elle revient à chaque rechargement de la page.
  //   1. Sors cette liste du service : au-dessus de « @Injectable », crée une constante
  //        const INITIAL_TASKS: Task[] = [ ...les tâches d'exemple... ];
  //   2. Ici, remplace la liste par :  signal<Task[]>(loadTasks() ?? INITIAL_TASKS)
  //      (« ?? » veut dire : si loadTasks() renvoie null, on prend INITIAL_TASKS à la place)
  //   3. Importe loadTasks et saveTasks en haut du fichier :
  //        import { loadTasks, saveTasks } from './task-storage';
  private _tasks = signal<Task[]>([
    { id: 1, title: 'Lire la documentation Angular', done: false, priority: 'haute' },
    { id: 2, title: 'Configurer le projet Git', done: true, priority: 'normale' },
    { id: 3, title: 'Écrire les tests unitaires', done: false, priority: 'haute' },
    { id: 4, title: 'Réviser les composants', done: false, priority: 'basse' },
  ]);

  // TODO Mission 3 : passe cette valeur de 5 à 6, puisque l'id 5 est maintenant utilisé.
  //
  // TODO Mission 8 : avec la sauvegarde, on ne sait plus à l'avance quels id existent.
  //   Calcule le prochain numéro à partir du plus grand id de la liste chargée :
  //     signal<number>(Math.max(0, ...this._tasks().map((t) => t.id)) + 1)
  //   (Math.max(0, ...) renvoie 0 si la liste est vide, donc la première tâche aura l'id 1)
  private _nextId = signal<number>(5);

  // TODO Mission 8 : enregistrer automatiquement la liste à chaque changement.
  //   Ajoute un constructeur avec un effect() (à importer depuis '@angular/core', comme computed et signal) :
  //     constructor() {
  //       effect(() => saveTasks(this._tasks()));
  //     }
  //   Un effect() se relance tout seul chaque fois qu'un signal qu'il lit change (ici this._tasks).

  /** Signal en lecture seule exposant la liste des tâches */
  readonly tasks = this._tasks.asReadonly();

  /** Signal calculé : nombre de tâches non terminées */
  readonly remainingCount = computed(
    () => this._tasks().filter((t) => !t.done).length
  );

  /** Retourne une tâche par son identifiant, ou undefined si introuvable */
  getById(id: number): Task | undefined {
    return this._tasks().find((t) => t.id === id);
  }

  /** Ajoute une nouvelle tâche */
  // TODO Bonus C : ajoute un 3e paramètre facultatif « dueDate?: string »,
  //   et mets-le dans newTask : { ..., priority, dueDate }
  add(title: string, priority: Task['priority']): void {
    const trimmed = title.trim();
    if (trimmed.length < 3) return;

    const newTask: Task = {
      id: this._nextId(),
      title: trimmed,
      done: false,
      priority,
    };

    this._tasks.update((tasks) => [...tasks, newTask]);
    this._nextId.update((id) => id + 1);
  }

  /** Inverse l'état done d'une tâche */
  toggle(id: number): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  /** Supprime une tâche par son identifiant */
  remove(id: number): void {
    this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  // TODO Mission 6 : crée ici la fonction qui supprime toutes les tâches terminées.
  //   /** Supprime toutes les tâches terminées */
  //   removeDone(): void {
  //     ...
  //   }
  //   Elle ressemble beaucoup à remove() juste au-dessus : on garde seulement les tâches
  //   dont « done » est false. La condition du filter devient donc : (t) => !t.done

  // TODO Mission 10 : crée ici la fonction qui modifie le titre et la priorité d'une tâche.
  //   /** Modifie le titre et la priorité d'une tâche */
  //   update(id: number, title: string, priority: Task['priority']): void {
  //     ...
  //   }
  //   1. Comme dans add() : enlève les espaces avec trim() et ne fais rien si le titre fait moins de 3 caractères.
  //   2. Comme dans toggle() : utilise tasks.map(...) pour remplacer seulement la tâche qui a le bon id,
  //      avec { ...t, title: trimmed, priority }.
}
