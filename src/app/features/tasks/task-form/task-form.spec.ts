import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form';
import { vi } from 'vitest';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait etre cree', () => {
    expect(component).toBeTruthy();
  });

  describe('Validation du formulaire', () => {
    it('ne devrait pas emettre created si le titre est vide', () => {
      const spy = vi.spyOn(component.created, 'emit');
      component.title.set('');
      component.onSubmit();
      expect(spy).not.toHaveBeenCalled();
    });

    it('ne devrait pas emettre created si le titre est trop court', () => {
      const spy = vi.spyOn(component.created, 'emit');
      component.title.set('ab');
      component.onSubmit();
      expect(spy).not.toHaveBeenCalled();
    });

    it('devrait afficher un message d erreur pour un titre vide', () => {
      component.title.set('');
      component.onSubmit();
      expect(component.errorMessage()).toContain('obligatoire');
    });

    it('devrait afficher un message d erreur pour un titre trop court', () => {
      component.title.set('ab');
      component.onSubmit();
      expect(component.errorMessage()).toContain('3');
    });

    it('devrait emettre created avec un titre valide', () => {
      const spy = vi.spyOn(component.created, 'emit');
      component.title.set('Titre valide');
      component.priority.set('haute');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith({ title: 'Titre valide', priority: 'haute' });
    });

    it('devrait rogner les espaces du titre avant validation', () => {
      const spy = vi.spyOn(component.created, 'emit');
      component.title.set('   Valide   ');
      component.onSubmit();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Valide' })
      );
    });

    it('doit rejeter un titre compose uniquement d espaces', () => {
      const spy = vi.spyOn(component.created, 'emit');
      component.title.set('   ');
      component.onSubmit();
      expect(spy).not.toHaveBeenCalled();
    });

    it('devrait reinitialiser le formulaire apres un ajout reussi', () => {
      component.title.set('Titre valide');
      component.priority.set('haute');
      component.onSubmit();
      expect(component.title()).toBe('');
      expect(component.priority()).toBe('normale');
      expect(component.errorMessage()).toBe('');
    });

    it('la priorite par defaut devrait etre normale', () => {
      expect(component.priority()).toBe('normale');
    });
  });

  describe('Validation en temps reel', () => {
    it('doit effacer le message d erreur quand le titre devient valide', () => {
      component.title.set('');
      component.onSubmit();
      component.onTitleChange('Nouveau titre valide');
      expect(component.errorMessage()).toBe('');
    });
  });
});
