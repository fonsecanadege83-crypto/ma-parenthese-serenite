import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadValue, saveValue } from '../lib/storage';
import { todayKey, computeStreak } from '../lib/date';
import type { JournalEntry, MoodEntry, MoodValue, Profile, SessionLog } from '../lib/types';

interface AppState {
  profile: Profile | null;
  moods: MoodEntry[];
  journal: JournalEntry[];
  sessions: SessionLog[];
}

interface AppContextValue extends AppState {
  isOnboarded: boolean;
  todayMood: MoodValue | null;
  streak: number;
  totalMinutes: number;
  completeOnboarding: (name: string) => void;
  setTodayMood: (mood: MoodValue) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  logSession: (type: SessionLog['type'], minutes: number) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => loadValue('profile', null));
  const [moods, setMoods] = useState<MoodEntry[]>(() => loadValue('moods', []));
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadValue('journal', []));
  const [sessions, setSessions] = useState<SessionLog[]>(() => loadValue('sessions', []));

  useEffect(() => saveValue('profile', profile), [profile]);
  useEffect(() => saveValue('moods', moods), [moods]);
  useEffect(() => saveValue('journal', journal), [journal]);
  useEffect(() => saveValue('sessions', sessions), [sessions]);

  const todayMood = useMemo(() => {
    const t = todayKey();
    return moods.find((m) => m.date === t)?.mood ?? null;
  }, [moods]);

  const streak = useMemo(() => {
    const activityDays = new Set<string>();
    moods.forEach((m) => activityDays.add(m.date));
    journal.forEach((j) => activityDays.add(j.date));
    sessions.forEach((s) => activityDays.add(s.date));
    return computeStreak([...activityDays]);
  }, [moods, journal, sessions]);

  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + s.minutes, 0),
    [sessions],
  );

  const value: AppContextValue = {
    profile,
    moods,
    journal,
    sessions,
    isOnboarded: profile !== null,
    todayMood,
    streak,
    totalMinutes,
    completeOnboarding: (name: string) => {
      setProfile({ name: name.trim(), createdAt: new Date().toISOString() });
    },
    setTodayMood: (mood: MoodValue) => {
      const t = todayKey();
      setMoods((prev) => {
        const next = prev.filter((m) => m.date !== t);
        next.push({ date: t, mood });
        return next;
      });
    },
    addJournalEntry: (entry) => {
      const t = todayKey();
      setJournal((prev) => [
        ...prev,
        { id: crypto.randomUUID(), date: t, ...entry },
      ]);
    },
    logSession: (type, minutes) => {
      const t = todayKey();
      setSessions((prev) => [
        ...prev,
        { id: crypto.randomUUID(), date: t, type, minutes },
      ]);
    },
    resetAll: () => {
      setProfile(null);
      setMoods([]);
      setJournal([]);
      setSessions([]);
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
