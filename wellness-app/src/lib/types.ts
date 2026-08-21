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
  type: 'breathing' | 'meditation';
  minutes: number;
}

export interface Profile {
  name: string;
  createdAt: string; // ISO date
}

export const MOOD_META: Record<MoodValue, { emoji: string; label: string; score: number }> = {
  great: { emoji: '😊', label: 'Radieux', score: 5 },
  good: { emoji: '🙂', label: 'Bien', score: 4 },
  okay: { emoji: '😐', label: 'Neutre', score: 3 },
  low: { emoji: '😕', label: 'Fatigué', score: 2 },
  rough: { emoji: '😞', label: 'Difficile', score: 1 },
};

export const MOOD_ORDER: MoodValue[] = ['great', 'good', 'okay', 'low', 'rough'];
