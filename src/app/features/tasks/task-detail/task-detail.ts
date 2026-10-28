import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../task';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  private taskId = computed(() => {
    const idParam = this.route.snapshot.paramMap.get('id');
    return idParam ? parseInt(idParam, 10) : NaN;
  });

  /** Signal calculé automatique liant la tâche au service */
  task = computed<Task | null>(() => {
    const id = this.taskId();
    if (isNaN(id)) return null;
    return this.taskService.getById(id) ?? null;
  });

  readonly priorityLabel: Record<Task['priority'], string> = {
    basse: 'Basse',
    normale: 'Normale',
    haute: 'Haute',
  };

  readonly priorities: Task['priority'][] = ['basse', 'normale', 'haute'];

  // --- Édition du titre ---
  editingTitle = signal(false);
  titleInput = signal('');

  startEditingTitle(): void {
    const t = this.task();
    if (!t) return;
    this.titleInput.set(t.title);
    this.editingTitle.set(true);
  }

  saveTitle(): void {
    const t = this.task();
    if (!t) return;
    const trimmed = this.titleInput().trim();
    if (trimmed.length >= 3) {
      this.taskService.updateTaskFields(t.id, { title: trimmed });
    }
    this.editingTitle.set(false);
  }

  cancelEditingTitle(): void {
    this.editingTitle.set(false);
  }

  onPriorityChange(priority: Task['priority']): void {
    const t = this.task();
    if (!t) return;
    this.taskService.updateTaskFields(t.id, { priority });
  }

  // --- Gestion des étiquettes (Tags) ---
  readonly allAvailableTags = this.taskService.allAvailableTags;
  showAddTagDropdown = signal(false);
  customTagInput = signal('');

  onAddTag(tag: string): void {
    const t = this.task();
    if (!t) return;
    this.taskService.addTag(t.id, tag);
    this.showAddTagDropdown.set(false);
  }

  onRemoveTag(tag: string): void {
    const t = this.task();
    if (!t) return;
    this.taskService.removeTag(t.id, tag);
  }

  onAddCustomTag(): void {
    const t = this.task();
    const tag = this.customTagInput().trim();
    if (!t || !tag) return;
    this.taskService.addTag(t.id, tag);
    this.customTagInput.set('');
    this.showAddTagDropdown.set(false);
  }

  // --- Sous-tâches & Progression ---
  newSubTaskTitle = signal('');

  subTasksProgress = computed(() => {
    const t = this.task();
    if (!t) return { total: 0, done: 0, percentage: 0 };
    return this.taskService.getSubTasksProgress(t);
  });

  onAddSubTask(): void {
    const t = this.task();
    const title = this.newSubTaskTitle().trim();
    if (!t || !title) return;
    this.taskService.addSubTask(t.id, title);
    this.newSubTaskTitle.set('');
  }

  onToggleSubTask(subTaskId: string): void {
    const t = this.task();
    if (!t) return;
    this.taskService.toggleSubTask(t.id, subTaskId);
  }

  onRemoveSubTask(subTaskId: string): void {
    const t = this.task();
    if (!t) return;
    this.taskService.removeSubTask(t.id, subTaskId);
  }

  // --- Description en texte enrichi / Markdown ---
  editingDescription = signal(false);
  descriptionInput = signal('');

  startEditingDescription(): void {
    const t = this.task();
    this.descriptionInput.set(t?.description || '');
    this.editingDescription.set(true);
  }

  saveDescription(): void {
    const t = this.task();
    if (!t) return;
    this.taskService.updateTaskFields(t.id, { description: this.descriptionInput().trim() });
    this.editingDescription.set(false);
  }

  cancelEditingDescription(): void {
    this.editingDescription.set(false);
  }

  insertFormat(type: 'bold' | 'italic' | 'list' | 'task' | 'link' | 'heading'): void {
    const current = this.descriptionInput();
    const formats: Record<string, string> = {
      bold: '**Texte en gras**',
      italic: '*Texte en italique*',
      list: '\n- Élément de liste',
      task: '\n- [ ] Action à réaliser',
      link: '[Titre du lien](https://exemple.com)',
      heading: '\n### Nouveau titre',
    };
    this.descriptionInput.set(current ? `${current} ${formats[type]}` : formats[type]);
  }

  /**
   * Convertit une syntaxe markdown légère en HTML sécurisé
   */
  renderMarkdown(text?: string): string {
    if (!text) return '<p class="detail-empty-text">Aucune description détaillée renseignée. Cliquez sur Modifier pour en ajouter une.</p>';

    // Escape basic html
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    escaped = escaped.replace(/^### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
    escaped = escaped.replace(/^## (.*$)/gim, '<h3 class="md-h3">$1</h3>');
    escaped = escaped.replace(/^# (.*$)/gim, '<h2 class="md-h2">$1</h2>');

    // Bold and italic
    escaped = escaped.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Links [label](url)
    escaped = escaped.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="md-link">$1</a>');

    // Task list items
    escaped = escaped.replace(/^- \[x\] (.*$)/gim, '<div class="md-task-item md-task-item--done"><span class="md-checkbox md-checkbox--checked">✓</span> <span class="md-task-label">$1</span></div>');
    escaped = escaped.replace(/^- \[ \] (.*$)/gim, '<div class="md-task-item"><span class="md-checkbox">○</span> <span class="md-task-label">$1</span></div>');

    // Regular list items
    escaped = escaped.replace(/^- (.*$)/gim, '<div class="md-bullet-item"><span class="md-bullet">•</span> <span>$1</span></div>');

    // Line breaks
    escaped = escaped.replace(/\n/gim, '<br/>');

    return escaped;
  }

  // --- Notes ---
  notesInput = signal('');
  notesSaved = signal(false);

  saveNotes(): void {
    const t = this.task();
    if (!t) return;
    this.taskService.updateTaskFields(t.id, { notes: this.notesInput() });
    this.notesSaved.set(true);
    setTimeout(() => this.notesSaved.set(false), 2000);
  }

  // --- Liens ---
  newLinkUrl = signal('');
  newLinkLabel = signal('');
  showAddLinkForm = signal(false);

  onAddLink(): void {
    const t = this.task();
    const url = this.newLinkUrl().trim();
    if (!t || !url) return;
    this.taskService.addLink(t.id, url, this.newLinkLabel().trim());
    this.newLinkUrl.set('');
    this.newLinkLabel.set('');
    this.showAddLinkForm.set(false);
  }

  onRemoveLink(linkId: string): void {
    const t = this.task();
    if (!t) return;
    this.taskService.removeLink(t.id, linkId);
  }

  // --- Actions globales ---
  onToggle(): void {
    const t = this.task();
    if (t) {
      this.taskService.toggle(t.id);
    }
  }

  onRemove(): void {
    const t = this.task();
    if (!t) return;
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      this.taskService.remove(t.id);
      this.router.navigate(['/tasks']);
    }
  }

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

  isLate(): boolean {
    const t = this.task();
    if (!t || t.done || !t.dueDate) return false;
    const dueStr = t.dueTime ? `${t.dueDate}T${t.dueTime}` : `${t.dueDate}T23:59:59`;
    return new Date(dueStr) < new Date();
  }

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
}
