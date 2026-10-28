import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail';
import { TaskService } from '../task';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';

function createActivatedRouteStub(id: string) {
  return {
    snapshot: {
      paramMap: convertToParamMap({ id }),
    },
  };
}

describe('TaskDetailComponent', () => {
  let fixture: ComponentFixture<TaskDetailComponent>;
  let component: TaskDetailComponent;

  // TODO Mission 8 : ajoute avant les tests :
  //   beforeEach(() => localStorage.clear());
  //   (même raison que dans task.spec.ts)

  // TODO Mission 9 : à la fin de ce fichier, ajoute les tests des nouveaux boutons :
  //   - cliquer sur « Marquer comme terminée » change component.task()?.done
  //   - cliquer sur « Supprimer » (avec vi.spyOn(window, 'confirm').mockReturnValue(true))
  //     supprime la tâche du service
  //   Pour cliquer sur un bouton dans un test :
  //     const bouton = fixture.nativeElement.querySelector('#detail-toggle') as HTMLButtonElement;
  //     bouton.click();
  //     fixture.detectChanges();
  //   (donne des id à tes boutons dans task-detail.html pour pouvoir les retrouver)

  async function createComponent(idParam: string) {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
      providers: [
        provideRouter(routes),
        { provide: ActivatedRoute, useValue: createActivatedRouteStub(idParam) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('devrait afficher une tache existante', async () => {
    // Get a real task id from a fresh service
    const tempService = TestBed.inject(TaskService);
    const existingId = tempService.tasks()[0].id;
    await createComponent(String(existingId));
    expect(component.task()).not.toBeNull();
    expect(component.task()?.id).toBe(existingId);
  });

  it('devrait afficher null pour un identifiant inexistant', async () => {
    await createComponent('99999');
    expect(component.task()).toBeNull();
  });

  it('devrait afficher null pour un identifiant invalide non numerique', async () => {
    await createComponent('abc');
    expect(component.task()).toBeNull();
  });

  it('devrait afficher le message d erreur si la tache n est pas trouvee', async () => {
    await createComponent('99999');
    const compiled = fixture.nativeElement as HTMLElement;
    const errorEl = compiled.querySelector('.detail-error');
    expect(errorEl).toBeTruthy();
  });

  it('devrait afficher les informations de la tache si trouvee', async () => {
    // First get id before resetting module
    const tempService = TestBed.inject(TaskService);
    const task = tempService.tasks()[0];
    await createComponent(String(task.id));
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(task.title);
  });

  it('devrait afficher un lien de retour vers la liste', async () => {
    const tempService = TestBed.inject(TaskService);
    const existingId = tempService.tasks()[0].id;
    await createComponent(String(existingId));
    const compiled = fixture.nativeElement as HTMLElement;
    const hasBackLink = compiled.textContent?.includes('Retour');
    expect(hasBackLink).toBe(true);
  });

  it('devrait modifier le titre de la tache', async () => {
    const tempService = TestBed.inject(TaskService);
    const task = tempService.tasks()[0];
    await createComponent(String(task.id));

    component.startEditingTitle();
    expect(component.editingTitle()).toBe(true);

    component.titleInput.set('Nouveau Titre Complet');
    component.saveTitle();
    expect(component.editingTitle()).toBe(false);
    expect(component.task()?.title).toBe('Nouveau Titre Complet');
  });

  it('devrait ajouter et basculer une sous-tache', async () => {
    const tempService = TestBed.inject(TaskService);
    const task = tempService.tasks()[0];
    await createComponent(String(task.id));

    const initialSubTasksCount = component.task()?.subTasks?.length || 0;
    component.newSubTaskTitle.set('Nouvelle sous-tache de test');
    component.onAddSubTask();

    expect(component.task()?.subTasks?.length).toBe(initialSubTasksCount + 1);
    const added = component.task()?.subTasks?.find((s) => s.title === 'Nouvelle sous-tache de test');
    expect(added).toBeDefined();

    component.onToggleSubTask(added!.id);
    const toggled = component.task()?.subTasks?.find((s) => s.id === added!.id);
    expect(toggled?.done).toBe(true);
  });

  it('devrait inverser l etat done de la tache avec onToggle()', async () => {
    const tempService = TestBed.inject(TaskService);
    const task = tempService.tasks()[0];
    await createComponent(String(task.id));
    const initialDone = component.task()?.done;

    component.onToggle();
    expect(component.task()?.done).toBe(!initialDone);
  });

  it('devrait ajouter et supprimer un tag depuis la vue de detail', async () => {
    const tempService = TestBed.inject(TaskService);
    const task = tempService.tasks()[0];
    await createComponent(String(task.id));

    component.onAddTag('NouveauTagDetail');
    expect(component.task()?.tags).toContain('NouveauTagDetail');

    component.onRemoveTag('NouveauTagDetail');
    expect(component.task()?.tags).not.toContain('NouveauTagDetail');
  });
});
