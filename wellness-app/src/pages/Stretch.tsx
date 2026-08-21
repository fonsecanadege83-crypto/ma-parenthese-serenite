import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { STRETCHES } from '../lib/stretches';
import { playChime } from '../lib/chime';

export function Stretch() {
  const { logSession } = useApp();
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(STRETCHES[0].seconds);
  const [done, setDone] = useState(false);
  const loggedRef = useRef(false);

  const current = STRETCHES[index];
  const totalSeconds = STRETCHES.reduce((a, s) => a + s.seconds, 0);
  const elapsed = STRETCHES.slice(0, index).reduce((a, s) => a + s.seconds, 0) + (current.seconds - secondsLeft);
  const progress = elapsed / totalSeconds;

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      if (index + 1 >= STRETCHES.length) {
        setRunning(false);
        setDone(true);
        playChime();
        if (!loggedRef.current) {
          loggedRef.current = true;
          logSession('stretching', Math.max(1, Math.round(totalSeconds / 60)));
        }
        return;
      }
      setIndex((i) => i + 1);
      setSecondsLeft(STRETCHES[index + 1].seconds);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, secondsLeft, index, logSession, totalSeconds]);

  function start() {
    loggedRef.current = false;
    setDone(false);
    setIndex(0);
    setSecondsLeft(STRETCHES[0].seconds);
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function resume() {
    setRunning(true);
  }

  const notStarted = !running && !done && index === 0 && secondsLeft === STRETCHES[0].seconds;

  return (
    <div className="animate-fade-up">
      <PageHeader title="Étirements" subtitle="Une courte séquence pour relâcher les tensions du corps" />

      <div className="px-5">
        {notStarted && (
          <Card>
            <p className="font-serif text-[18px] text-ink">
              {STRETCHES.length} mouvements doux · environ {Math.round(totalSeconds / 60)} minutes
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {STRETCHES.map((s) => (
                <li key={s.name} className="flex items-center gap-3 text-[13px] text-ink-soft">
                  <span className="text-lg">{s.icon}</span>
                  {s.name}
                </li>
              ))}
            </ul>
            <button
              onClick={start}
              className="mt-4 w-full rounded-full bg-sage-dark py-3.5 font-serif text-lg text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-[0.98]"
            >
              Commencer
            </button>
          </Card>
        )}

        {!notStarted && !done && (
          <Card className="flex flex-col items-center py-8">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-soft">
              <div
                className="h-full rounded-full bg-sage-dark transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="mt-6 text-5xl">{current.icon}</span>
            <p className="mt-4 text-center font-serif text-xl text-ink">{current.name}</p>
            <p className="mt-2 text-center text-[13px] leading-relaxed text-ink-soft">
              {current.instruction}
            </p>
            <p className="mt-5 font-serif text-4xl text-sage-dark">{secondsLeft}s</p>

            <div className="mt-6 flex gap-3">
              {running ? (
                <button
                  onClick={pause}
                  className="rounded-full border border-line px-7 py-3 text-sm font-medium text-ink"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={resume}
                  className="rounded-full bg-sage-dark px-7 py-3 text-sm font-medium text-white"
                >
                  Reprendre
                </button>
              )}
            </div>
            <p className="mt-3 text-[11px] text-ink-faint">
              Mouvement {index + 1} / {STRETCHES.length}
            </p>
          </Card>
        )}

        {done && (
          <Card className="bg-sage/10">
            <p className="font-serif text-lg italic text-sage-dark">Bien joué 🌿</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              Ton corps te remercie pour ce moment de détente.
            </p>
            <button
              onClick={start}
              className="mt-3 rounded-full border border-sage px-5 py-2.5 text-[13px] font-medium text-sage-dark"
            >
              Recommencer
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
