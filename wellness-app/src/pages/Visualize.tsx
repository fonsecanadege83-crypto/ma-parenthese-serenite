import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { VISUALIZATIONS, type Visualization } from '../lib/visualizations';
import { isSpeechSupported, speak, stopSpeaking, pauseSpeaking, resumeSpeaking } from '../lib/speech';

export function Visualize() {
  const { logSession } = useApp();
  const [active, setActive] = useState<Visualization | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(isSpeechSupported());
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const loggedRef = useRef(false);

  const step = active?.steps[index];
  const totalSeconds = active ? active.steps.reduce((a, s) => a + s.seconds, 0) : 0;
  const elapsed = active
    ? active.steps.slice(0, index).reduce((a, s) => a + s.seconds, 0) + ((step?.seconds ?? 0) - secondsLeft)
    : 0;
  const progress = totalSeconds ? elapsed / totalSeconds : 0;

  useEffect(() => stopSpeaking, []);

  useEffect(() => {
    if (!active || !running || !step) return;
    if (secondsLeft <= 0) {
      if (index + 1 >= active.steps.length) {
        setRunning(false);
        setDone(true);
        stopSpeaking();
        if (!loggedRef.current) {
          loggedRef.current = true;
          logSession('meditation', Math.max(1, Math.round(totalSeconds / 60)));
        }
        return;
      }
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setSecondsLeft(active.steps[nextIndex].seconds);
      if (voiceEnabled) speak(active.steps[nextIndex].text);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [active, running, secondsLeft, index, step, voiceEnabled, logSession, totalSeconds]);

  function open(viz: Visualization) {
    setActive(viz);
    setIndex(0);
    setSecondsLeft(viz.steps[0].seconds);
    setDone(false);
    setRunning(false);
    loggedRef.current = false;
  }

  function start() {
    if (!active) return;
    setRunning(true);
    if (voiceEnabled) speak(active.steps[index].text);
  }

  function pause() {
    setRunning(false);
    pauseSpeaking();
  }

  function resume() {
    setRunning(true);
    resumeSpeaking();
  }

  function backToList() {
    stopSpeaking();
    setRunning(false);
    setActive(null);
  }

  function toggleVoice() {
    const next = !voiceEnabled;
    if (!next) stopSpeaking();
    setVoiceEnabled(next);
  }

  if (!active) {
    return (
      <div className="animate-fade-up">
        <PageHeader title="Visualisations guidées" subtitle="Une évasion mentale, guidée pas à pas et à voix haute" />
        <div className="flex flex-col gap-3 px-5">
          {VISUALIZATIONS.map((viz) => (
            <button key={viz.id} onClick={() => open(viz)} className="block w-full text-left">
              <Card className="flex items-center gap-4 transition-transform active:scale-[0.98]">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-sage/12 text-2xl">
                  {viz.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[17px] text-ink">{viz.title}</p>
                  <p className="truncate text-[12px] text-ink-faint">{viz.description}</p>
                </div>
                <span className="text-ink-faint">›</span>
              </Card>
            </button>
          ))}
          {!isSpeechSupported() && (
            <p className="px-1 text-[11px] text-ink-faint">
              La narration vocale n'est pas disponible sur ce navigateur — les visualisations restent utilisables en lecture silencieuse.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 px-5 pt-12">
        <button
          onClick={backToList}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line bg-card text-ink"
        >
          ‹
        </button>
        <h1 className="font-serif text-xl text-ink">{active.title}</h1>
      </div>

      <div className="px-5 pt-4">
        <Card className="flex flex-col items-center py-8">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-soft">
            <div
              className="h-full rounded-full bg-sage-dark transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="mt-6 text-5xl">{active.icon}</span>
          <p className="mt-5 min-h-[80px] text-center font-serif text-lg italic leading-relaxed text-ink">
            {done ? 'La visualisation est terminée. Prends un instant avant de continuer.' : step?.text}
          </p>

          {!done && (
            <div className="mt-5 flex gap-3">
              {running ? (
                <button
                  onClick={pause}
                  className="rounded-full border border-line px-7 py-3 text-sm font-medium text-ink"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={secondsLeft === step?.seconds && index === 0 ? start : resume}
                  className="rounded-full bg-sage-dark px-7 py-3 text-sm font-medium text-white"
                >
                  {index === 0 && secondsLeft === step?.seconds ? 'Commencer' : 'Reprendre'}
                </button>
              )}
            </div>
          )}
          {done && (
            <button
              onClick={() => open(active)}
              className="mt-2 rounded-full border border-sage px-5 py-2.5 text-[13px] font-medium text-sage-dark"
            >
              Recommencer
            </button>
          )}

          {!done && (
            <p className="mt-3 text-[11px] text-ink-faint">
              Étape {index + 1} / {active.steps.length}
            </p>
          )}
        </Card>

        {isSpeechSupported() && (
          <button
            onClick={toggleVoice}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-line px-4 py-3 text-[13px] text-ink-soft"
          >
            <span className="text-lg">{voiceEnabled ? '🔊' : '🔇'}</span>
            {voiceEnabled ? 'Voix activée' : 'Voix coupée — lecture silencieuse'}
          </button>
        )}
      </div>
    </div>
  );
}
