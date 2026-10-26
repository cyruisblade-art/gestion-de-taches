import { Component, computed, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TaskService } from '../task';
import { TaskFormComponent } from '../task-form/task-form';
import { TaskItemComponent } from '../task-item/task-item';
import { Task } from '../task.model';

type FilterType = 'toutes' | 'actives' | 'terminées';

// TODO Bonus A : crée ici le type des choix de tri, sur le modèle de FilterType :
//   type SortType = 'ajout' | 'priorite';

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

  // TODO Mission 7 : crée ici le signal qui contient le texte tapé dans le champ de recherche :
  //   search = signal('');

  // TODO Bonus A : crée ici le signal du tri choisi :
  //   sortBy = signal<SortType>('ajout');

  readonly filteredTasks = computed<Task[]>(() => {
    const filter = this.activeFilter();
    const all = this.tasks();
    if (filter === 'actives') return all.filter((t) => !t.done);
    if (filter === 'terminées') return all.filter((t) => t.done);
    return all;
    // TODO Mission 7 : pour l'instant, chaque « if » renvoie directement son résultat (return).
    //   Il faut d'abord filtrer, PUIS appliquer la recherche. Réorganise comme ceci :
    //     1. let result = all;
    //     2. if (filter === 'actives') result = all.filter((t) => !t.done);   (pareil pour 'terminées')
    //     3. const text = this.search().trim().toLowerCase();
    //     4. if (text) result = result.filter((t) => t.title.toLowerCase().includes(text));
    //     5. return result;
    //
    // TODO Bonus A : avant le « return result; », si this.sortBy() vaut 'priorite', trie une copie :
    //     const order = { haute: 0, normale: 1, basse: 2 };
    //     result = [...result].sort((a, b) => order[a.priority] - order[b.priority]);
  });

  readonly totalCount = computed(() => this.tasks().length);

  // TODO Mission 6 : crée ici le nombre de tâches terminées, sur le modèle de totalCount juste au-dessus :
  //   readonly doneCount = computed(() => this.tasks().filter((t) => t.done).length);
  //   Il sert à n'afficher le bouton « Supprimer les tâches terminées » que s'il y en a au moins une.

  onCreated(data: { title: string; priority: Task['priority'] }): void {
    this.taskService.add(data.title, data.priority);
  }

  onToggled(id: number): void {
    this.taskService.toggle(id);
  }

  onRemoved(id: number): void {
    // TODO Mission 4 : avant de supprimer, demande confirmation à l'utilisateur.
    //   Entoure la ligne ci-dessous avec :
    //     if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
    //       ...la ligne de suppression...
    //     }
    //   Attention : le test « onRemoved doit appeler taskService.remove » de task-list.spec.ts
    //   va échouer, car dans un test personne ne peut cliquer sur OK. Ajoute au début de ce test :
    //     vi.spyOn(window, 'confirm').mockReturnValue(true);
    //   (ça veut dire : « fais comme si l'utilisateur avait cliqué sur OK »)
    this.taskService.remove(id);
  }

  // TODO Mission 6 : crée ici la fonction appelée par le bouton « Supprimer les tâches terminées » :
  //   onRemoveDone(): void {
  //     if (window.confirm('Supprimer toutes les tâches terminées ?')) {
  //       this.taskService.removeDone();
  //     }
  //   }

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }
}
