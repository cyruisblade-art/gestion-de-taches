import { TestBed } from '@angular/core/testing';
import { TaskService } from './task';
import { Task } from './task.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    // TODO Mission 8 : ajoute ici  localStorage.clear();
    //   Sans ça, ce qu'un test enregistre dans le localStorage est relu par le test suivant,
    //   et les tests ne partent plus tous des mêmes tâches de départ.
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  // -------------------------------------------------------
  // Etat initial
  // -------------------------------------------------------
  describe('etat initial', () => {
    it('devrait etre cree', () => {
      expect(service).toBeTruthy();
    });

    it('devrait avoir des taches initiales', () => {
      expect(service.tasks().length).toBeGreaterThan(0);
    });

    it('devrait calculer le nombre de taches restantes', () => {
      const remaining = service.tasks().filter((t: Task) => !t.done).length;
      expect(service.remainingCount()).toBe(remaining);
    });
  });

  // -------------------------------------------------------
  // Ajout d'une tache
  // -------------------------------------------------------
  describe('add()', () => {
    it('devrait ajouter une tache valide', () => {
      const initialCount = service.tasks().length;
      service.add('Nouvelle tache', 'normale');
      expect(service.tasks().length).toBe(initialCount + 1);
    });

    it('la tache ajoutee doit avoir done a false', () => {
      service.add('Tache test', 'haute');
      const added = service.tasks()[service.tasks().length - 1];
      expect(added.done).toBe(false);
    });

    it('la tache ajoutee doit avoir le bon titre et la bonne priorite', () => {
      service.add('  Titre avec espaces  ', 'basse');
      const added = service.tasks()[service.tasks().length - 1];
      expect(added.title).toBe('Titre avec espaces');
      expect(added.priority).toBe('basse');
    });

    it('ne doit pas ajouter une tache avec un titre vide', () => {
      const initialCount = service.tasks().length;
      service.add('', 'normale');
      expect(service.tasks().length).toBe(initialCount);
    });

    it('ne doit pas ajouter une tache avec un titre trop court (< 3 chars)', () => {
      const initialCount = service.tasks().length;
      service.add('ab', 'normale');
      expect(service.tasks().length).toBe(initialCount);
    });

    it('doit garantir l unicite des identifiants', () => {
      service.add('Tache A', 'normale');
      service.add('Tache B', 'haute');
      const ids = service.tasks().map((t: Task) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('devrait ajouter une tache avec date limite, heure et rappel', () => {
      service.add('Finir les tests unitaires', 'haute', '2026-10-28', '16:00', '1h');
      const added = service.tasks()[service.tasks().length - 1];
      expect(added.dueDate).toBe('2026-10-28');
      expect(added.dueTime).toBe('16:00');
      expect(added.reminder).toBe('1h');
    });

    it('devrait detecter si une tache est en retard avec isLate()', () => {
      const pastTask: Task = { id: 99, title: 'Tache passee', done: false, priority: 'normale', dueDate: '2020-01-01', dueTime: '10:00' };
      const futureTask: Task = { id: 100, title: 'Tache future', done: false, priority: 'normale', dueDate: '2099-01-01', dueTime: '10:00' };
      expect(service.isLate(pastTask)).toBe(true);
      expect(service.isLate(futureTask)).toBe(false);
    });
  });

  // -------------------------------------------------------
  // Recherche par identifiant
  // -------------------------------------------------------
  describe('getById()', () => {
    it('devrait retourner la tache correspondant a l identifiant', () => {
      const first = service.tasks()[0];
      const found = service.getById(first.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(first.id);
    });

    it('devrait retourner undefined pour un identifiant inexistant', () => {
      const result = service.getById(99999);
      expect(result).toBeUndefined();
    });

    it('devrait retourner undefined pour un identifiant negatif', () => {
      const result = service.getById(-1);
      expect(result).toBeUndefined();
    });
  });

  // -------------------------------------------------------
  // Changement d'etat
  // -------------------------------------------------------
  describe('toggle()', () => {
    it('devrait marquer une tache active comme terminee', () => {
      const active = service.tasks().find((t: Task) => !t.done);
      expect(active).toBeDefined();
      service.toggle(active!.id);
      const updated = service.getById(active!.id);
      expect(updated?.done).toBe(true);
    });

    it('devrait marquer une tache terminee comme active', () => {
      const done = service.tasks().find((t: Task) => t.done);
      expect(done).toBeDefined();
      service.toggle(done!.id);
      const updated = service.getById(done!.id);
      expect(updated?.done).toBe(false);
    });

    it('ne devrait pas modifier les autres taches', () => {
      const tasks = service.tasks();
      const first = tasks[0];
      const second = tasks[1];
      const secondDoneBefore = second.done;
      service.toggle(first.id);
      expect(service.getById(second.id)?.done).toBe(secondDoneBefore);
    });

    it('ne devrait rien faire pour un identifiant inconnu', () => {
      const before = service.tasks().length;
      service.toggle(99999);
      expect(service.tasks().length).toBe(before);
    });
  });

  // -------------------------------------------------------
  // Suppression
  // -------------------------------------------------------
  describe('remove()', () => {
    it('devrait supprimer la tache correspondante', () => {
      const initial = service.tasks();
      const target = initial[0];
      const initialCount = initial.length;
      service.remove(target.id);
      expect(service.tasks().length).toBe(initialCount - 1);
      expect(service.getById(target.id)).toBeUndefined();
    });

    it('ne devrait pas supprimer les autres taches', () => {
      const tasks = service.tasks();
      const toRemove = tasks[0];
      const toKeep = tasks[1];
      service.remove(toRemove.id);
      expect(service.getById(toKeep.id)).toBeDefined();
    });

    it('ne devrait rien faire pour un identifiant inconnu', () => {
      const before = service.tasks().length;
      service.remove(99999);
      expect(service.tasks().length).toBe(before);
    });
  });

  // -------------------------------------------------------
  // Compteur de taches restantes
  // -------------------------------------------------------
  describe('remainingCount (computed)', () => {
    it('doit diminuer apres avoir marque une tache comme terminee', () => {
      const active = service.tasks().find((t: Task) => !t.done);
      expect(active).toBeDefined();
      const before = service.remainingCount();
      service.toggle(active!.id);
      expect(service.remainingCount()).toBe(before - 1);
    });

    it('doit augmenter apres avoir reactivee une tache', () => {
      const done = service.tasks().find((t: Task) => t.done);
      expect(done).toBeDefined();
      const before = service.remainingCount();
      service.toggle(done!.id);
      expect(service.remainingCount()).toBe(before + 1);
    });

    it('doit diminuer apres suppression d une tache active', () => {
      const active = service.tasks().find((t: Task) => !t.done);
      expect(active).toBeDefined();
      const before = service.remainingCount();
      service.remove(active!.id);
      expect(service.remainingCount()).toBe(before - 1);
    });

    it('ne doit pas changer apres suppression d une tache terminee', () => {
      const done = service.tasks().find((t: Task) => t.done);
      expect(done).toBeDefined();
      const before = service.remainingCount();
      service.remove(done!.id);
      expect(service.remainingCount()).toBe(before);
    });
  });

  // -------------------------------------------------------
  // Sous-tâches et progression
  // -------------------------------------------------------
  describe('Sous-taches & progression', () => {
    it('devrait ajouter une sous-tache valide', () => {
      const task = service.tasks()[0];
      const initialCount = task.subTasks?.length || 0;
      service.addSubTask(task.id, 'Nouvelle sous-etape');
      const updated = service.getById(task.id);
      expect(updated?.subTasks?.length).toBe(initialCount + 1);
      const added = updated?.subTasks?.[updated.subTasks.length - 1];
      expect(added?.title).toBe('Nouvelle sous-etape');
      expect(added?.done).toBe(false);
    });

    it('devrait inverser l etat done d une sous-tache avec toggleSubTask', () => {
      const task = service.tasks()[0];
      const subTask = task.subTasks![0];
      const initialDone = subTask.done;
      service.toggleSubTask(task.id, subTask.id);
      const updated = service.getById(task.id)?.subTasks?.find((s) => s.id === subTask.id);
      expect(updated?.done).toBe(!initialDone);
    });

    it('devrait supprimer une sous-tache avec removeSubTask', () => {
      const task = service.tasks()[0];
      const subTask = task.subTasks![0];
      service.removeSubTask(task.id, subTask.id);
      const updated = service.getById(task.id)?.subTasks?.find((s) => s.id === subTask.id);
      expect(updated).toBeUndefined();
    });

    it('devrait calculer la progression avec getSubTasksProgress', () => {
      const mockTask: Task = {
        id: 99,
        title: 'Mission Test',
        done: false,
        priority: 'normale',
        subTasks: [
          { id: '1', title: 'Etape 1', done: true },
          { id: '2', title: 'Etape 2', done: true },
          { id: '3', title: 'Etape 3', done: false },
          { id: '4', title: 'Etape 4', done: false },
        ],
      };
      const progress = service.getSubTasksProgress(mockTask);
      expect(progress.total).toBe(4);
      expect(progress.done).toBe(2);
      expect(progress.percentage).toBe(50);
    });
  });

  // -------------------------------------------------------
  // Liens et notes
  // -------------------------------------------------------
  describe('Liens et mise a jour partielle', () => {
    it('devrait ajouter un lien web valide', () => {
      const task = service.tasks()[0];
      service.addLink(task.id, 'angular.dev', 'Site Angular');
      const updated = service.getById(task.id);
      const added = updated?.links?.find((l) => l.label === 'Site Angular');
      expect(added).toBeDefined();
      expect(added?.url).toBe('https://angular.dev');
    });

    it('devrait supprimer un lien existant', () => {
      const task = service.tasks()[0];
      const link = task.links![0];
      service.removeLink(task.id, link.id);
      const updated = service.getById(task.id);
      expect(updated?.links?.find((l) => l.id === link.id)).toBeUndefined();
    });

    it('devrait mettre a jour les champs avec updateTaskFields', () => {
      const task = service.tasks()[0];
      service.updateTaskFields(task.id, {
        title: 'Titre Modifie',
        description: 'Nouvelle description enrichie',
        notes: 'Notes de reunion',
      });
      const updated = service.getById(task.id);
      expect(updated?.title).toBe('Titre Modifie');
      expect(updated?.description).toBe('Nouvelle description enrichie');
      expect(updated?.notes).toBe('Notes de reunion');
    });
  });
});
