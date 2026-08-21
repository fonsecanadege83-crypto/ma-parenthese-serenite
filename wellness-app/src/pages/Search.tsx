import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { searchAll } from '../lib/search';
import { formatFrShort } from '../lib/date';

export function Search() {
  const { journal, emotions, thoughtRecords, letters, goals } = useApp();
  const [query, setQuery] = useState('');

  const results = searchAll(query, { journal, emotions, thoughtRecords, letters, goals });

  return (
    <div className="animate-fade-up">
      <PageHeader title="Recherche" subtitle="Retrouve ce que tu as déjà écrit ou exploré" />

      <div className="px-5">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher dans le journal, les émotions, les lettres…"
          className="w-full rounded-2xl border border-line bg-card px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
        />

        {query.trim() && (
          <p className="mb-2 mt-4 px-1 text-[11px] font-semibold uppercase tracking-widest text-sage-dark">
            {results.length} résultat{results.length !== 1 ? 's' : ''}
          </p>
        )}

        {query.trim() && results.length === 0 && (
          <Card className="mt-2">
            <p className="text-center text-[13px] italic text-ink-faint">
              Rien ne correspond à "{query}"
            </p>
          </Card>
        )}

        <div className="flex flex-col gap-2.5">
          {results.map((r) => (
            <Link key={`${r.type}-${r.id}`} to={r.to} className="block">
              <Card className="py-3.5 transition-transform active:scale-[0.98]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{r.icon}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-dark">
                    {r.typeLabel}
                  </span>
                  {r.date && (
                    <span className="ml-auto text-[11px] text-ink-faint">{formatFrShort(r.date)}</span>
                  )}
                </div>
                <p className="mt-1.5 truncate text-[14px] font-medium text-ink">{r.title}</p>
                {r.snippet && r.snippet !== r.title && (
                  <p className="truncate text-[12px] text-ink-faint">{r.snippet}</p>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {!query.trim() && (
          <p className="mt-6 px-1 text-center text-[13px] italic text-ink-faint">
            Cherche dans ton journal, tes émotions notées, tes fiches de restructuration
            cognitive, tes lettres déverrouillées, tes objectifs et les ressources. 🔍
          </p>
        )}
      </div>
    </div>
  );
}
