import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card, sageGradient } from '../components/Card';
import { useApp } from '../context/AppContext';
import { AFFIRMATIONS } from '../lib/affirmations';
import { todayKey } from '../lib/date';
import { shareText } from '../lib/share';

function hashIndex(key: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash % length;
}

export function Affirmations() {
  const { favoriteAffirmations, toggleFavoriteAffirmation } = useApp();
  const [index, setIndex] = useState(() => hashIndex(todayKey(), AFFIRMATIONS.length));
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const current = AFFIRMATIONS[index];
  const isFavorite = favoriteAffirmations.includes(current);

  function next() {
    setIndex((i) => (i + 1) % AFFIRMATIONS.length);
  }

  function prev() {
    setIndex((i) => (i - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length);
  }

  async function handleShare() {
    const outcome = await shareText('Sérénité', current);
    if (outcome === 'copied') {
      setShareNotice('Copié ✓');
      setTimeout(() => setShareNotice(null), 2000);
    }
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Affirmations" subtitle="Une phrase à te répéter, à ton rythme" />

      <div className="px-5">
        <Card className="flex min-h-[220px] flex-col items-center justify-center text-center text-white" style={sageGradient}>
          <p className="font-serif text-2xl italic leading-relaxed">"{current}"</p>
          {shareNotice && <p className="mt-3 text-[11px] text-white/80">{shareNotice}</p>}
        </Card>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={prev}
            aria-label="Précédente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-lg text-ink"
          >
            ‹
          </button>
          <button
            onClick={() => toggleFavoriteAffirmation(current)}
            aria-label="Ajouter aux favoris"
            className={`flex h-11 w-11 items-center justify-center rounded-full text-lg transition-colors ${
              isFavorite ? 'bg-clay/15 text-clay' : 'border border-line bg-card text-ink-faint'
            }`}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
          <button
            onClick={handleShare}
            aria-label="Partager"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-lg text-ink-faint"
          >
            ⤴
          </button>
          <button
            onClick={next}
            aria-label="Suivante"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-lg text-ink"
          >
            ›
          </button>
        </div>

        {favoriteAffirmations.length > 0 && (
          <>
            <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
              Favorites
            </p>
            <div className="flex flex-col gap-2.5">
              {favoriteAffirmations.map((text) => (
                <Card key={text} className="flex items-center gap-3 py-3">
                  <p className="flex-1 text-[13px] italic text-ink-soft">"{text}"</p>
                  <button
                    onClick={() => toggleFavoriteAffirmation(text)}
                    aria-label="Retirer des favoris"
                    className="flex-shrink-0 text-clay"
                  >
                    ♥
                  </button>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
