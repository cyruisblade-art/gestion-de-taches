import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TaskService } from '../task';
import { TaskFormComponent } from '../task-form/task-form';
import { TaskItemComponent } from '../task-item/task-item';
import { Task, ReminderDelay } from '../task.model';

type FilterType = 'toutes' | 'actives' | 'terminées';

// TODO Bonus A : crée ici le type des choix de tri, sur le modèle de FilterType :
//   type SortType = 'ajout' | 'priorite';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskFormComponent, TaskItemComponent, TitleCasePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  readonly tasks = this.taskService.tasks;
  readonly remainingCount = this.taskService.remainingCount;

  activeFilter = signal<FilterType>('toutes');
  readonly filters: FilterType[] = ['toutes', 'actives', 'terminées'];

  /** Filtre actif par étiquette/tag */
  activeTagFilter = signal<string | null>(null);

  /** Liste dynamique des tags disponibles */
  readonly allAvailableTags = this.taskService.allAvailableTags;

  readonly filteredTasks = computed<Task[]>(() => {
    const filter = this.activeFilter();
    let result = this.tasks();
    if (filter === 'actives') result = result.filter((t) => !t.done);
    else if (filter === 'terminées') result = result.filter((t) => t.done);

    const tag = this.activeTagFilter();
    if (tag) {
      result = result.filter((t) => t.tags && t.tags.includes(tag));
    }
    return result;
  });

  setTagFilter(tag: string | null): void {
    if (this.activeTagFilter() === tag) {
      this.activeTagFilter.set(null);
    } else {
      this.activeTagFilter.set(tag);
    }
  }

  readonly totalCount = computed(() => this.tasks().length);

  onCreated(data: {
    title: string;
    priority: Task['priority'];
    dueDate?: string;
    dueTime?: string;
    reminder?: ReminderDelay;
    tags?: string[];
  }): void {
    if (data.tags && data.tags.length > 0) {
      this.taskService.add(data.title, data.priority, data.dueDate, data.dueTime, data.reminder, data.tags);
    } else if (data.dueDate || data.dueTime || data.reminder) {
      this.taskService.add(data.title, data.priority, data.dueDate, data.dueTime, data.reminder);
    } else {
      this.taskService.add(data.title, data.priority);
    }
  }

  onToggled(id: number): void {
    this.taskService.toggle(id);
  }

  onRemoved(id: number): void {
    // TODO Mission 4 : avant de supprimer, demande confirmation à l'utilisateur.
    //   Entoure la ligne ci-dessous avec :
    //     if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
    //       ...la ligne de suppression...
    //     }
    //   Attention : le test « onRemoved doit appeler taskService.remove » de task-list.spec.ts
    //   va échouer, car dans un test personne ne peut cliquer sur OK. Ajoute au début de ce test :
    //     vi.spyOn(window, 'confirm').mockReturnValue(true);
    //   (ça veut dire : « fais comme si l'utilisateur avait cliqué sur OK »)
    this.taskService.remove(id);
  }

  // TODO Mission 6 : crée ici la fonction appelée par le bouton « Supprimer les tâches terminées » :
  //   onRemoveDone(): void {
  //     if (window.confirm('Supprimer toutes les tâches terminées ?')) {
  //       this.taskService.removeDone();
  //     }
  //   }

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }
}
