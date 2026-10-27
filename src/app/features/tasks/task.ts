import { Injectable, computed, signal } from '@angular/core';
import { Task, SubTask, TaskLink } from './task.model';


@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Créer le site vitrine',
      done: false,
      priority: 'haute',
      dueDate: '2026-10-30',
      dueTime: '18:00',

      description: `### Objectifs principaux\n- Mettre en place l'architecture Angular moderne\n- Assurer un design accessible et responsive\n\n**Ressources utiles :**\n- [Guide Angular](https://angular.dev)\n- [Design Tokens](https://m3.material.io)`,
      notes: 'Valider le choix des polices et des icônes SVG avec le client.',
      subTasks: [
        { id: 'st-1', title: 'Maquette UI / UX', done: true },
        { id: 'st-2', title: 'Développement des composants', done: false },
        { id: 'st-3', title: 'Tests unitaires et E2E', done: false },
        { id: 'st-4', title: 'Déploiement en production', done: false },
      ],
      links: [
        { id: 'lnk-1', url: 'https://angular.dev', label: 'Documentation officielle Angular' },
        { id: 'lnk-2', url: 'https://github.com', label: 'Dépôt GitHub du projet' },
      ],
      tags: ['Angular', 'Travail'],
      status: 'in_progress',
    },
    {
      id: 2,
      title: 'Configurer le projet Git',
      done: true,
      priority: 'normale',
      description: 'Initialiser le dépôt git, configurer les branches principales et les workflows GitHub Actions.',
      subTasks: [
        { id: 'st-5', title: 'Initialiser git init', done: true },
        { id: 'st-6', title: 'Créer le README et le .gitignore', done: true },
      ],
      tags: ['Personnel'],
      status: 'done',
    },
    {
      id: 3,
      title: 'Écrire les tests unitaires',
      done: false,
      priority: 'haute',
      dueDate: '2026-10-28',
      dueTime: '16:00',

      description: 'Tester les services, formulaires, et la décomposition en sous-tâches avec Vitest.',
      subTasks: [
        { id: 'st-7', title: 'Tests unitaires de TaskService', done: true },
        { id: 'st-8', title: 'Tests unitaires de TaskItemComponent', done: true },
        { id: 'st-9', title: 'Tests des sous-tâches et progression', done: false },
      ],
      tags: ['Angular', 'Urgent'],
      status: 'todo',
    },
    {
      id: 4,
      title: 'Réviser les composants',
      done: false,
      priority: 'basse',
      description: 'Revue de code générale et optimisation des performances de rendu.',
      tags: ['Études'],
      status: 'todo',
    },
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

  /** Liste des tags disponibles par défaut */
  readonly defaultTags: string[] = ['Angular', 'Travail', 'Études', 'Personnel', 'Urgent'];

  /** Signal calculé : liste de tous les tags existants (par défaut + créés par l'utilisateur) */
  readonly allAvailableTags = computed(() => {
    const fromTasks = this._tasks().flatMap((t) => t.tags || []);
    return Array.from(new Set([...this.defaultTags, ...fromTasks]));
  });

  add(
    title: string,
    priority: Task['priority'],
    dueDate?: string,
    dueTime?: string,
    tags?: string[]
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

      subTasks: [],
      links: [],
      tags: tags && tags.length > 0 ? [...tags] : [],
      status: 'todo',
    };

    this._tasks.update((tasks) => [...tasks, newTask]);
    this._nextId.update((id) => id + 1);
  }

  /** Ajoute un tag à une tâche */
  addTag(taskId: number, tag: string): void {
    const trimmed = tag.trim();
    if (!trimmed) return;
    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const currentTags = t.tags || [];
        if (currentTags.includes(trimmed)) return t;
        return { ...t, tags: [...currentTags, trimmed] };
      })
    );
  }

  /** Supprime un tag d'une tâche */
  removeTag(taskId: number, tag: string): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const currentTags = t.tags || [];
        return { ...t, tags: currentTags.filter((tg) => tg !== tag) };
      })
    );
  }

  /** Inverse l'état done d'une tâche et synchronise son statut Kanban */
  toggle(id: number): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== id) return t;
        const newDone = !t.done;
        return {
          ...t,
          done: newDone,
          status: newDone ? 'done' : 'todo',
        };
      })
    );
  }

  /** Modifie le statut Kanban d'une tâche */
  updateStatus(id: number, status: 'todo' | 'in_progress' | 'done'): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          status,
          done: status === 'done',
        };
      })
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

  /** Modifie les champs d'une tâche (titre, priorité, date, heure) */
  update(
    id: number,
    title: string,
    priority: Task['priority'],
    dueDate?: string,
    dueTime?: string
  ): void {
    const trimmed = title.trim();
    if (trimmed.length < 3) return;
    this._tasks.update((tasks) =>
      tasks.map((t) =>
        t.id === id
          ? { ...t, title: trimmed, priority, dueDate, dueTime }
          : t
      )
    );
  }

  /** Mise à jour générique et partielle des champs d'une tâche */
  updateTaskFields(id: number, fields: Partial<Omit<Task, 'id'>>): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...fields };
        if (fields.title) {
          const trimmed = fields.title.trim();
          if (trimmed.length >= 3) {
            updated.title = trimmed;
          }
        }
        return updated;
      })
    );
  }

  // --- Gestion des sous-tâches ---

  /** Ajoute une sous-tâche à une tâche */
  addSubTask(taskId: number, title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newSubTask: SubTask = {
      id: `st-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: trimmed,
      done: false,
    };

    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const currentSubTasks = t.subTasks || [];
        return { ...t, subTasks: [...currentSubTasks, newSubTask] };
      })
    );
  }

  /** Inverse l'état done d'une sous-tâche */
  toggleSubTask(taskId: number, subTaskId: string): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const subTasks = (t.subTasks || []).map((st) =>
          st.id === subTaskId ? { ...st, done: !st.done } : st
        );
        return { ...t, subTasks };
      })
    );
  }

  /** Supprime une sous-tâche */
  removeSubTask(taskId: number, subTaskId: string): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const subTasks = (t.subTasks || []).filter((st) => st.id !== subTaskId);
        return { ...t, subTasks };
      })
    );
  }

  /** Calcule la progression des sous-tâches (total, complétées, pourcentage) */
  getSubTasksProgress(task: Task): { total: number; done: number; percentage: number } {
    const subTasks = task.subTasks || [];
    const total = subTasks.length;
    if (total === 0) return { total: 0, done: 0, percentage: 0 };
    const done = subTasks.filter((st) => st.done).length;
    const percentage = Math.round((done / total) * 100);
    return { total, done, percentage };
  }

  // --- Gestion des liens ---

  /** Ajoute un lien web à la tâche */
  addLink(taskId: number, url: string, label?: string): void {
    let trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    const newLink: TaskLink = {
      id: `lnk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      url: trimmedUrl,
      label: label?.trim() || trimmedUrl,
    };

    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const currentLinks = t.links || [];
        return { ...t, links: [...currentLinks, newLink] };
      })
    );
  }

  /** Supprime un lien associé */
  removeLink(taskId: number, linkId: string): void {
    this._tasks.update((tasks) =>
      tasks.map((t) => {
        if (t.id !== taskId) return t;
        const links = (t.links || []).filter((l) => l.id !== linkId);
        return { ...t, links };
      })
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
      : `${task.dueDate}T23:59:59`;
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
