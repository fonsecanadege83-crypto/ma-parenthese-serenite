import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card, sageGradient } from '../components/Card';
import { useApp } from '../context/AppContext';

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: { key: Phase; label: string; seconds: number; scale: number }[] = [
  { key: 'inhale', label: 'Inspire', seconds: 4, scale: 1 },
  { key: 'hold', label: 'Retiens', seconds: 4, scale: 1 },
  { key: 'exhale', label: 'Expire', seconds: 4, scale: 0.55 },
  { key: 'rest', label: 'Pause', seconds: 2, scale: 0.55 },
];

const TOTAL_CYCLES = 5;

export function Breathe() {
  const { logSession } = useApp();
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds);
  const [cycle, setCycle] = useState(0);
  const [done, setDone] = useState(false);
  const loggedRef = useRef(false);

  // Countdown ticker for the current phase.
  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, secondsLeft]);

  // Advance to the next phase once the countdown hits zero.
  useEffect(() => {
    if (!running || secondsLeft !== 0) return;
    const nextIdx = (phaseIdx + 1) % PHASES.length;
    const nextCycle = nextIdx === 0 ? cycle + 1 : cycle;

    if (nextIdx === 0 && nextCycle >= TOTAL_CYCLES) {
      setRunning(false);
      setDone(true);
      return;
    }
    setPhaseIdx(nextIdx);
    setCycle(nextCycle);
    setSecondsLeft(PHASES[nextIdx].seconds);
  }, [secondsLeft, running, phaseIdx, cycle]);

  useEffect(() => {
    if (done && !loggedRef.current) {
      loggedRef.current = true;
      const totalSeconds = PHASES.reduce((a, p) => a + p.seconds, 0) * TOTAL_CYCLES;
      logSession('breathing', Math.round(totalSeconds / 60) || 1);
    }
  }, [done, logSession]);

  function start() {
    setPhaseIdx(0);
    setSecondsLeft(PHASES[0].seconds);
    setCycle(0);
    setDone(false);
    loggedRef.current = false;
    setRunning(true);
  }

  function stop() {
    setRunning(false);
  }

  const phase = PHASES[phaseIdx];

  return (
    <div className="animate-fade-up">
      <PageHeader title="Respirer" subtitle="Une pause guidée pour relâcher la tension" />

      <div className="px-5">
        <Card className="flex flex-col items-center py-10 text-white" style={sageGradient}>
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-white/50 shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-transform ease-in-out"
            style={{
              transform: `scale(${running || done ? phase.scale : 0.7})`,
              transitionDuration: running ? `${phase.seconds}s` : '0.4s',
            }}
          >
            <div className="text-center">
              <p className="font-serif text-xl italic text-white/90">
                {done ? 'Bravo 🌿' : running ? phase.label : 'Prêt ?'}
              </p>
              {running && <p className="text-3xl font-semibold">{secondsLeft}</p>}
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] italic leading-relaxed text-white/80">
            {done
              ? 'Tu viens de compléter 5 cycles de respiration. Prends un instant avant de continuer.'
              : 'Inspire 4s · Retiens 4s · Expire 4s · Pause 2s — laisse ton corps suivre le rythme.'}
          </p>

          {!running && (
            <button
              onClick={start}
              className="mt-7 rounded-full bg-white/20 px-7 py-3 text-sm font-medium text-white backdrop-blur transition-transform active:scale-95"
            >
              {done ? 'Recommencer' : 'Commencer'}
            </button>
          )}
          {running && (
            <button
              onClick={stop}
              className="mt-7 rounded-full border border-white/40 px-7 py-3 text-sm font-medium text-white transition-transform active:scale-95"
            >
              Arrêter
            </button>
          )}
        </Card>

        {running && (
          <p className="mt-3 text-center text-xs text-ink-faint">
            Cycle {cycle + 1} / {TOTAL_CYCLES}
          </p>
        )}

        <Card className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            Pourquoi ça aide
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            La respiration en carré (box breathing) régule le système nerveux et abaisse le
            rythme cardiaque en quelques cycles. Pratiquée régulièrement, elle aide à mieux
            gérer le stress au quotidien.
          </p>
        </Card>
      </div>
    </div>
  );
}
