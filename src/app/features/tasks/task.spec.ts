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

  // TODO Mission 6 : ajoute ici un bloc de tests pour removeDone(), sur le modèle du bloc « remove() » au-dessus :
  //   describe('removeDone()', () => {
  //     it('devrait supprimer toutes les taches terminees', () => {
  //       service.removeDone();
  //       // vérifie qu'aucune tâche restante n'a done à true :
  //       // expect(service.tasks().some((t: Task) => t.done)).toBe(false);
  //     });
  //     it('ne devrait pas supprimer les taches actives', () => {
  //       // compte les tâches actives avant, appelle removeDone(), puis vérifie qu'il y en a toujours autant
  //     });
  //   });

  // TODO Mission 10 : ajoute ici un bloc de tests pour update(), avec au moins ces 4 tests :
  //   - update() change le titre et la priorité de la tâche demandée (vérifie avec service.getById(...))
  //   - update() enlève les espaces au début et à la fin du titre
  //   - update() ne change rien si le nouveau titre fait moins de 3 caractères
  //   - update() ne change pas les autres tâches
});
