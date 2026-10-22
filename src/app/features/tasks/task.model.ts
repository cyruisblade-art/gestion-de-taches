export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: 'basse' | 'normale' | 'haute';
}
