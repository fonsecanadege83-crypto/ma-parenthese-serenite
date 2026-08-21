import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { lastNDays, formatFrShort } from '../lib/date';
import { MOOD_META } from '../lib/types';

export function Profile() {
  const { profile, streak, totalMinutes, sessions, journal, moods, resetAll } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  const days = lastNDays(14);
  const moodByDate = Object.fromEntries(moods.map((m) => [m.date, m.mood]));

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetAll();
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Profil" />

      <div className="px-5">
        <Card className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/15 font-serif text-2xl text-sage-dark">
            {profile?.name?.[0]?.toUpperCase() || '🌿'}
          </div>
          <div>
            <p className="font-serif text-xl text-ink">{profile?.name}</p>
            {memberSince && <p className="text-[12px] text-ink-faint">Membre depuis le {memberSince}</p>}
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <MiniStat value={streak} label="Jours de série" icon="🔥" />
          <MiniStat value={sessions.length} label="Séances" icon="🌬️" />
          <MiniStat value={totalMinutes} label="Minutes" icon="⏱️" />
        </div>

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Humeur — 14 derniers jours
          </p>
          <div className="mt-3 flex items-end justify-between gap-1">
            {days.map((d) => {
              const mood = moodByDate[d];
              const meta = mood ? MOOD_META[mood] : null;
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`flex h-9 w-full items-center justify-center rounded-lg text-[13px] ${
                      meta ? 'bg-sage/12' : 'bg-bg-soft'
                    }`}
                    title={formatFrShort(d)}
                  >
                    {meta?.emoji ?? ''}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">Journal</p>
          <p className="mt-2 text-[13px] text-ink-soft">
            {journal.length} entrée{journal.length !== 1 ? 's' : ''} enregistrée
            {journal.length !== 1 ? 's' : ''}
          </p>
        </Card>

        <button
          onClick={handleReset}
          onBlur={() => setConfirmReset(false)}
          className={`mt-6 w-full rounded-full border py-3 text-sm font-medium transition-colors ${
            confirmReset
              ? 'border-clay bg-clay/10 text-clay'
              : 'border-line text-ink-faint'
          }`}
        >
          {confirmReset ? 'Confirmer la réinitialisation ?' : 'Réinitialiser mes données'}
        </button>
      </div>
    </div>
  );
}

function MiniStat({ value, label, icon }: { value: number; label: string; icon: string }) {
  return (
    <Card className="flex flex-col items-center gap-1 py-4">
      <span className="text-lg">{icon}</span>
      <span className="font-serif text-xl text-ink">{value}</span>
      <span className="text-center text-[10px] leading-tight text-ink-faint">{label}</span>
    </Card>
  );
}
