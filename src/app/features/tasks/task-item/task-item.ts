import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItemComponent {
  task = input.required<Task>();

  toggled = output<number>();
  removed = output<number>();

  onToggle(): void {
    this.toggled.emit(this.task().id);
  }

  onRemove(): void {
    this.removed.emit(this.task().id);
  }

  /**
   * Retourne true si l'échéance est dépassée et que la tâche n'est pas encore terminée
   */
  isLate(): boolean {
    const t = this.task();
    if (t.done || !t.dueDate) return false;
    const dueStr = t.dueTime ? `${t.dueDate}T${t.dueTime}` : `${t.dueDate}T23:59:59`;
    return new Date(dueStr) < new Date();
  }

  /**
   * Retourne le libellé formaté de l'échéance (ex. "Demain à 16:00", "Aujourd'hui à 14:00")
   */
  formattedDue(): string {
    const t = this.task();
    if (!t.dueDate) return '';

    const parts = t.dueDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const dueDateObj = new Date(year, month, day);

      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffDays = Math.round((dueDateObj.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

      let dayLabel = '';
      if (diffDays === 0) dayLabel = "Aujourd'hui";
      else if (diffDays === 1) dayLabel = 'Demain';
      else if (diffDays === -1) dayLabel = 'Hier';
      else {
        dayLabel = dueDateObj.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
        });
      }

      if (t.dueTime) {
        return `${dayLabel} à ${t.dueTime}`;
      }
      return dayLabel;
    }
    return t.dueTime ? `${t.dueDate} à ${t.dueTime}` : t.dueDate;
  }

  /**
   * Retourne le libellé lisible du rappel
   */
  reminderLabel(): string {
    const r = this.task().reminder;
    if (!r) return '';
    const map: Record<string, string> = {
      '5min': 'Rappel 5 min',
      '15min': 'Rappel 15 min',
      '30min': 'Rappel 30 min',
      '1h': 'Rappel 1 h',
      '1day': 'Rappel 1 j',
    };
    return map[r] ?? r;
  }

  /**
   * Retourne la progression des sous-tâches
   */
  subTasksProgress(): { total: number; done: number; percentage: number } {
    const subTasks = this.task().subTasks || [];
    const total = subTasks.length;
    if (total === 0) return { total: 0, done: 0, percentage: 0 };
    const done = subTasks.filter((s) => s.done).length;
    return {
      total,
      done,
      percentage: Math.round((done / total) * 100),
    };
  }
}
