import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TaskService } from '../task';
import { TaskFormComponent } from '../task-form/task-form';
import { TaskItemComponent } from '../task-item/task-item';
import { Task } from '../task.model';

type FilterType = 'toutes' | 'actives' | 'terminées';

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

  readonly filteredTasks = computed<Task[]>(() => {
    const filter = this.activeFilter();
    const all = this.tasks();
    if (filter === 'actives') return all.filter((t) => !t.done);
    if (filter === 'terminées') return all.filter((t) => t.done);
    return all;
  });

  readonly totalCount = computed(() => this.tasks().length);

  onCreated(data: { title: string; priority: Task['priority'] }): void {
    this.taskService.add(data.title, data.priority);
  }

  onToggled(id: number): void {
    this.taskService.toggle(id);
  }

  onRemoved(id: number): void {
    this.taskService.remove(id);
  }

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }
}
