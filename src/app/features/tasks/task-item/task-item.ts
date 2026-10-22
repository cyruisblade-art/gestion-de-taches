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
}
