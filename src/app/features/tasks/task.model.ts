export type ReminderDelay = '5min' | '15min' | '30min' | '1h' | '1day';

export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: 'basse' | 'normale' | 'haute';
  /** Date limite au format 'AAAA-MM-JJ', ex. '2026-12-31' */
  dueDate?: string;
  /** Heure limite au format 'HH:MM', ex. '16:00' */
  dueTime?: string;
  /** Délai de rappel avant l'échéance */
  reminder?: ReminderDelay;
}
