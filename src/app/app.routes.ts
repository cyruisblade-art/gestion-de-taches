import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/task-list/task-list').then(
        (m) => m.TaskListComponent
      ),
    title: 'Liste des tâches — Gestion de tâches',
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('./features/tasks/task-detail/task-detail').then(
        (m) => m.TaskDetailComponent
      ),
    title: 'Détail de la tâche — Gestion de tâches',
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
