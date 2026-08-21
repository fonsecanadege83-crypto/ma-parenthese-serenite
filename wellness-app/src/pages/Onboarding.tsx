import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';

export function Onboarding() {
  const { completeOnboarding } = useApp();
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    completeOnboarding(name);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <div className="mb-8 flex flex-col items-center gap-1.5">
        <div className="h-14 w-14 rounded-full bg-sage/15" />
        <div className="-mt-9 h-10 w-10 rounded-full bg-sage/25" />
        <div className="-mt-6 h-6 w-6 rounded-full bg-sage" />
      </div>
      <h1 className="font-serif text-3xl leading-tight text-ink">
        Bienvenue dans ta <em className="text-sage-dark not-italic font-serif italic">parenthèse</em>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Un espace simple pour prendre soin de toi, jour après jour : respiration, méditation,
        humeur et journal de gratitude.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-xs">
        <label className="mb-2 block text-left text-[11px] font-semibold uppercase tracking-wider text-sage-dark">
          Comment veux-tu qu'on t'appelle ?
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(false);
          }}
          placeholder="Ton prénom"
          className="w-full rounded-2xl border border-line bg-card px-4 py-3.5 text-[15px] text-ink outline-none transition-colors focus:border-sage"
        />
        {error && <p className="mt-1.5 text-left text-xs text-clay">Dis-nous comment t'appeler pour continuer.</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-sage-dark py-4 font-serif text-lg text-white shadow-[0_6px_20px_rgba(94,112,83,0.3)] transition-transform active:scale-[0.98]"
        >
          Commencer
        </button>
      </form>
    </div>
  );
}
