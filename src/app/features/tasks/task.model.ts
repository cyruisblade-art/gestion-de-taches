export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: 'basse' | 'normale' | 'haute';
  // TODO Bonus C : ajoute ici la date limite, facultative (le « ? » veut dire qu'elle peut être absente) :
  //   dueDate?: string; // au format 'AAAA-MM-JJ', par exemple '2026-12-31'
  //   Le format 'AAAA-MM-JJ' est celui que renvoie un <input type="date">.
}
