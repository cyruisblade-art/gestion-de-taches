import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../task';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  task = signal<Task | null | undefined>(undefined);

  readonly priorityLabel: Record<Task['priority'], string> = {
    basse: 'Basse',
    normale: 'Normale',
    haute: 'Haute',
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      this.task.set(null);
      return;
    }

    const found = this.taskService.getById(id);
    this.task.set(found ?? null);
  }
}
