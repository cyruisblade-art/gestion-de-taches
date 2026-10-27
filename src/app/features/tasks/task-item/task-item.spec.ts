import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item';
import { Task } from '../task.model';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const mockTask: Task = {
    id: 1,
    title: 'Finir les tests unitaires',
    done: false,
    priority: 'haute',
    dueDate: '2026-10-28',
    dueTime: '16:00',
    reminder: '1h',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('devrait etre cree', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre de la tache', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Finir les tests unitaires');
  });

  it('devrait formater l echeance avec formattedDue()', () => {
    expect(component.formattedDue()).toContain('16:00');
  });

  it('devrait formater le libelle de rappel avec reminderLabel()', () => {
    expect(component.reminderLabel()).toBe('Rappel 1 h');
  });

  it('devrait emettre toggled avec l id de la tache', () => {
    const spy = vi.spyOn(component.toggled, 'emit');
    component.onToggle();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('devrait emettre removed avec l id de la tache', () => {
    const spy = vi.spyOn(component.removed, 'emit');
    component.onRemove();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('devrait detecter le retard avec isLate()', () => {
    const lateTask: Task = {
      id: 2,
      title: 'Tache en retard',
      done: false,
      priority: 'normale',
      dueDate: '2020-01-01',
      dueTime: '09:00',
    };
    fixture.componentRef.setInput('task', lateTask);
    fixture.detectChanges();
    expect(component.isLate()).toBe(true);

    const doneTask: Task = {
      ...lateTask,
      done: true,
    };
    fixture.componentRef.setInput('task', doneTask);
    fixture.detectChanges();
    expect(component.isLate()).toBe(false);
  });
});
