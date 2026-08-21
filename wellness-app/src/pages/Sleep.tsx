import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { formatFrShort, sleepDurationHours } from '../lib/date';

const ROUTINE = [
  'Écrans éteints 30 minutes avant de dormir',
  'Une boisson chaude sans caféine',
  'Quelques minutes de respiration ou d\'étirements',
  'Une pièce fraîche et sombre',
  'Trois choses pour lesquelles tu es reconnaissant·e',
];

export function Sleep() {
  const { sleepEntries, addSleepEntry } = useApp();
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(3);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState(false);

  const entries = [...sleepEntries].reverse();
  const avgHours =
    sleepEntries.length > 0
      ? Math.round(
          (sleepEntries.reduce((a, e) => a + sleepDurationHours(e.bedtime, e.wakeTime), 0) /
            sleepEntries.length) *
            10,
        ) / 10
      : null;

  function toggleRoutineItem(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleSave() {
    addSleepEntry({ bedtime, wakeTime, quality });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Sommeil" subtitle="Prépare une bonne nuit et suis la qualité de ton repos" />

      <div className="px-5">
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Routine du coucher
          </p>
          <div className="mt-3 flex flex-col gap-2.5">
            {ROUTINE.map((item, i) => (
              <button key={item} onClick={() => toggleRoutineItem(i)} className="flex items-center gap-3 text-left">
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[13px] transition-colors ${
                    checked.has(i) ? 'bg-sage-dark text-white' : 'bg-bg-soft text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span className={`text-[13px] ${checked.has(i) ? 'text-ink-faint line-through' : 'text-ink-soft'}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Nuit dernière
          </p>
          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-ink-faint">Coucher</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full rounded-xl border border-line bg-card-soft px-3 py-2.5 text-[14px] text-ink outline-none focus:border-sage"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-ink-faint">Lever</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-xl border border-line bg-card-soft px-3 py-2.5 text-[14px] text-ink outline-none focus:border-sage"
              />
            </div>
          </div>

          <label className="mb-1.5 mt-4 block text-[11px] text-ink-faint">
            Qualité du sommeil
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`flex-1 rounded-xl py-2.5 text-lg transition-colors ${
                  quality >= q ? 'bg-sage/15' : 'bg-bg-soft'
                }`}
              >
                {quality >= q ? '⭐' : '☆'}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="mt-4 w-full rounded-full bg-sage-dark py-3.5 font-serif text-base text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-[0.98]"
          >
            {saved ? 'Enregistré ✓' : 'Enregistrer cette nuit'}
          </button>
        </Card>

        {avgHours !== null && (
          <Card className="mt-4 flex items-center gap-4">
            <span className="text-2xl">🌙</span>
            <div>
              <p className="font-serif text-xl text-ink">{avgHours}h</p>
              <p className="text-[11px] text-ink-faint">Moyenne de sommeil enregistrée</p>
            </div>
          </Card>
        )}

        {entries.length > 0 && (
          <>
            <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Historique
            </p>
            <div className="flex flex-col gap-3">
              {entries.slice(0, 7).map((e) => (
                <Card key={e.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-[11px] font-medium text-ink-faint">{formatFrShort(e.date)}</p>
                    <p className="text-[13px] text-ink">
                      {e.bedtime} → {e.wakeTime} · {sleepDurationHours(e.bedtime, e.wakeTime)}h
                    </p>
                  </div>
                  <span className="text-[13px]">{'⭐'.repeat(e.quality)}</span>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
