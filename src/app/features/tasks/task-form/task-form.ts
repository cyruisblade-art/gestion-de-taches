import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Task, ReminderDelay } from '../task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskFormComponent {
  created = output<{
    title: string;
    priority: Task['priority'];
    dueDate?: string;
    dueTime?: string;
    reminder?: ReminderDelay;
  }>();

  title    = signal('');
  priority = signal<Task['priority']>('normale');
  dueDate  = signal('');
  dueTime  = signal('');
  reminder = signal<ReminderDelay | ''>('');

  errorMessage = signal('');
  submitted    = signal(false);

  readonly priorities: Task['priority'][] = ['basse', 'normale', 'haute'];

  readonly reminderOptions: { value: ReminderDelay; label: string }[] = [
    { value: '5min',  label: '5 minutes avant' },
    { value: '15min', label: '15 minutes avant' },
    { value: '30min', label: '30 minutes avant' },
    { value: '1h',    label: '1 heure avant' },
    { value: '1day',  label: '1 jour avant' },
  ];

  onSubmit(): void {
    this.submitted.set(true);
    const trimmed = this.title().trim();

    if (!trimmed) {
      this.errorMessage.set('Le titre est obligatoire.');
      return;
    }
    if (trimmed.length < 3) {
      this.errorMessage.set('Le titre doit contenir au moins 3 caractères.');
      return;
    }

    const payload: {
      title: string;
      priority: Task['priority'];
      dueDate?: string;
      dueTime?: string;
      reminder?: ReminderDelay;
    } = {
      title: trimmed,
      priority: this.priority(),
    };
    if (this.dueDate()) payload.dueDate = this.dueDate();
    if (this.dueTime()) payload.dueTime = this.dueTime();
    if (this.reminder()) payload.reminder = this.reminder() as ReminderDelay;

    this.created.emit(payload);
    this.reset();
  }

  private reset(): void {
    this.title.set('');
    this.priority.set('normale');
    this.dueDate.set('');
    this.dueTime.set('');
    this.reminder.set('');
    this.errorMessage.set('');
    this.submitted.set(false);
  }

  onTitleChange(value: string): void {
    this.title.set(value);
    if (this.submitted()) {
      const trimmed = value.trim();
      if (!trimmed) {
        this.errorMessage.set('Le titre est obligatoire.');
      } else if (trimmed.length < 3) {
        this.errorMessage.set('Le titre doit contenir au moins 3 caractères.');
      } else {
        this.errorMessage.set('');
      }
    }
  }
}
