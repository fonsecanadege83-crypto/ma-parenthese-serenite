import { todayKey } from './date';
import { EMOTION_WHEEL } from './emotions';
import { RESOURCE_CATEGORIES } from './resources';
import type { EmotionEntry, Goal, JournalEntry, Letter, ThoughtRecord } from './types';

export interface SearchResult {
  id: string;
  type: 'journal' | 'emotion' | 'tcc' | 'letter' | 'resource' | 'goal';
  icon: string;
  typeLabel: string;
  title: string;
  snippet: string;
  date?: string;
  to: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function includesQuery(query: string, ...fields: (string | undefined)[]): boolean {
  const q = normalize(query);
  return fields.some((f) => f && normalize(f).includes(q));
}

interface SearchInput {
  journal: JournalEntry[];
  emotions: EmotionEntry[];
  thoughtRecords: ThoughtRecord[];
  letters: Letter[];
  goals: Goal[];
}

export function searchAll(query: string, data: SearchInput): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const today = todayKey();
  const results: SearchResult[] = [];

  data.journal.forEach((j) => {
    if (includesQuery(trimmed, j.gratitude, j.note)) {
      results.push({
        id: j.id,
        type: 'journal',
        icon: '📔',
        typeLabel: 'Journal',
        title: j.gratitude || 'Entrée de journal',
        snippet: j.note || j.gratitude,
        date: j.date,
        to: '/journal',
      });
    }
  });

  const emotionCategoryById = new Map(EMOTION_WHEEL.map((c) => [c.id, c]));
  data.emotions.forEach((e) => {
    if (includesQuery(trimmed, e.emotion, e.note)) {
      const cat = emotionCategoryById.get(e.categoryId);
      results.push({
        id: e.id,
        type: 'emotion',
        icon: cat?.icon ?? '🎭',
        typeLabel: 'Émotion',
        title: e.emotion,
        snippet: e.note || cat?.label || '',
        date: e.date,
        to: '/emotions',
      });
    }
  });

  data.thoughtRecords.forEach((r) => {
    if (includesQuery(trimmed, r.situation, r.automaticThought, r.balancedThought)) {
      results.push({
        id: r.id,
        type: 'tcc',
        icon: '🧩',
        typeLabel: 'Restructuration cognitive',
        title: r.situation,
        snippet: r.balancedThought,
        date: r.date,
        to: '/tcc',
      });
    }
  });

  data.letters.forEach((l) => {
    const unlocked = l.unlockDate <= today;
    if (unlocked && includesQuery(trimmed, l.text)) {
      results.push({
        id: l.id,
        type: 'letter',
        icon: '✉️',
        typeLabel: 'Lettre',
        title: 'Lettre à moi-même',
        snippet: l.text,
        date: l.unlockDate,
        to: '/lettre',
      });
    }
  });

  data.goals.forEach((g) => {
    if (includesQuery(trimmed, g.title, ...g.milestones.map((m) => m.label))) {
      results.push({
        id: g.id,
        type: 'goal',
        icon: '🎯',
        typeLabel: 'Objectif',
        title: g.title,
        snippet: `${g.milestones.filter((m) => m.done).length} / ${g.milestones.length} jalons`,
        to: '/objectifs',
      });
    }
  });

  RESOURCE_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      if (includesQuery(trimmed, item.title, item.body)) {
        results.push({
          id: item.id,
          type: 'resource',
          icon: cat.icon,
          typeLabel: 'Ressource',
          title: item.title,
          snippet: item.body,
          to: '/ressources',
        });
      }
    });
  });

  return results;
}
