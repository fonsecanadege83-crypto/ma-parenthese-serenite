export type SoundId = 'rain' | 'ocean' | 'wind' | 'fire';

export interface SoundMeta {
  id: SoundId;
  label: string;
  icon: string;
}

export const SOUNDS: SoundMeta[] = [
  { id: 'rain', label: 'Pluie', icon: '🌧️' },
  { id: 'ocean', label: 'Océan', icon: '🌊' },
  { id: 'wind', label: 'Vent', icon: '🍃' },
  { id: 'fire', label: 'Feu de camp', icon: '🔥' },
];

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return sharedCtx;
}

const BUFFER_SECONDS = 4;

function makeNoiseBuffer(ctx: AudioContext, colorize: () => (white: number) => number): AudioBuffer {
  const sr = ctx.sampleRate;
  const length = sr * BUFFER_SECONDS;
  const buffer = ctx.createBuffer(1, length, sr);
  const data = buffer.getChannelData(0);
  const filter = colorize();
  for (let i = 0; i < length; i++) {
    data[i] = filter(Math.random() * 2 - 1);
  }
  return buffer;
}

/** Classic leaky-integrator brown noise. */
function brownFilter() {
  let last = 0;
  return (white: number) => {
    last = (last + 0.02 * white) / 1.02;
    return last * 3.5;
  };
}

/** Paul Kellet's refined pink noise approximation. */
function pinkFilter() {
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  return (white: number) => {
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const out = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    return out * 0.11;
  };
}

interface Handle {
  stop: () => void;
  setVolume: (v: number) => void;
}

function startLoop(
  ctx: AudioContext,
  buffer: AudioBuffer,
  build: (source: AudioBufferSourceNode, out: GainNode) => AudioNode,
  volume: number,
): Handle {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  const chainEnd = build(source, gain);
  chainEnd.connect(ctx.destination);
  source.start();

  return {
    stop: () => {
      try {
        source.stop();
      } catch {
        // already stopped
      }
      source.disconnect();
      gain.disconnect();
    },
    setVolume: (v: number) => {
      gain.gain.setTargetAtTime(v, ctx.currentTime, 0.15);
    },
  };
}

export function playSound(id: SoundId, volume: number): Handle {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  switch (id) {
    case 'rain': {
      const buffer = makeNoiseBuffer(ctx, pinkFilter);
      return startLoop(
        ctx,
        buffer,
        (source, gain) => {
          const band = ctx.createBiquadFilter();
          band.type = 'bandpass';
          band.frequency.value = 2200;
          band.Q.value = 0.6;
          source.connect(band);
          band.connect(gain);
          return gain;
        },
        volume,
      );
    }
    case 'ocean': {
      const buffer = makeNoiseBuffer(ctx, brownFilter);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const low = ctx.createBiquadFilter();
      low.type = 'lowpass';
      low.frequency.value = 500;
      const gain = ctx.createGain();
      gain.gain.value = volume;

      // Slow amplitude swell to mimic waves rolling in and out.
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.12;
      lfoGain.gain.value = volume * 0.4;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      source.connect(low);
      low.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      lfo.start();

      return {
        stop: () => {
          try {
            source.stop();
            lfo.stop();
          } catch {
            // already stopped
          }
          source.disconnect();
          low.disconnect();
          gain.disconnect();
          lfo.disconnect();
          lfoGain.disconnect();
        },
        setVolume: (v: number) => {
          gain.gain.setTargetAtTime(v, ctx.currentTime, 0.15);
          lfoGain.gain.setTargetAtTime(v * 0.4, ctx.currentTime, 0.15);
        },
      };
    }
    case 'wind': {
      const buffer = makeNoiseBuffer(ctx, pinkFilter);
      return startLoop(
        ctx,
        buffer,
        (source, gain) => {
          const band = ctx.createBiquadFilter();
          band.type = 'bandpass';
          band.frequency.value = 500;
          band.Q.value = 0.5;
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.08;
          lfoGain.gain.value = 250;
          lfo.connect(lfoGain);
          lfoGain.connect(band.frequency);
          lfo.start();
          source.connect(band);
          band.connect(gain);
          return gain;
        },
        volume,
      );
    }
    case 'fire': {
      const buffer = makeNoiseBuffer(ctx, brownFilter);
      const handle = startLoop(
        ctx,
        buffer,
        (source, gain) => {
          const low = ctx.createBiquadFilter();
          low.type = 'lowpass';
          low.frequency.value = 300;
          source.connect(low);
          low.connect(gain);
          return gain;
        },
        volume,
      );
      // Random higher-frequency crackle bursts layered on top of the rumble.
      let cancelled = false;
      const scheduleCrackle = () => {
        if (cancelled) return;
        const delay = 120 + Math.random() * 500;
        setTimeout(() => {
          if (cancelled) return;
          const dur = 0.03 + Math.random() * 0.05;
          const crackleBuffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
          const data = crackleBuffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
          const src = ctx.createBufferSource();
          src.buffer = crackleBuffer;
          const hp = ctx.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 1500;
          const g = ctx.createGain();
          g.gain.value = volume * (0.4 + Math.random() * 0.5);
          src.connect(hp);
          hp.connect(g);
          g.connect(ctx.destination);
          src.start();
          scheduleCrackle();
        }, delay);
      };
      scheduleCrackle();
      const originalStop = handle.stop;
      handle.stop = () => {
        cancelled = true;
        originalStop();
      };
      return handle;
    }
  }
}
