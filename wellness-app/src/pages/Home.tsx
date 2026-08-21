import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, sageGradient } from '../components/Card';
import { formatFrDate, todayKey } from '../lib/date';
import { quoteOfDay } from '../lib/quotes';
import { shareText } from '../lib/share';
import { MOOD_META, MOOD_ORDER, type MoodValue } from '../lib/types';

export function Home() {
  const { profile, todayMood, setTodayMood, streak, journal, habits, todayHabitIds } = useApp();
  const today = todayKey();
  const dateLabel = formatFrDate(today);
  const quote = quoteOfDay(today);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  async function handleShareQuote() {
    const outcome = await shareText('Sérénité', quote);
    if (outcome === 'copied') {
      setShareNotice('Copié dans le presse-papiers ✓');
      setTimeout(() => setShareNotice(null), 2500);
    } else if (outcome === 'failed') {
      setShareNotice("Impossible de partager pour l'instant");
      setTimeout(() => setShareNotice(null), 2500);
    }
  }

  return (
    <div className="animate-fade-up px-5 pt-12">
      <p className="text-sm text-ink-soft">Bonjour {profile?.name || ''} 👋</p>
      <h1 className="mt-0.5 font-serif text-[26px] capitalize text-ink">{dateLabel}</h1>

      <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-1">
        {MOOD_ORDER.map((m) => (
          <MoodChip key={m} mood={m} selected={todayMood === m} onSelect={setTodayMood} />
        ))}
      </div>

      <Card className="mt-5 text-white" style={sageGradient}>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
            Pensée du jour
          </p>
          <button
            onClick={handleShareQuote}
            aria-label="Partager la pensée du jour"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[13px] text-white transition-colors active:bg-white/25"
          >
            ⤴
          </button>
        </div>
        <p className="mt-2 font-serif text-lg italic leading-relaxed">"{quote}"</p>
        {shareNotice && <p className="mt-2 text-[11px] text-white/80">{shareNotice}</p>}
      </Card>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatTile label="Série en cours" value={`${streak} j`} icon="🔥" />
        <StatTile label="Journal" value={`${journal.length}`} icon="📔" />
        <StatTile label="Habitudes" value={`${todayHabitIds.length}/${habits.length}`} icon="🌱" />
      </div>

      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
        Prendre un instant
      </p>
      <div className="flex flex-col gap-3">
        <QuickLink
          to="/respirer"
          emoji="🌬️"
          title="Respirer"
          subtitle="Un cycle guidé de 2 minutes pour relâcher la tension"
        />
        <QuickLink
          to="/mediter"
          emoji="🌙"
          title="Méditer"
          subtitle="Choisis une durée et laisse-toi porter par le silence"
        />
        <QuickLink
          to="/journal"
          emoji="📔"
          title="Journal de gratitude"
          subtitle="Note ce qui compte aujourd’hui"
        />
      </div>

      <p className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
        Explorer
      </p>
      <div className="flex flex-col gap-3">
        <QuickLink
          to="/habitudes"
          emoji="🌱"
          title="Habitudes"
          subtitle="Suis tes petites routines bien-être au quotidien"
        />
        <QuickLink
          to="/sons"
          emoji="🎵"
          title="Sons ambiants"
          subtitle="Pluie, océan, vent ou feu de camp pour t'apaiser"
        />
        <QuickLink
          to="/ressources"
          emoji="💡"
          title="Ressources"
          subtitle="Des conseils courts sur le sommeil, le stress et plus"
        />
      </div>
    </div>
  );
}

function MoodChip({
  mood,
  selected,
  onSelect,
}: {
  mood: MoodValue;
  selected: boolean;
  onSelect: (m: MoodValue) => void;
}) {
  const meta = MOOD_META[mood];
  return (
    <button
      onClick={() => onSelect(mood)}
      className={`flex flex-shrink-0 flex-col items-center gap-1.5 rounded-2xl px-3.5 py-2.5 transition-colors ${
        selected ? 'bg-sage/15' : ''
      }`}
    >
      <span className="text-2xl leading-none">{meta.emoji}</span>
      <span className={`text-[10px] font-medium ${selected ? 'text-sage-dark' : 'text-ink-faint'}`}>
        {meta.label}
      </span>
    </button>
  );
}

function StatTile({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <Card className="flex items-center gap-3 py-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-serif text-xl text-ink">{value}</p>
        <p className="text-[11px] text-ink-faint">{label}</p>
      </div>
    </Card>
  );
}

function QuickLink({
  to,
  emoji,
  title,
  subtitle,
}: {
  to: string;
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link to={to} className="block">
      <Card className="flex items-center gap-4 transition-transform active:scale-[0.98]">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-sage/12 text-2xl">
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-[17px] text-ink">{title}</p>
          <p className="truncate text-[12px] text-ink-faint">{subtitle}</p>
        </div>
        <span className="text-ink-faint">›</span>
      </Card>
    </Link>
  );
}
