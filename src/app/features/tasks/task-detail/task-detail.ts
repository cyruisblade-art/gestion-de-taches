import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  LucideAlertCircle,
  LucideArrowLeft,
  LucideCalendar,
  LucideCheck,
  LucideCheckSquare,
  LucideCircle,
  LucideEdit,
  LucideExternalLink,
  LucideFileText,
  LucideLink,
  LucideListTodo,
  LucidePencil,
  LucidePlus,
  LucideStickyNote,
  LucideTag,
  LucideTrash2,
  LucideX,
} from '@lucide/angular';
import { TaskService } from '../task';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    LucideArrowLeft,
    LucideAlertCircle,
    LucideCheck,
    LucideCircle,
    LucidePencil,
    LucideCalendar,
    LucideTag,
    LucideListTodo,
    LucidePlus,
    LucideFileText,
    LucideEdit,
    LucideStickyNote,
    LucideLink,
    LucideExternalLink,
    LucideTrash2,
    LucideX,
  ],
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
    const textarea = document.getElementById('description-textarea') as HTMLTextAreaElement | null;

    if (!textarea) {
      // Fallback sans accès DOM : on ajoute à la fin
      const snippets: Record<string, string> = {
        bold: '\n**Texte en gras**',
        italic: '\n*Texte en italique*',
        list: '\n- Élément de liste',
        task: '\n- [ ] Action à réaliser',
        link: '\n[Titre du lien](https://exemple.com)',
        heading: '\n### Nouveau titre',
      };
      this.descriptionInput.set(this.descriptionInput() + (snippets[type] ?? ''));
      return;
    }

    const start  = textarea.selectionStart ?? 0;
    const end    = textarea.selectionEnd   ?? 0;
    const sel    = textarea.value.slice(start, end);
    const before = textarea.value.slice(0, start);
    const after  = textarea.value.slice(end);

    let snippet: string;
    let cursorAfter: number;

    // S'assurer d'aller à la ligne si nécessaire pour les éléments de bloc ou si collé
    const needsLeadingNewline = before.length > 0 && !before.endsWith('\n');

    switch (type) {
      case 'bold': {
        const prefix = (before.length > 0 && !/[\s\n]$/.test(before)) ? ' ' : '';
        snippet     = sel ? `${prefix}**${sel}**` : `${prefix}**Texte en gras**`;
        cursorAfter = sel ? start + snippet.length : start + prefix.length + 2;
        break;
      }
      case 'italic': {
        const prefix = (before.length > 0 && !/[\s\n]$/.test(before)) ? ' ' : '';
        snippet     = sel ? `${prefix}*${sel}*` : `${prefix}*Texte en italique*`;
        cursorAfter = sel ? start + snippet.length : start + prefix.length + 1;
        break;
      }
      case 'heading': {
        const nl = needsLeadingNewline ? '\n' : '';
        snippet     = `${nl}### ${sel || 'Nouveau titre'}\n`;
        cursorAfter = start + snippet.length;
        break;
      }
      case 'list': {
        const nl = needsLeadingNewline ? '\n' : '';
        snippet     = `${nl}- ${sel || 'Élément de liste'}\n`;
        cursorAfter = start + snippet.length;
        break;
      }
      case 'task': {
        const nl = needsLeadingNewline ? '\n' : '';
        snippet     = `${nl}- [ ] ${sel || 'Action à réaliser'}\n`;
        cursorAfter = start + snippet.length;
        break;
      }
      case 'link': {
        // Un lien sur sa propre ligne si précédé d'un saut de ligne ou d'une liste
        const nl = needsLeadingNewline ? '\n' : (before.length > 0 && !/[\s\n]$/.test(before) ? ' ' : '');
        snippet     = sel ? `${nl}[${sel}](https://exemple.com)` : `${nl}[Titre du lien](https://exemple.com)`;
        cursorAfter = start + snippet.length;
        break;
      }
      default:
        return;
    }

    const newValue = before + snippet + after;

    // Met à jour le signal → Angular planifie la détection de changements (microtâche zone.js)
    this.descriptionInput.set(newValue);

    // setTimeout(fn, 0) s'exécute APRÈS la microtâche Angular (CD + [value] reset),
    // ce qui garantit que le curseur est positionné en dernier.
    setTimeout(() => {
      if (document.body.contains(textarea)) {
        textarea.focus();
        textarea.setSelectionRange(cursorAfter, cursorAfter);
      }
    }, 0);
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

}

