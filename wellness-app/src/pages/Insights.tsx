import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { activityInsight, habitInsights, sleepInsight, weekdayInsight } from '../lib/insights';

function compareLabel(a: number, b: number): string {
  const delta = a - b;
  if (Math.abs(delta) < 0.3) return 'similaire';
  return delta > 0 ? 'meilleure' : 'moins bonne';
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 flex-shrink-0 text-[12px] text-ink-soft">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-bg-soft">
        <div className="h-full rounded-full bg-sage-dark" style={{ width: `${(score / 5) * 100}%` }} />
      </div>
      <span className="w-8 flex-shrink-0 text-right text-[12px] text-ink-faint">{score.toFixed(1)}</span>
    </div>
  );
}

export function Insights() {
  const { moods, habits, habitLog, sleepEntries, sessions } = useApp();

  const weekday = weekdayInsight(moods);
  const habitsData = habitInsights(habits, habitLog, moods);
  const sleep = sleepInsight(sleepEntries, moods);
  const activity = activityInsight(sessions, moods);

  const hasAnyInsight = weekday || habitsData.length > 0 || sleep || activity;

  return (
    <div className="animate-fade-up">
      <PageHeader title="Insights" subtitle="Ce que tes données racontent sur toi" />

      <div className="px-5">
        {!hasAnyInsight && (
          <Card>
            <p className="text-center text-[13px] italic leading-relaxed text-ink-faint">
              Continue à noter ton humeur, ton sommeil et tes habitudes quelques jours de plus —
              des tendances commenceront à apparaître ici. 🌿
            </p>
          </Card>
        )}

        {weekday && (
          <Card className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Jour de la semaine
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Ton humeur est en moyenne meilleure le{' '}
              <span className="font-medium text-ink">{weekday.bestDay}</span>, et plus difficile le{' '}
              <span className="font-medium text-ink">{weekday.worstDay}</span>.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <ScoreBar label={weekday.bestDay} score={weekday.bestAvg} />
              <ScoreBar label={weekday.worstDay} score={weekday.worstAvg} />
            </div>
          </Card>
        )}

        {habitsData.length > 0 && (
          <Card className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Effet de tes habitudes
            </p>
            <div className="mt-3 flex flex-col gap-4">
              {habitsData.map(({ habit, avgWith, avgWithout, delta }) => (
                <div key={habit.id}>
                  <p className="mb-1.5 text-[13px] text-ink">
                    {habit.icon} {habit.label} —{' '}
                    <span className={delta > 0 ? 'text-sage-dark' : 'text-clay'}>
                      {delta > 0 ? '↑' : '↓'} humeur {delta > 0 ? 'meilleure' : 'plus basse'} ces jours-là
                    </span>
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <ScoreBar label="Fait" score={avgWith} />
                    <ScoreBar label="Pas fait" score={avgWithout} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {sleep && (
          <Card className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Sommeil et humeur
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Les jours qui suivent une bonne nuit, ton humeur est en moyenne{' '}
              {compareLabel(sleep.avgGoodSleep, sleep.avgPoorSleep)} que celle qui suit une nuit
              difficile.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <ScoreBar label="Bonne nuit" score={sleep.avgGoodSleep} />
              <ScoreBar label="Nuit difficile" score={sleep.avgPoorSleep} />
            </div>
          </Card>
        )}

        {activity && (
          <Card className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Activité et humeur
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Les jours où tu pratiques respiration, méditation ou étirements, ton humeur est en
              moyenne {compareLabel(activity.avgActive, activity.avgInactive)}.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <ScoreBar label="Jour actif" score={activity.avgActive} />
              <ScoreBar label="Jour calme" score={activity.avgInactive} />
            </div>
          </Card>
        )}

        <p className="mt-2 px-1 text-[11px] leading-relaxed text-ink-faint">
          Ces tendances se basent uniquement sur tes données locales et n'ont pas de valeur
          diagnostique — elles servent juste à mieux te connaître.
        </p>
      </div>
    </div>
  );
}
