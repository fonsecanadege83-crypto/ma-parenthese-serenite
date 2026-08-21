import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { playChime } from '../lib/chime';

const PRESETS = [3, 5, 10, 15, 20];

export function Meditate() {
  const { logSession } = useApp();
  const [duration, setDuration] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      setDone(true);
      playChime();
      if (!loggedRef.current) {
        loggedRef.current = true;
        logSession('meditation', duration);
      }
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, secondsLeft, duration, logSession]);

  function selectDuration(min: number) {
    if (running) return;
    setDuration(min);
    setSecondsLeft(min * 60);
    setDone(false);
  }

  function start() {
    loggedRef.current = false;
    setDone(false);
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setDone(false);
    setSecondsLeft(duration * 60);
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = 1 - secondsLeft / (duration * 60);

  return (
    <div className="animate-fade-up">
      <PageHeader title="Méditer" subtitle="Choisis une durée et laisse le silence faire son travail" />

      <div className="px-5">
        <Card className="flex flex-col items-center py-8">
          <div className="relative flex h-52 w-52 items-center justify-center">
            <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--color-bg-soft)" strokeWidth="10" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="var(--color-sage)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="text-center">
              <p className="font-serif text-4xl text-ink">
                {mins}:{String(secs).padStart(2, '0')}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-widest text-ink-faint">
                {done ? 'Terminé' : running ? 'En cours' : 'Prêt'}
              </p>
            </div>
          </div>

          <div className="mt-7 flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => selectDuration(p)}
                disabled={running}
                className={`rounded-full px-3.5 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${
                  duration === p ? 'bg-sage-dark text-white' : 'bg-bg-soft text-ink-soft'
                }`}
              >
                {p} min
              </button>
            ))}
          </div>

          <div className="mt-7 flex gap-3">
            {!running ? (
              <button
                onClick={start}
                className="rounded-full bg-sage-dark px-8 py-3.5 font-serif text-lg text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-95"
              >
                {secondsLeft === duration * 60 ? 'Commencer' : 'Reprendre'}
              </button>
            ) : (
              <button
                onClick={pause}
                className="rounded-full border border-line px-8 py-3.5 font-serif text-lg text-ink transition-transform active:scale-95"
              >
                Pause
              </button>
            )}
            {secondsLeft !== duration * 60 && (
              <button
                onClick={reset}
                className="rounded-full px-5 py-3.5 text-sm text-ink-faint transition-transform active:scale-95"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </Card>

        {done && (
          <Card className="mt-4 bg-sage/10">
            <p className="font-serif text-lg italic text-sage-dark">Séance terminée 🌿</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              {duration} minute{duration > 1 ? 's' : ''} de calme, bien méritées.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
