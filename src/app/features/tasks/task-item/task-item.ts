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
// TODO Bonus B : ce composant n'a pas de tests. Crée le fichier task-item.spec.ts dans ce même dossier
//   (le README, partie 6, Bonus B, donne le contenu de départ à copier).
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
}
