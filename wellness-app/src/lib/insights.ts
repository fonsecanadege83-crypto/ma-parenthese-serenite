import type { Habit, HabitLog, MoodEntry, SessionLog, SleepEntry } from './types';
import { MOOD_META } from './types';

function avgScore(moods: MoodEntry[]): number {
  return moods.reduce((a, m) => a + MOOD_META[m.mood].score, 0) / moods.length;
}

const WEEKDAY_LABELS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export interface WeekdayInsight {
  bestDay: string;
  bestAvg: number;
  worstDay: string;
  worstAvg: number;
}

export function weekdayInsight(moods: MoodEntry[]): WeekdayInsight | null {
  const byDay = new Map<number, MoodEntry[]>();
  moods.forEach((m) => {
    const d = new Date(m.date + 'T00:00:00').getDay();
    byDay.set(d, [...(byDay.get(d) ?? []), m]);
  });
  const entries = [...byDay.entries()]
    .filter(([, ms]) => ms.length >= 2)
    .map(([day, ms]) => ({ day, avg: avgScore(ms) }));
  if (entries.length < 3) return null;

  const best = entries.reduce((a, b) => (b.avg > a.avg ? b : a));
  const worst = entries.reduce((a, b) => (b.avg < a.avg ? b : a));
  if (best.day === worst.day) return null;

  return {
    bestDay: WEEKDAY_LABELS[best.day],
    bestAvg: best.avg,
    worstDay: WEEKDAY_LABELS[worst.day],
    worstAvg: worst.avg,
  };
}

export interface HabitInsight {
  habit: Habit;
  avgWith: number;
  avgWithout: number;
  delta: number;
}

export function habitInsights(habits: Habit[], habitLog: HabitLog, moods: MoodEntry[]): HabitInsight[] {
  const results: HabitInsight[] = [];
  habits.forEach((h) => {
    const withMoods: MoodEntry[] = [];
    const withoutMoods: MoodEntry[] = [];
    moods.forEach((m) => {
      if (habitLog[m.date]?.includes(h.id)) withMoods.push(m);
      else withoutMoods.push(m);
    });
    if (withMoods.length >= 2 && withoutMoods.length >= 2) {
      const avgWith = avgScore(withMoods);
      const avgWithout = avgScore(withoutMoods);
      results.push({ habit: h, avgWith, avgWithout, delta: avgWith - avgWithout });
    }
  });
  return results.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 3);
}

export interface SleepInsight {
  avgGoodSleep: number;
  avgPoorSleep: number;
}

export function sleepInsight(sleepEntries: SleepEntry[], moods: MoodEntry[]): SleepInsight | null {
  const moodByDate = new Map(moods.map((m) => [m.date, m]));
  const good: MoodEntry[] = [];
  const poor: MoodEntry[] = [];
  sleepEntries.forEach((s) => {
    const mood = moodByDate.get(s.date);
    if (!mood) return;
    if (s.quality >= 4) good.push(mood);
    else if (s.quality <= 2) poor.push(mood);
  });
  if (good.length < 2 || poor.length < 2) return null;
  return { avgGoodSleep: avgScore(good), avgPoorSleep: avgScore(poor) };
}

export interface ActivityInsight {
  avgActive: number;
  avgInactive: number;
}

export function activityInsight(sessions: SessionLog[], moods: MoodEntry[]): ActivityInsight | null {
  const activeDays = new Set(sessions.map((s) => s.date));
  const active: MoodEntry[] = [];
  const inactive: MoodEntry[] = [];
  moods.forEach((m) => {
    if (activeDays.has(m.date)) active.push(m);
    else inactive.push(m);
  });
  if (active.length < 2 || inactive.length < 2) return null;
  return { avgActive: avgScore(active), avgInactive: avgScore(inactive) };
}
