import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadValue, saveValue } from '../lib/storage';
import { todayKey, computeStreak } from '../lib/date';
import type {
  EmotionEntry,
  Habit,
  HabitLog,
  JournalEntry,
  Letter,
  MoodEntry,
  MoodValue,
  Profile,
  SessionLog,
  SleepEntry,
  ThemeMode,
} from '../lib/types';
import { DEFAULT_HABITS } from '../lib/types';

interface AppState {
  profile: Profile | null;
  moods: MoodEntry[];
  journal: JournalEntry[];
  sessions: SessionLog[];
  habits: Habit[];
  habitLog: HabitLog;
  theme: ThemeMode;
  sleepEntries: SleepEntry[];
  emotions: EmotionEntry[];
  letters: Letter[];
  favoriteAffirmations: string[];
}

interface AppContextValue extends AppState {
  isOnboarded: boolean;
  todayMood: MoodValue | null;
  streak: number;
  totalMinutes: number;
  todayHabitIds: string[];
  completeOnboarding: (name: string) => void;
  setTodayMood: (mood: MoodValue) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  logSession: (type: SessionLog['type'], minutes: number) => void;
  toggleHabit: (habitId: string) => void;
  addHabit: (label: string, icon: string) => void;
  removeHabit: (habitId: string) => void;
  habitStreak: (habitId: string) => number;
  setTheme: (mode: ThemeMode) => void;
  addSleepEntry: (entry: Omit<SleepEntry, 'id' | 'date'>) => void;
  addEmotionEntry: (entry: Omit<EmotionEntry, 'id' | 'date'>) => void;
  addLetter: (text: string, unlockDate: string) => void;
  toggleFavoriteAffirmation: (text: string) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = mode;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => loadValue('profile', null));
  const [moods, setMoods] = useState<MoodEntry[]>(() => loadValue('moods', []));
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadValue('journal', []));
  const [sessions, setSessions] = useState<SessionLog[]>(() => loadValue('sessions', []));
  const [habits, setHabits] = useState<Habit[]>(() => loadValue('habits', DEFAULT_HABITS));
  const [habitLog, setHabitLog] = useState<HabitLog>(() => loadValue('habitLog', {}));
  const [theme, setThemeState] = useState<ThemeMode>(() => loadValue('theme', 'system'));
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>(() => loadValue('sleepEntries', []));
  const [emotions, setEmotions] = useState<EmotionEntry[]>(() => loadValue('emotions', []));
  const [letters, setLetters] = useState<Letter[]>(() => loadValue('letters', []));
  const [favoriteAffirmations, setFavoriteAffirmations] = useState<string[]>(() =>
    loadValue('favoriteAffirmations', []),
  );

  useEffect(() => saveValue('profile', profile), [profile]);
  useEffect(() => saveValue('moods', moods), [moods]);
  useEffect(() => saveValue('journal', journal), [journal]);
  useEffect(() => saveValue('sessions', sessions), [sessions]);
  useEffect(() => saveValue('habits', habits), [habits]);
  useEffect(() => saveValue('habitLog', habitLog), [habitLog]);
  useEffect(() => saveValue('sleepEntries', sleepEntries), [sleepEntries]);
  useEffect(() => saveValue('emotions', emotions), [emotions]);
  useEffect(() => saveValue('letters', letters), [letters]);
  useEffect(() => saveValue('favoriteAffirmations', favoriteAffirmations), [favoriteAffirmations]);
  useEffect(() => {
    saveValue('theme', theme);
    applyTheme(theme);
  }, [theme]);

  const todayMood = useMemo(() => {
    const t = todayKey();
    return moods.find((m) => m.date === t)?.mood ?? null;
  }, [moods]);

  const todayHabitIds = useMemo(() => habitLog[todayKey()] ?? [], [habitLog]);

  const streak = useMemo(() => {
    const activityDays = new Set<string>();
    moods.forEach((m) => activityDays.add(m.date));
    journal.forEach((j) => activityDays.add(j.date));
    sessions.forEach((s) => activityDays.add(s.date));
    Object.entries(habitLog).forEach(([date, ids]) => {
      if (ids.length > 0) activityDays.add(date);
    });
    return computeStreak([...activityDays]);
  }, [moods, journal, sessions, habitLog]);

  const totalMinutes = useMemo(
    () => sessions.reduce((sum, s) => sum + s.minutes, 0),
    [sessions],
  );

  const value: AppContextValue = {
    profile,
    moods,
    journal,
    sessions,
    habits,
    habitLog,
    theme,
    sleepEntries,
    emotions,
    letters,
    favoriteAffirmations,
    isOnboarded: profile !== null,
    todayMood,
    streak,
    totalMinutes,
    todayHabitIds,
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
    toggleHabit: (habitId: string) => {
      const t = todayKey();
      setHabitLog((prev) => {
        const current = prev[t] ?? [];
        const next = current.includes(habitId)
          ? current.filter((id) => id !== habitId)
          : [...current, habitId];
        return { ...prev, [t]: next };
      });
    },
    addHabit: (label: string, icon: string) => {
      setHabits((prev) => [
        ...prev,
        { id: crypto.randomUUID(), label: label.trim(), icon: icon || '🌱', custom: true },
      ]);
    },
    removeHabit: (habitId: string) => {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
    },
    habitStreak: (habitId: string) => {
      const days = Object.entries(habitLog)
        .filter(([, ids]) => ids.includes(habitId))
        .map(([date]) => date);
      return computeStreak(days);
    },
    setTheme: (mode: ThemeMode) => setThemeState(mode),
    addSleepEntry: (entry) => {
      const t = todayKey();
      setSleepEntries((prev) => [...prev, { id: crypto.randomUUID(), date: t, ...entry }]);
    },
    addEmotionEntry: (entry) => {
      const t = todayKey();
      setEmotions((prev) => [...prev, { id: crypto.randomUUID(), date: t, ...entry }]);
    },
    addLetter: (text, unlockDate) => {
      setLetters((prev) => [
        ...prev,
        { id: crypto.randomUUID(), createdAt: new Date().toISOString(), unlockDate, text },
      ]);
    },
    toggleFavoriteAffirmation: (text: string) => {
      setFavoriteAffirmations((prev) =>
        prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text],
      );
    },
    resetAll: () => {
      setProfile(null);
      setMoods([]);
      setJournal([]);
      setSessions([]);
      setHabits(DEFAULT_HABITS);
      setHabitLog({});
      setSleepEntries([]);
      setEmotions([]);
      setLetters([]);
      setFavoriteAffirmations([]);
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
