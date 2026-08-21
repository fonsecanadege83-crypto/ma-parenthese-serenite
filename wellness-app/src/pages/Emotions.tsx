import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { EMOTION_WHEEL, type EmotionCategory } from '../lib/emotions';
import { formatFrShort } from '../lib/date';

export function Emotions() {
  const { emotions, addEmotionEntry } = useApp();
  const [category, setCategory] = useState<EmotionCategory | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const history = [...emotions].reverse().slice(0, 6);
  const categoryById = Object.fromEntries(EMOTION_WHEEL.map((c) => [c.id, c]));

  function reset() {
    setCategory(null);
    setEmotion(null);
    setNote('');
  }

  function handleSave() {
    if (!category || !emotion) return;
    addEmotionEntry({ categoryId: category.id, emotion, note: note.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    reset();
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Roue des émotions" subtitle="Nommer ce que l'on ressent, plus précisément" />

      <div className="px-5">
        {!category && (
          <Card>
            <p className="text-[13px] text-ink-soft">Que ressens-tu, dans les grandes lignes ?</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {EMOTION_WHEEL.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c)}
                  className="flex flex-col items-center gap-1.5 rounded-2xl py-4 transition-transform active:scale-[0.97]"
                  style={{ backgroundColor: `${c.color}1F` }}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-[13px] font-medium" style={{ color: c.color }}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {category && !emotion && (
          <Card>
            <button onClick={reset} className="text-[12px] text-ink-faint">
              ‹ {category.label}
            </button>
            <p className="mt-2 text-[13px] text-ink-soft">Plus précisément ?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.emotions.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmotion(e)}
                  className="rounded-full px-4 py-2 text-[13px] font-medium transition-colors"
                  style={{ backgroundColor: `${category.color}1F`, color: category.color }}
                >
                  {e}
                </button>
              ))}
            </div>
          </Card>
        )}

        {category && emotion && (
          <Card>
            <button onClick={() => setEmotion(null)} className="text-[12px] text-ink-faint">
              ‹ {emotion}
            </button>
            <div
              className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ backgroundColor: `${category.color}1F` }}
            >
              <span className="text-2xl">{category.icon}</span>
              <p className="font-serif text-lg" style={{ color: category.color }}>
                {emotion}
              </p>
            </div>
            <label className="mb-1.5 mt-4 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Un mot sur le contexte (facultatif)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Qu'est-ce qui a déclenché ça ?"
              rows={2}
              className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
            />
            <button
              onClick={handleSave}
              className="mt-4 w-full rounded-full bg-sage-dark py-3.5 font-serif text-base text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-[0.98]"
            >
              Enregistrer
            </button>
          </Card>
        )}

        {saved && <p className="mt-3 text-center text-[13px] text-sage-dark">Émotion notée 🌿</p>}

        {history.length > 0 && (
          <>
            <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Récemment
            </p>
            <div className="flex flex-col gap-2.5">
              {history.map((e) => {
                const cat = categoryById[e.categoryId];
                return (
                  <Card key={e.id} className="flex items-center gap-3 py-3">
                    <span className="text-xl">{cat?.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-ink">{e.emotion}</p>
                      {e.note && <p className="truncate text-[12px] text-ink-faint">{e.note}</p>}
                    </div>
                    <span className="flex-shrink-0 text-[11px] text-ink-faint">{formatFrShort(e.date)}</span>
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
