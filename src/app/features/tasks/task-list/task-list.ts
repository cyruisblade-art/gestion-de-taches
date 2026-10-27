import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task';
import { TaskFormComponent } from '../task-form/task-form';
import { TaskItemComponent } from '../task-item/task-item';
import { Task } from '../task.model';


import {
  LucideCalendar,
  LucideCheckSquare,
  LucideColumns,
  LucideList,
  LucideTable,
  LucideTag,
} from '@lucide/angular';

export type FilterType = 'toutes' | 'actives' | 'terminées';
export type ViewMode = 'liste' | 'kanban' | 'calendrier' | 'tableau';

export interface CalendarDay {
  date: Date;
  dateString: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskFormComponent,
    TaskItemComponent,
    TitleCasePipe,
    RouterLink,
    FormsModule,
    LucideTag,
    LucideList,
    LucideColumns,
    LucideCalendar,
    LucideTable,
    LucideCheckSquare,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  readonly tasks = this.taskService.tasks;
  readonly remainingCount = this.taskService.remainingCount;

  // --- Filtres d'état et tags ---
  activeFilter = signal<FilterType>('toutes');
  readonly filters: FilterType[] = ['toutes', 'actives', 'terminées'];

  activeTagFilter = signal<string | null>(null);
  readonly allAvailableTags = this.taskService.allAvailableTags;

  // --- Mode de vue (Notion style) ---
  activeView = signal<ViewMode>('liste');
  readonly views: { mode: ViewMode; label: string }[] = [
    { mode: 'liste', label: 'Liste' },
    { mode: 'kanban', label: 'Kanban' },
    { mode: 'calendrier', label: 'Calendrier' },
    { mode: 'tableau', label: 'Tableau' },
  ];

  setView(mode: ViewMode): void {
    this.activeView.set(mode);
  }

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

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }

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
    tags?: string[];
  }): void {
    if (data.tags && data.tags.length > 0) {
      this.taskService.add(data.title, data.priority, data.dueDate, data.dueTime, data.tags);
    } else if (data.dueDate || data.dueTime) {
      this.taskService.add(data.title, data.priority, data.dueDate, data.dueTime);
    } else {
      this.taskService.add(data.title, data.priority);
    }
  }

  onToggled(id: number): void {
    this.taskService.toggle(id);
  }

  onRemoved(id: number): void {
    this.taskService.remove(id);
  }

  // --- Gestion du Kanban ---
  readonly kanbanColumns: { id: 'todo' | 'in_progress' | 'done'; label: string }[] = [
    { id: 'todo', label: 'À faire' },
    { id: 'in_progress', label: 'En cours' },
    { id: 'done', label: 'Terminé' },
  ];

  getKanbanTasks(status: 'todo' | 'in_progress' | 'done'): Task[] {
    return this.filteredTasks().filter((t) => {
      const s = t.status || (t.done ? 'done' : 'todo');
      return s === status;
    });
  }

  onStatusChange(taskId: number, status: 'todo' | 'in_progress' | 'done'): void {
    this.taskService.updateStatus(taskId, status);
  }

  draggedTaskId = signal<number | null>(null);

  onDragStart(taskId: number): void {
    this.draggedTaskId.set(taskId);
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
  }

  onDrop(status: 'todo' | 'in_progress' | 'done'): void {
    const id = this.draggedTaskId();
    if (id !== null) {
      this.taskService.updateStatus(id, status);
      this.draggedTaskId.set(null);
    }
  }

  // --- Gestion du Calendrier ---
  currentCalendarDate = signal<Date>(new Date());
  readonly weekDays: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  calendarMonthLabel = computed(() => {
    const date = this.currentCalendarDate();
    const formatted = date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  });

  prevMonth(): void {
    const cur = this.currentCalendarDate();
    this.currentCalendarDate.set(new Date(cur.getFullYear(), cur.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const cur = this.currentCalendarDate();
    this.currentCalendarDate.set(new Date(cur.getFullYear(), cur.getMonth() + 1, 1));
  }

  todayMonth(): void {
    this.currentCalendarDate.set(new Date());
  }

  calendarGrid = computed<CalendarDay[]>(() => {
    const cur = this.currentCalendarDate();
    const year = cur.getFullYear();
    const month = cur.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const startOffset = (firstDayIndex + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const allTasks = this.filteredTasks();

    // Jours du mois précédent
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const date = new Date(year, month - 1, d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      days.push({
        date,
        dateString: dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        tasks: allTasks.filter((t) => t.dueDate === dateStr),
      });
    }

    // Jours du mois en cours
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      days.push({
        date,
        dateString: dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        tasks: allTasks.filter((t) => t.dueDate === dateStr),
      });
    }

    // Jours du mois suivant pour compléter la grille
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      days.push({
        date,
        dateString: dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        tasks: allTasks.filter((t) => t.dueDate === dateStr),
      });
    }

    return days;
  });

  subTasksProgress(task: Task) {
    return this.taskService.getSubTasksProgress(task);
  }
}
