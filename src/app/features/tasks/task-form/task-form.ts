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
  created = output<{ title: string; priority: Task['priority'] }>();

  title = signal('');
  priority = signal<Task['priority']>('normale');
  // TODO Bonus C : ajoute un signal pour la date limite :  dueDate = signal('');
  //   Puis :
  //   - ajoute dueDate dans le type de « created » ci-dessus : { title, priority, dueDate?: string }
  //   - dans onSubmit(), envoie-la :  dueDate: this.dueDate() || undefined  (|| undefined : pas de date si le champ est vide)
  //   - dans reset(), vide-la :  this.dueDate.set('');
  //   - dans task-list.ts, onCreated() doit la passer à taskService.add(...)
  //   Attention : le test « devrait emettre created avec un titre valide » de task-form.spec.ts
  //   devra être adapté, car l'objet envoyé contiendra un champ de plus.
  errorMessage = signal('');
  submitted = signal(false);

  readonly priorities: Task['priority'][] = ['basse', 'normale', 'haute'];

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

    this.created.emit({ title: trimmed, priority: this.priority() });
    this.reset();
  }

  private reset(): void {
    this.title.set('');
    this.priority.set('normale');
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
