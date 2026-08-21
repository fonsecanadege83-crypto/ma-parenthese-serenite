import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { formatFrShort } from '../lib/date';

type Step = 1 | 2 | 3 | 4 | 5;

const INITIAL = {
  situation: '',
  automaticThought: '',
  intensityBefore: 7,
  evidenceFor: '',
  evidenceAgainst: '',
  balancedThought: '',
  intensityAfter: 4,
};

export function CBT() {
  const { thoughtRecords, addThoughtRecord } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState(INITIAL);
  const [showHistory, setShowHistory] = useState(false);

  const history = [...thoughtRecords].reverse();

  function update<K extends keyof typeof INITIAL>(key: K, value: (typeof INITIAL)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function reset() {
    setForm(INITIAL);
    setStep(1);
  }

  function handleFinish() {
    addThoughtRecord(form);
    reset();
    setShowHistory(true);
  }

  if (showHistory) {
    return (
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 px-5 pt-12">
          <button
            onClick={() => setShowHistory(false)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-card text-ink"
          >
            ‹
          </button>
          <h1 className="font-serif text-xl text-ink">Fiches précédentes</h1>
        </div>
        <div className="flex flex-col gap-3 px-5 pt-4">
          {history.length === 0 && (
            <Card>
              <p className="text-center text-[13px] italic text-ink-faint">Aucune fiche pour l'instant</p>
            </Card>
          )}
          {history.map((r) => (
            <Card key={r.id}>
              <p className="text-[11px] font-medium text-ink-faint">{formatFrShort(r.date)}</p>
              <p className="mt-1.5 text-[13px] text-ink">
                <span className="text-ink-faint">Situation : </span>
                {r.situation}
              </p>
              <p className="mt-1.5 text-[13px] italic text-ink-soft">"{r.automaticThought}"</p>
              <p className="mt-2 text-[13px] font-medium text-sage-dark">→ {r.balancedThought}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-faint">
                Intensité : {r.intensityBefore}/10 → {r.intensityAfter}/10
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Restructuration cognitive" subtitle="Examine une pensée qui te pèse, étape par étape" />

      <div className="px-5">
        <div className="mb-4 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-sage-dark' : 'bg-bg-soft'}`} />
          ))}
        </div>

        {step === 1 && (
          <Card>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Quelle est la situation ?
            </label>
            <textarea
              autoFocus
              value={form.situation}
              onChange={(e) => update('situation', e.target.value)}
              placeholder="Décris ce qui s'est passé, factuellement…"
              rows={3}
              className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />
            <button
              onClick={() => setStep(2)}
              disabled={!form.situation.trim()}
              className="mt-4 w-full rounded-full bg-sage-dark py-3.5 font-serif text-base text-white disabled:opacity-40"
            >
              Continuer
            </button>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Quelle pensée automatique a surgi ?
            </label>
            <textarea
              autoFocus
              value={form.automaticThought}
              onChange={(e) => update('automaticThought', e.target.value)}
              placeholder="Ce que tu t'es dit, sur le coup…"
              rows={3}
              className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />
            <label className="mb-1.5 mt-4 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              À quel point tu y crois (0 à 10) ?
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={form.intensityBefore}
              onChange={(e) => update('intensityBefore', Number(e.target.value))}
              className="w-full accent-sage-dark"
            />
            <p className="text-center font-serif text-2xl text-sage-dark">{form.intensityBefore}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 rounded-full border border-line py-3 text-sm text-ink-faint">
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.automaticThought.trim()}
                className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-medium text-white disabled:opacity-40"
              >
                Continuer
              </button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Quels faits soutiennent cette pensée ?
            </label>
            <textarea
              autoFocus
              value={form.evidenceFor}
              onChange={(e) => update('evidenceFor', e.target.value)}
              placeholder="Les preuves réelles, pas les impressions…"
              rows={3}
              className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />
            <label className="mb-1.5 mt-4 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Quels faits la contredisent ?
            </label>
            <textarea
              value={form.evidenceAgainst}
              onChange={(e) => update('evidenceAgainst', e.target.value)}
              placeholder="Ce qui va à l'encontre de cette pensée…"
              rows={3}
              className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />
            <div className="mt-2 flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 rounded-full border border-line py-3 text-sm text-ink-faint">
                Retour
              </button>
              <button onClick={() => setStep(4)} className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-medium text-white">
                Continuer
              </button>
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Une pensée plus équilibrée ?
            </label>
            <textarea
              autoFocus
              value={form.balancedThought}
              onChange={(e) => update('balancedThought', e.target.value)}
              placeholder="En tenant compte de toutes les preuves, que peux-tu te dire de plus juste ?"
              rows={3}
              className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />
            <div className="mt-2 flex gap-2">
              <button onClick={() => setStep(3)} className="flex-1 rounded-full border border-line py-3 text-sm text-ink-faint">
                Retour
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!form.balancedThought.trim()}
                className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-medium text-white disabled:opacity-40"
              >
                Continuer
              </button>
            </div>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Maintenant, à quel point tu crois à la pensée de départ (0 à 10) ?
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={form.intensityAfter}
              onChange={(e) => update('intensityAfter', Number(e.target.value))}
              className="w-full accent-sage-dark"
            />
            <p className="text-center font-serif text-2xl text-sage-dark">{form.intensityAfter}</p>
            {form.intensityAfter < form.intensityBefore && (
              <p className="mt-2 text-center text-[12px] text-sage-dark">
                -{form.intensityBefore - form.intensityAfter} points, bien joué 🌿
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={() => setStep(4)} className="flex-1 rounded-full border border-line py-3 text-sm text-ink-faint">
                Retour
              </button>
              <button onClick={handleFinish} className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-medium text-white">
                Enregistrer
              </button>
            </div>
          </Card>
        )}

        {history.length > 0 && step === 1 && (
          <button onClick={() => setShowHistory(true)} className="mt-4 w-full text-center text-[13px] text-ink-faint">
            Voir mes {history.length} fiche{history.length > 1 ? 's' : ''} précédente{history.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );
}
