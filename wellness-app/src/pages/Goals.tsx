import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { todayKey } from '../lib/date';

export function Goals() {
  const { goals, addGoal, toggleMilestone, removeGoal } = useApp();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestoneInputs, setMilestoneInputs] = useState(['', '', '']);

  const today = todayKey();
  const sorted = [...goals].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  function updateMilestone(i: number, value: string) {
    setMilestoneInputs((prev) => prev.map((m, idx) => (idx === i ? value : m)));
  }

  function addMilestoneField() {
    setMilestoneInputs((prev) => [...prev, '']);
  }

  function resetForm() {
    setTitle('');
    setTargetDate('');
    setMilestoneInputs(['', '', '']);
    setAdding(false);
  }

  function handleCreate() {
    if (!title.trim()) return;
    addGoal(title, targetDate || null, milestoneInputs);
    resetForm();
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Objectifs" subtitle="Ce que tu veux construire, un jalon à la fois" />

      <div className="px-5">
        {!adding ? (
          <button
            onClick={() => setAdding(true)}
            className="mb-4 w-full rounded-full border border-dashed border-line py-3.5 text-sm font-medium text-ink-faint transition-colors active:bg-bg-soft"
          >
            + Nouvel objectif
          </button>
        ) : (
          <Card className="mb-4">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Ton objectif
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Méditer régulièrement pendant un mois"
              className="w-full rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />

            <label className="mb-1.5 mt-4 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Date cible (facultatif)
            </label>
            <input
              type="date"
              value={targetDate}
              min={today}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />

            <label className="mb-1.5 mt-4 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Jalons
            </label>
            <div className="flex flex-col gap-2">
              {milestoneInputs.map((m, i) => (
                <input
                  key={i}
                  value={m}
                  onChange={(e) => updateMilestone(i, e.target.value)}
                  placeholder={`Jalon ${i + 1}`}
                  className="w-full rounded-2xl border border-line bg-card-soft px-4 py-2.5 text-[13px] text-ink outline-none focus:border-sage"
                />
              ))}
            </div>
            <button onClick={addMilestoneField} className="mt-2 text-[12px] text-sage-dark">
              + Ajouter un jalon
            </button>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!title.trim()}
                className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-medium text-white disabled:opacity-40"
              >
                Créer
              </button>
              <button onClick={resetForm} className="flex-1 rounded-full border border-line py-3 text-sm text-ink-faint">
                Annuler
              </button>
            </div>
          </Card>
        )}

        {sorted.length === 0 && !adding && (
          <Card>
            <p className="text-center text-[13px] italic text-ink-faint">
              Aucun objectif pour l'instant. Commence petit 🌱
            </p>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          {sorted.map((g) => {
            const total = g.milestones.length;
            const done = g.milestones.filter((m) => m.done).length;
            const progress = total > 0 ? done / total : 0;
            const overdue = g.targetDate && g.targetDate < today && progress < 1;

            return (
              <Card key={g.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[17px] text-ink">{g.title}</p>
                    {g.targetDate && (
                      <p className={`mt-0.5 text-[11px] ${overdue ? 'text-clay' : 'text-ink-faint'}`}>
                        {overdue ? 'Échéance dépassée · ' : 'Échéance : '}
                        {new Date(g.targetDate + 'T00:00:00').toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeGoal(g.id)} className="flex-shrink-0 text-lg text-ink-faint">
                    ×
                  </button>
                </div>

                {total > 0 && (
                  <>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-soft">
                      <div
                        className="h-full rounded-full bg-sage-dark transition-all"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-ink-faint">
                      {done} / {total} jalons atteints
                    </p>

                    <div className="mt-3 flex flex-col gap-2">
                      {g.milestones.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => toggleMilestone(g.id, m.id)}
                          className="flex items-center gap-3 text-left"
                        >
                          <span
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] transition-colors ${
                              m.done ? 'bg-sage-dark text-white' : 'bg-bg-soft text-transparent'
                            }`}
                          >
                            ✓
                          </span>
                          <span className={`text-[13px] ${m.done ? 'text-ink-faint line-through' : 'text-ink-soft'}`}>
                            {m.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {total > 0 && progress === 1 && (
                  <p className="mt-3 text-[13px] font-medium text-sage-dark">Objectif atteint 🎉</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
