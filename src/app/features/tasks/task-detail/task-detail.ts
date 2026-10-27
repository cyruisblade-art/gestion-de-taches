import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../task';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  // TODO Mission 10 : ajoute TaskEditComponent dans cette liste (et son import en haut du fichier :
  //   import { TaskEditComponent } from '../task-edit/task-edit';)
  //   Sans ça, la balise <app-task-edit> ne sera pas reconnue dans task-detail.html.
  imports: [RouterLink],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  // TODO Mission 9 : remplacer la « copie » de la tâche par un calcul automatique.
  //   Le problème : ngOnInit() (plus bas) cherche la tâche UNE seule fois et la copie dans ce signal.
  //   Si on coche la tâche ensuite, la copie ne change pas et l'écran ne se met pas à jour.
  //
  //   Étape 1 : lis l'id dans l'adresse (une seule fois suffit, il ne change pas) :
  //     private taskId = Number(this.route.snapshot.paramMap.get('id'));
  //     (Number('abc') donne NaN, Number('2') donne 2)
  //
  //   Étape 2 : remplace la ligne « task = signal... » ci-dessous par un computed :
  //     task = computed<Task | null>(() => {
  //       if (isNaN(this.taskId)) return null;
  //       return this.taskService.getById(this.taskId) ?? null;
  //     });
  //     Comme getById() lit la liste du service (un signal), ce computed se recalcule tout seul.
  //
  //   Étape 3 : supprime toute la fonction ngOnInit(), « implements OnInit » dans la ligne de la classe,
  //     et OnInit / signal dans l'import tout en haut (s'ils ne servent plus).
  //
  //   Étape 4 : dans task-detail.html, supprime le bloc « Chargement… » (task() ne vaut plus jamais undefined).
  //
  //   Lance npm test : les tests existants de task-detail.spec.ts doivent toujours passer.
  task = signal<Task | null | undefined>(undefined);

  // TODO Mission 10 : crée ici le signal qui dit si le formulaire de modification est ouvert :
  //   editing = signal(false);

  readonly priorityLabel: Record<Task['priority'], string> = {
    basse: 'Basse',
    normale: 'Normale',
    haute: 'Haute',
  };

  /**
   * Retourne le libellé formaté de l'échéance
   */
  formattedDueDate(): string {
    const t = this.task();
    if (!t?.dueDate) return 'Aucune';
    const parts = t.dueDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      const dateFormatted = d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return t.dueTime ? `${dateFormatted} à ${t.dueTime}` : dateFormatted;
    }
    return t.dueTime ? `${t.dueDate} à ${t.dueTime}` : t.dueDate;
  }

  /**
   * Retourne true si l'échéance est passée
   */
  isLate(): boolean {
    const t = this.task();
    if (!t || t.done || !t.dueDate) return false;
    const dueStr = t.dueTime ? `${t.dueDate}T${t.dueTime}` : `${t.dueDate}T23:59:59`;
    return new Date(dueStr) < new Date();
  }

  /**
   * Libellé lisible du rappel
   */
  reminderLabel(): string {
    const t = this.task();
    if (!t?.reminder) return 'Aucun';
    const map: Record<string, string> = {
      '5min': '5 minutes avant',
      '15min': '15 minutes avant',
      '30min': '30 minutes avant',
      '1h': '1 heure avant',
      '1day': '1 jour avant',
    };
    return map[t.reminder] ?? t.reminder;
  }

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

  // TODO Mission 9 : crée ici les deux fonctions appelées par les nouveaux boutons.
  //
  //   onToggle(): void {
  //     // appelle this.taskService.toggle(...) avec l'id de la tâche affichée : this.task()!.id
  //   }
  //
  //   onRemove(): void {
  //     // 1. demande confirmation avec window.confirm(...) (comme en mission 4)
  //     // 2. si OK : appelle this.taskService.remove(...)
  //     // 3. puis reviens à la liste : this.router.navigate(['/tasks']);
  //   }
  //
  //   Pour this.router : importe Router depuis '@angular/router' (à côté de ActivatedRoute)
  //   et ajoute en haut de la classe :  private router = inject(Router);

  // TODO Mission 10 : crée ici la fonction appelée quand on clique sur « Enregistrer » dans <app-task-edit> :
  //   onSaved(data: { title: string; priority: Task['priority'] }): void {
  //     this.taskService.update(this.task()!.id, data.title, data.priority);
  //     this.editing.set(false); // referme le formulaire
  //   }
}
