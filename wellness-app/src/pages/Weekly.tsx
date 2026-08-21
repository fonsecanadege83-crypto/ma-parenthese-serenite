import { PageHeader } from '../components/Layout';
import { Card, sageGradient } from '../components/Card';
import { useApp } from '../context/AppContext';
import { lastNDays, formatFrShort } from '../lib/date';
import { MOOD_META, MOOD_ORDER } from '../lib/types';

export function Weekly() {
  const { moods, journal, sessions, habits, habitLog } = useApp();
  const days = lastNDays(7);
  const daySet = new Set(days);

  const moodsThisWeek = moods.filter((m) => daySet.has(m.date));
  const journalThisWeek = journal.filter((j) => daySet.has(j.date));
  const sessionsThisWeek = sessions.filter((s) => daySet.has(s.date));
  const minutesThisWeek = sessionsThisWeek.reduce((a, s) => a + s.minutes, 0);

  const habitDoneThisWeek = days.reduce((sum, d) => sum + (habitLog[d]?.length ?? 0), 0);
  const habitPossible = habits.length * 7;
  const habitRate = habitPossible > 0 ? Math.round((habitDoneThisWeek / habitPossible) * 100) : 0;

  const moodByDate = Object.fromEntries(moods.map((m) => [m.date, m.mood]));

  const moodCounts = MOOD_ORDER.map((mood) => ({
    mood,
    count: moodsThisWeek.filter((m) => m.mood === mood).length,
  }));
  const maxMoodCount = Math.max(1, ...moodCounts.map((m) => m.count));
  const dominantMood = moodsThisWeek.length
    ? moodCounts.reduce((best, cur) => (cur.count > best.count ? cur : best)).mood
    : null;

  const activityScore = moodsThisWeek.length + journalThisWeek.length + sessionsThisWeek.length;
  const encouragement = getEncouragement(activityScore);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Bilan de la semaine" subtitle="Un pas en arrière pour mieux voir le chemin parcouru" />

      <div className="px-5">
        <Card className="text-white" style={sageGradient}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
            Cette semaine
          </p>
          <p className="mt-2 font-serif text-lg italic leading-relaxed">{encouragement}</p>
        </Card>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <MiniStat value={`${journalThisWeek.length}`} label="Entrées journal" icon="📔" />
          <MiniStat value={`${sessionsThisWeek.length}`} label="Séances" icon="🧘" />
          <MiniStat value={`${minutesThisWeek}`} label="Minutes" icon="⏱️" />
        </div>

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Humeur au fil des jours
          </p>
          <div className="mt-3 flex items-end justify-between gap-1.5">
            {days.map((d) => {
              const mood = moodByDate[d];
              const meta = mood ? MOOD_META[mood] : null;
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`flex h-11 w-full items-center justify-center rounded-xl text-[16px] ${
                      meta ? 'bg-sage/12' : 'bg-bg-soft'
                    }`}
                  >
                    {meta?.emoji ?? ''}
                  </div>
                  <span className="text-[9px] text-ink-faint">{formatFrShort(d)}</span>
                </div>
              );
            })}
          </div>
          {dominantMood && (
            <p className="mt-4 text-[13px] text-ink-soft">
              Humeur dominante : <span className="font-medium text-ink">{MOOD_META[dominantMood].emoji} {MOOD_META[dominantMood].label}</span>
            </p>
          )}
        </Card>

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">Répartition</p>
          <div className="mt-3 flex flex-col gap-2">
            {moodCounts.map(({ mood, count }) => (
              <div key={mood} className="flex items-center gap-3">
                <span className="w-6 text-center text-[15px]">{MOOD_META[mood].emoji}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-bg-soft">
                  <div
                    className="h-full rounded-full bg-sage-dark transition-all"
                    style={{ width: `${(count / maxMoodCount) * 100}%` }}
                  />
                </div>
                <span className="w-4 text-right text-[12px] text-ink-faint">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">Habitudes</p>
          <div className="mt-3 flex items-center gap-4">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full font-serif text-lg text-sage-dark"
              style={{
                background: `conic-gradient(var(--color-sage) ${habitRate * 3.6}deg, var(--color-bg-soft) 0deg)`,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-[13px]">
                {habitRate}%
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-ink-soft">
              {habitDoneThisWeek} habitude{habitDoneThisWeek !== 1 ? 's' : ''} cochée
              {habitDoneThisWeek !== 1 ? 's' : ''} sur {habitPossible} possibles cette semaine.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function getEncouragement(score: number): string {
  if (score === 0) return "Une nouvelle semaine commence — même un petit geste aujourd'hui compte.";
  if (score < 5) return "Chaque instant que tu t'accordes est une victoire, continue à ton rythme.";
  if (score < 12) return 'Belle régularité cette semaine — tu prends soin de toi, et ça se voit.';
  return 'Quelle semaine ! Ta constance est une vraie force, sois fier·e du chemin parcouru.';
}

function MiniStat({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <Card className="flex flex-col items-center gap-1 py-4">
      <span className="text-lg">{icon}</span>
      <span className="font-serif text-xl text-ink">{value}</span>
      <span className="text-center text-[10px] leading-tight text-ink-faint">{label}</span>
    </Card>
  );
}
