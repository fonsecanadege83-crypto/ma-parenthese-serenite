import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/Layout';
import { Card, sageGradient } from '../components/Card';
import { GROUNDING_STEPS, SOS_PHRASES } from '../lib/grounding';

export function Sos() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [ticked, setTicked] = useState(0);
  const [done, setDone] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);

  const step = GROUNDING_STEPS[stepIndex];

  function start() {
    setStarted(true);
    setDone(false);
    setStepIndex(0);
    setTicked(0);
  }

  function tick() {
    const next = ticked + 1;
    if (next >= step.count) {
      if (stepIndex + 1 >= GROUNDING_STEPS.length) {
        setDone(true);
        setStarted(false);
      } else {
        setStepIndex(stepIndex + 1);
        setTicked(0);
      }
    } else {
      setTicked(next);
    }
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="SOS — Ancrage rapide" subtitle="Un coup de stress ? Prends une minute pour revenir au calme" />

      <div className="px-5">
        {!started && (
          <Card className="text-white" style={sageGradient}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
              Pensée immédiate
            </p>
            <p className="mt-2 font-serif text-lg italic leading-relaxed">
              "{SOS_PHRASES[phraseIdx]}"
            </p>
            <button
              onClick={() => setPhraseIdx((i) => (i + 1) % SOS_PHRASES.length)}
              className="mt-4 rounded-full bg-white/20 px-5 py-2.5 text-[13px] font-medium text-white"
            >
              Une autre pensée
            </button>
          </Card>
        )}

        {!started && !done && (
          <Card className="mt-4">
            <p className="font-serif text-[18px] text-ink">Technique 5-4-3-2-1</p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              Une technique d'ancrage sensoriel qui aide à sortir de la spirale des pensées en te
              reconnectant à ce qui t'entoure, là, maintenant.
            </p>
            <button
              onClick={start}
              className="mt-4 w-full rounded-full bg-sage-dark py-3.5 font-serif text-lg text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-[0.98]"
            >
              Commencer
            </button>
          </Card>
        )}

        {started && (
          <Card className="mt-4 flex flex-col items-center py-8">
            <span className="text-5xl">{step.icon}</span>
            <p className="mt-4 text-center font-serif text-xl text-ink">{step.prompt}</p>
            <div className="mt-6 flex gap-2">
              {Array.from({ length: step.count }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    i < ticked ? 'bg-sage-dark' : 'bg-bg-soft'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={tick}
              className="mt-7 rounded-full bg-sage-dark px-8 py-3.5 font-serif text-lg text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-95"
            >
              J'en ai trouvé un·e
            </button>
            <p className="mt-3 text-[11px] text-ink-faint">
              Étape {stepIndex + 1} / {GROUNDING_STEPS.length}
            </p>
          </Card>
        )}

        {done && (
          <Card className="mt-4 bg-sage/10">
            <p className="font-serif text-lg italic text-sage-dark">Bravo, tu es ancré·e 🌿</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              Prends un instant avant de reprendre le fil de ta journée.
            </p>
            <button
              onClick={start}
              className="mt-3 rounded-full border border-sage px-5 py-2.5 text-[13px] font-medium text-sage-dark"
            >
              Refaire l'exercice
            </button>
          </Card>
        )}

        <Link
          to="/respirer"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-3.5 text-[13px] text-ink-soft transition-colors active:bg-bg-soft"
        >
          <span className="text-lg">🌬️</span>
          Préférer une respiration guidée
          <span className="ml-auto text-ink-faint">›</span>
        </Link>
      </div>
    </div>
  );
}
