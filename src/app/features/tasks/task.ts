import { Injectable, computed, signal } from '@angular/core';
import { Task, ReminderDelay } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([
    { id: 1, title: 'Lire la documentation Angular', done: false, priority: 'haute' },
    { id: 2, title: 'Configurer le projet Git', done: true, priority: 'normale' },
    { id: 3, title: 'Écrire les tests unitaires', done: false, priority: 'haute', dueDate: '2026-10-28', dueTime: '16:00', reminder: '1h' },
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

  /** Ajoute une nouvelle tâche avec date, heure et rappel facultatifs */
  add(
    title: string,
    priority: Task['priority'],
    dueDate?: string,
    dueTime?: string,
    reminder?: ReminderDelay
  ): void {
    const trimmed = title.trim();
    if (trimmed.length < 3) return;

    const newTask: Task = {
      id: this._nextId(),
      title: trimmed,
      done: false,
      priority,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      reminder: reminder || undefined,
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

  /** Supprime toutes les tâches terminées */
  removeDone(): void {
    this._tasks.update((tasks) => tasks.filter((t) => !t.done));
  }

  /** Modifie le titre, la priorité, la date, l'heure et le rappel d'une tâche */
  update(
    id: number,
    title: string,
    priority: Task['priority'],
    dueDate?: string,
    dueTime?: string,
    reminder?: ReminderDelay
  ): void {
    const trimmed = title.trim();
    if (trimmed.length < 3) return;
    this._tasks.update((tasks) =>
      tasks.map((t) =>
        t.id === id
          ? { ...t, title: trimmed, priority, dueDate, dueTime, reminder }
          : t
      )
    );
  }

  /**
   * Retourne true si la date+heure d'échéance est déjà passée
   * (la tâche est en retard)
   */
  isLate(task: Task): boolean {
    if (!task.dueDate) return false;
    const dateStr = task.dueTime
      ? `${task.dueDate}T${task.dueTime}`
      : task.dueDate;
    return new Date(dateStr) < new Date();
  }

  /**
   * Retourne un libellé lisible de l'échéance
   * Ex. : "demain à 16:00" ou "27 oct. 2026"
   */
  formatDueLabel(task: Task): string {
    if (!task.dueDate) return '';

    const now = new Date();
    const due = new Date(`${task.dueDate}T${task.dueTime ?? '00:00'}`);

    const diffMs = due.getTime() - now.getTime();
    const diffH = diffMs / (1000 * 3600);
    const diffD = diffMs / (1000 * 3600 * 24);

    const timeStr = task.dueTime ? ` à ${task.dueTime}` : '';

    if (diffD < -1) {
      const d = new Date(task.dueDate);
      return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}${timeStr}`;
    }
    if (diffD < 0) return `hier${timeStr}`;
    if (diffH < 24) return `aujourd'hui${timeStr}`;
    if (diffH < 48) return `demain${timeStr}`;

    const d = new Date(task.dueDate);
    return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}${timeStr}`;
  }
}
