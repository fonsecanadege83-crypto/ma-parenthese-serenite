import { useRef, useState, type ChangeEvent } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { lastNDays, formatFrShort, todayKey } from '../lib/date';
import { exportAll, importAll } from '../lib/storage';
import { MOOD_META, type ThemeMode } from '../lib/types';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'light', label: 'Clair', icon: '☀️' },
  { mode: 'dark', label: 'Sombre', icon: '🌙' },
  { mode: 'system', label: 'Système', icon: '⚙️' },
];

export function Profile() {
  const { profile, streak, totalMinutes, sessions, journal, moods, theme, setTheme, resetAll } =
    useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleExport() {
    const data = exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serenite-sauvegarde-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('invalid');
        importAll(data);
        setImportStatus('ok');
        window.location.reload();
      } catch {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
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

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">Apparence</p>
          <div className="mt-3 flex gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.mode}
                onClick={() => setTheme(opt.mode)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border py-3 text-[11px] font-medium transition-colors ${
                  theme === opt.mode
                    ? 'border-sage bg-sage/10 text-sage-dark'
                    : 'border-line text-ink-faint'
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Sauvegarde
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            Tes données restent uniquement sur cet appareil. Exporte-les pour les garder en
            sécurité ou les transférer vers un autre appareil.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 rounded-full bg-sage-dark py-3 text-sm font-medium text-white"
            >
              Exporter
            </button>
            <button
              onClick={handleImportClick}
              className="flex-1 rounded-full border border-line py-3 text-sm font-medium text-ink-soft"
            >
              Importer
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
          {importStatus === 'error' && (
            <p className="mt-2 text-[12px] text-clay">Fichier invalide — vérifie qu'il s'agit bien d'une sauvegarde Sérénité.</p>
          )}
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
