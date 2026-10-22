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
});
