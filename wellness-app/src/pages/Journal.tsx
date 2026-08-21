import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { formatFrShort, todayKey } from '../lib/date';
import { shareText } from '../lib/share';
import type { JournalEntry } from '../lib/types';

export function Journal() {
  const { journal, addJournalEntry } = useApp();
  const [gratitude, setGratitude] = useState('');
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [sharedId, setSharedId] = useState<string | null>(null);

  const today = todayKey();
  const alreadyToday = journal.some((j) => j.date === today);
  const entries = [...journal].reverse();

  function handleSave() {
    if (!gratitude.trim() && !note.trim()) return;
    addJournalEntry({ gratitude: gratitude.trim(), note: note.trim() });
    setGratitude('');
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleShareEntry(entry: JournalEntry) {
    const parts = [entry.gratitude && `🙏 ${entry.gratitude}`, entry.note].filter(Boolean);
    const outcome = await shareText('Mon journal — Sérénité', parts.join('\n\n'));
    if (outcome === 'copied') {
      setSharedId(entry.id);
      setTimeout(() => setSharedId(null), 2000);
    }
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Journal" subtitle="Note ce qui compte, même en quelques mots" />

      <div className="px-5">
        <Card>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Aujourd'hui, je suis reconnaissant·e pour…
          </label>
          <textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="Un moment, une personne, un détail simple…"
            rows={2}
            className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
          />

          <label className="mb-1.5 mt-4 block text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Comment s'est passée ta journée ?
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Écris librement, sans te juger…"
            rows={3}
            className="w-full resize-none rounded-2xl border border-line bg-card-soft px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
          />

          <button
            onClick={handleSave}
            disabled={!gratitude.trim() && !note.trim()}
            className="mt-4 w-full rounded-full bg-sage-dark py-3.5 font-serif text-base text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {saved ? 'Enregistré ✓' : alreadyToday ? 'Ajouter une autre entrée' : 'Enregistrer'}
          </button>
        </Card>

        <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
          Historique {entries.length > 0 && `(${entries.length})`}
        </p>

        {entries.length === 0 ? (
          <Card>
            <p className="text-center text-[13px] italic text-ink-faint">
              Tes premières lignes t'attendent 🌿
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((e) => (
              <Card key={e.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] font-medium text-ink-faint">{formatFrShort(e.date)}</p>
                  <button
                    onClick={() => handleShareEntry(e)}
                    aria-label="Partager cette entrée"
                    className="flex-shrink-0 text-[12px] text-ink-faint"
                  >
                    {sharedId === e.id ? 'Copié ✓' : '⤴ Partager'}
                  </button>
                </div>
                {e.gratitude && <p className="mt-1.5 text-[14px] text-ink">🙏 {e.gratitude}</p>}
                {e.note && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{e.note}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
