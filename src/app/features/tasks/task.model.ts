
export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskLink {
  id: string;
  url: string;
  label?: string;
}

export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: 'basse' | 'normale' | 'haute';
  /** Date limite au format 'AAAA-MM-JJ', ex. '2026-12-31' */
  dueDate?: string;
  /** Heure limite au format 'HH:MM', ex. '16:00' */
  dueTime?: string;

  /** Description en texte enrichi / Markdown */
  description?: string;
  /** Notes libres */
  notes?: string;
  /** Liste des sous-tâches avec progression */
  subTasks?: SubTask[];
  /** Liens web associés */
  links?: TaskLink[];
  /** Étiquettes / Tags personnalisés (ex. 'Angular', 'Travail') */
  tags?: string[];
  /** Statut pour vue Kanban */
  status?: 'todo' | 'in_progress' | 'done';
}
