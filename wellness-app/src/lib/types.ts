export type MoodValue = 'great' | 'good' | 'okay' | 'low' | 'rough';

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: MoodValue;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  gratitude: string;
  note: string;
}

export interface SessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'breathing' | 'meditation' | 'stretching';
  minutes: number;
}

export interface Profile {
  name: string;
  createdAt: string; // ISO date
}

export interface Habit {
  id: string;
  label: string;
  icon: string;
  custom?: boolean;
}

/** Map of date key -> ids of habits completed that day. */
export type HabitLog = Record<string, string[]>;

export type ThemeMode = 'light' | 'dark' | 'system';

export const DEFAULT_HABITS: Habit[] = [
  { id: 'water', label: "Boire de l'eau régulièrement", icon: '💧' },
  { id: 'move', label: 'Bouger 10 minutes', icon: '🚶' },
  { id: 'outside', label: "Prendre l'air dehors", icon: '🌳' },
  { id: 'screens', label: 'Limiter les écrans le soir', icon: '📵' },
  { id: 'sleep', label: 'Se coucher à une heure raisonnable', icon: '🌙' },
];

export const MOOD_META: Record<MoodValue, { emoji: string; label: string; score: number }> = {
  great: { emoji: '😊', label: 'Radieux', score: 5 },
  good: { emoji: '🙂', label: 'Bien', score: 4 },
  okay: { emoji: '😐', label: 'Neutre', score: 3 },
  low: { emoji: '😕', label: 'Fatigué', score: 2 },
  rough: { emoji: '😞', label: 'Difficile', score: 1 },
};

export const MOOD_ORDER: MoodValue[] = ['great', 'good', 'okay', 'low', 'rough'];
