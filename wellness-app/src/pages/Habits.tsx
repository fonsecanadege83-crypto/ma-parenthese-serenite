import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

const ICON_CHOICES = ['🌱', '📖', '🧘', '🎨', '🥗', '☎️', '🧴', '🎵'];

export function Habits() {
  const { habits, todayHabitIds, toggleHabit, addHabit, removeHabit, habitStreak } = useApp();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState(ICON_CHOICES[0]);

  const doneCount = todayHabitIds.length;

  function handleAdd() {
    if (!label.trim()) return;
    addHabit(label, icon);
    setLabel('');
    setIcon(ICON_CHOICES[0]);
    setAdding(false);
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Habitudes" subtitle="De petits gestes, répétés, qui font une vraie différence" />

      <div className="px-5">
        <Card className="flex items-center justify-between">
          <div>
            <p className="font-serif text-2xl text-ink">
              {doneCount} / {habits.length}
            </p>
            <p className="text-[12px] text-ink-faint">habitudes accomplies aujourd'hui</p>
          </div>
          <div className="h-14 w-14 rounded-full" style={{
            background: `conic-gradient(var(--color-sage) ${habits.length ? (doneCount / habits.length) * 360 : 0}deg, var(--color-bg-soft) 0deg)`,
          }} />
        </Card>

        <div className="mt-4 flex flex-col gap-3">
          {habits.map((h) => {
            const done = todayHabitIds.includes(h.id);
            const streak = habitStreak(h.id);
            return (
              <Card key={h.id} className="flex items-center gap-4 py-4">
                <button
                  onClick={() => toggleHabit(h.id)}
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-xl transition-colors ${
                    done ? 'bg-sage-dark text-white' : 'bg-bg-soft'
                  }`}
                >
                  {done ? '✓' : h.icon}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-[14px] ${done ? 'text-ink-faint line-through' : 'text-ink'}`}>
                    {h.label}
                  </p>
                  {streak > 0 && (
                    <p className="mt-0.5 text-[11px] text-sage-dark">🔥 {streak} jour{streak > 1 ? 's' : ''} de suite</p>
                  )}
                </div>
                {h.custom && (
                  <button
                    onClick={() => removeHabit(h.id)}
                    className="flex-shrink-0 px-1 text-lg text-ink-faint"
                    aria-label="Supprimer"
                  >
                    ×
                  </button>
                )}
              </Card>
            );
          })}
        </div>

        {adding ? (
          <Card className="mt-3">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Nouvelle habitude
            </label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex : Écrire 3 pensées positives"
              className="w-full rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />
            <div className="mt-3 flex gap-2">
              {ICON_CHOICES.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${
                    icon === ic ? 'bg-sage/15' : 'bg-bg-soft'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleAdd}
                disabled={!label.trim()}
                className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-medium text-white disabled:opacity-40"
              >
                Ajouter
              </button>
              <button
                onClick={() => setAdding(false)}
                className="flex-1 rounded-full border border-line py-3 text-sm font-medium text-ink-faint"
              >
                Annuler
              </button>
            </div>
          </Card>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-3 w-full rounded-full border border-dashed border-line py-3.5 text-sm font-medium text-ink-faint transition-colors active:bg-bg-soft"
          >
            + Ajouter une habitude
          </button>
        )}
      </div>
    </div>
  );
}
