import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { SOUNDS, playSound, type SoundId } from '../lib/ambientSound';

const DEFAULT_VOLUME = 0.5;

export function Sounds() {
  const [active, setActive] = useState<Set<SoundId>>(new Set());
  const [volumes, setVolumes] = useState<Record<SoundId, number>>({
    rain: DEFAULT_VOLUME,
    ocean: DEFAULT_VOLUME,
    wind: DEFAULT_VOLUME,
    fire: DEFAULT_VOLUME,
  });
  const handles = useRef<Partial<Record<SoundId, { stop: () => void; setVolume: (v: number) => void }>>>({});

  useEffect(() => {
    return () => {
      Object.values(handles.current).forEach((h) => h?.stop());
    };
  }, []);

  function toggle(id: SoundId) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        handles.current[id]?.stop();
        delete handles.current[id];
      } else {
        next.add(id);
        handles.current[id] = playSound(id, volumes[id]);
      }
      return next;
    });
  }

  function changeVolume(id: SoundId, v: number) {
    setVolumes((prev) => ({ ...prev, [id]: v }));
    handles.current[id]?.setVolume(v);
  }

  function stopAll() {
    Object.values(handles.current).forEach((h) => h?.stop());
    handles.current = {};
    setActive(new Set());
  }

  return (
    <div className="animate-fade-up">
      <PageHeader title="Sons ambiants" subtitle="Compose ton propre paysage sonore apaisant" />

      <div className="px-5">
        <div className="flex flex-col gap-3">
          {SOUNDS.map((s) => {
            const isOn = active.has(s.id);
            return (
              <Card key={s.id} className={isOn ? 'border border-sage/40' : undefined}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggle(s.id)}
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-2xl transition-colors ${
                      isOn ? 'bg-sage-dark text-white' : 'bg-bg-soft'
                    }`}
                  >
                    {s.icon}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[17px] text-ink">{s.label}</p>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volumes[s.id]}
                      disabled={!isOn}
                      onChange={(e) => changeVolume(s.id, parseFloat(e.target.value))}
                      className="mt-2 w-full accent-sage-dark disabled:opacity-30"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {active.size > 0 && (
          <button
            onClick={stopAll}
            className="mt-5 w-full rounded-full border border-line py-3 text-sm font-medium text-ink-faint transition-transform active:scale-[0.98]"
          >
            Tout arrêter
          </button>
        )}

        <Card className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sage-dark">Astuce</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
            Combine plusieurs sons — pluie et feu de camp, ou vent et océan — pour créer une
            ambiance sur mesure pendant ta méditation ou avant de t'endormir.
          </p>
        </Card>
      </div>
    </div>
  );
}
