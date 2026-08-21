import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { shiftDate, todayKey } from '../lib/date';

const DELAYS = [
  { label: '1 mois', days: 30 },
  { label: '3 mois', days: 90 },
  { label: '6 mois', days: 182 },
  { label: '1 an', days: 365 },
];

export function Letter() {
  const { letters, addLetter } = useApp();
  const [text, setText] = useState('');
  const [delayDays, setDelayDays] = useState(90);
  const [sealed, setSealed] = useState(false);

  const today = todayKey();
  const sorted = [...letters].sort((a, b) => (a.unlockDate < b.unlockDate ? 1 : -1));

  function handleSeal() {
    if (!text.trim()) return;
    addLetter(text.trim(), shiftDate(today, delayDays));
    setText('');
    setSealed(true);
    setTimeout(() => setSealed(false), 2500);
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Lettre à moi-même" subtitle="Écris à la personne que tu seras plus tard" />

      <div className="px-5">
        <Card>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Ta lettre
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ce que tu vis en ce moment, ce que tu espères, ce que tu voudrais te rappeler…"
            rows={6}
            className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
          />

          <label className="mb-1.5 mt-4 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            À ouvrir dans…
          </label>
          <div className="flex gap-2">
            {DELAYS.map((d) => (
              <button
                key={d.days}
                onClick={() => setDelayDays(d.days)}
                className={`flex-1 rounded-full py-2.5 text-[13px] font-medium transition-colors ${
                  delayDays === d.days ? 'bg-sage-dark text-white' : 'bg-bg-soft text-ink-soft'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSeal}
            disabled={!text.trim()}
            className="mt-4 w-full rounded-full bg-sage-dark py-3.5 font-serif text-base text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {sealed ? 'Lettre scellée ✓' : 'Sceller cette lettre'}
          </button>
        </Card>

        {sorted.length > 0 && (
          <>
            <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Tes lettres
            </p>
            <div className="flex flex-col gap-3">
              {sorted.map((l) => {
                const unlocked = l.unlockDate <= today;
                return (
                  <Card key={l.id} className="py-4">
                    {unlocked ? (
                      <>
                        <p className="text-[11px] font-medium text-sage-dark">
                          Ouverte — écrite le{' '}
                          {new Date(l.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-ink">
                          {l.text}
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔒</span>
                        <div>
                          <p className="text-[13px] text-ink">Lettre scellée</p>
                          <p className="text-[11px] text-ink-faint">
                            Se débloque le{' '}
                            {new Date(l.unlockDate + 'T00:00:00').toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
