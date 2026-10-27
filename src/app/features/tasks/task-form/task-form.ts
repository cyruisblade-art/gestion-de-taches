import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Task } from '../task.model';


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
    tags?: string[];
  }>();

  title    = signal('');
  priority = signal<Task['priority']>('normale');
  dueDate  = signal('');
  dueTime  = signal('');


  selectedTags = signal<string[]>([]);
  customTagInput = signal('');

  errorMessage = signal('');
  submitted    = signal(false);

  readonly priorities: Task['priority'][] = ['basse', 'normale', 'haute'];

  readonly defaultTags: string[] = ['Angular', 'Travail', 'Études', 'Personnel', 'Urgent'];


  toggleTag(tag: string): void {
    const current = this.selectedTags();
    if (current.includes(tag)) {
      this.selectedTags.set(current.filter((t) => t !== tag));
    } else {
      this.selectedTags.set([...current, tag]);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  addCustomTag(): void {
    const trimmed = this.customTagInput().trim();
    if (!trimmed) return;
    if (!this.selectedTags().includes(trimmed)) {
      this.selectedTags.set([...this.selectedTags(), trimmed]);
    }
    this.customTagInput.set('');
  }

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
      tags?: string[];
    } = {
      title: trimmed,
      priority: this.priority(),
    };
    if (this.dueDate()) payload.dueDate = this.dueDate();
    if (this.dueTime()) payload.dueTime = this.dueTime();
    if (this.selectedTags().length > 0) payload.tags = this.selectedTags();


    this.created.emit(payload);
    this.reset();
  }

  private reset(): void {
    this.title.set('');
    this.priority.set('normale');
    this.dueDate.set('');
    this.dueTime.set('');
    this.selectedTags.set([]);
    this.customTagInput.set('');
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
