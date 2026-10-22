import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list';
import { TaskService } from '../task';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import { vi } from 'vitest';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('devrait etre cree', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher les taches du service', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('app-task-item');
    expect(items.length).toBe(taskService.tasks().length);
  });

  it('devrait afficher le compteur de taches restantes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitle = compiled.querySelector('.page-subtitle');
    expect(subtitle?.textContent).toContain(String(taskService.remainingCount()));
  });

  describe('Filtres', () => {
    it('le filtre actives ne doit afficher que les taches actives', () => {
      component.setFilter('actives');
      fixture.detectChanges();
      const filtered = component.filteredTasks();
      expect(filtered.every((t) => !t.done)).toBe(true);
    });

    it('le filtre terminees ne doit afficher que les taches terminees', () => {
      component.setFilter('terminées');
      fixture.detectChanges();
      const filtered = component.filteredTasks();
      expect(filtered.every((t) => t.done)).toBe(true);
    });

    it('le filtre toutes doit afficher toutes les taches', () => {
      component.setFilter('toutes');
      fixture.detectChanges();
      expect(component.filteredTasks().length).toBe(taskService.tasks().length);
    });
  });

  describe('Ajout de tache', () => {
    it('onCreated doit appeler taskService.add', () => {
      const spy = vi.spyOn(taskService, 'add');
      component.onCreated({ title: 'Tache test', priority: 'normale' });
      expect(spy).toHaveBeenCalledWith('Tache test', 'normale');
    });
  });

  describe('Suppression de tache', () => {
    it('onRemoved doit appeler taskService.remove', () => {
      const spy = vi.spyOn(taskService, 'remove');
      component.onRemoved(1);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('Changement d etat', () => {
    it('onToggled doit appeler taskService.toggle', () => {
      const spy = vi.spyOn(taskService, 'toggle');
      component.onToggled(1);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('Mise a jour du compteur', () => {
    it('le compteur doit se mettre a jour apres toggle', () => {
      const active = taskService.tasks().find((t) => !t.done);
      if (!active) return;
      const before = component.remainingCount();
      taskService.toggle(active.id);
      fixture.detectChanges();
      expect(component.remainingCount()).toBe(before - 1);
    });
  });
});
