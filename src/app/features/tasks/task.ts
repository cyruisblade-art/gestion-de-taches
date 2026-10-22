import { Injectable, computed, signal } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([
    { id: 1, title: 'Lire la documentation Angular', done: false, priority: 'haute' },
    { id: 2, title: 'Configurer le projet Git', done: true, priority: 'normale' },
    { id: 3, title: 'Écrire les tests unitaires', done: false, priority: 'haute' },
    { id: 4, title: 'Réviser les composants', done: false, priority: 'basse' },
  ]);

  private _nextId = signal<number>(5);

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
}
