import { useMemo, useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { RESOURCE_CATEGORIES, type Resource } from '../lib/resources';

type SearchResult = Resource & { categoryLabel: string; categoryIcon: string };

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function Resources() {
  const [activeCategory, setActiveCategory] = useState(RESOURCE_CATEGORIES[0].id);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = normalize(query.trim());
    return RESOURCE_CATEGORIES.flatMap((cat) =>
      cat.items
        .filter((item) => normalize(item.title).includes(q) || normalize(item.body).includes(q))
        .map((item) => ({ ...item, categoryLabel: cat.label, categoryIcon: cat.icon })),
    );
  }, [query, isSearching]);

  const category = RESOURCE_CATEGORIES.find((c) => c.id === activeCategory)!;
  const visibleItems: (Resource | SearchResult)[] = isSearching ? searchResults : category.items;

  return (
    <div className="animate-fade-up">
      <PageHeader title="Ressources" subtitle="De courts conseils à picorer selon ce dont tu as besoin" />

      <div className="px-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un conseil…"
          className="w-full rounded-2xl border border-line bg-card px-4 py-3 text-[14px] text-ink outline-none focus:border-sage"
        />
      </div>

      {!isSearching && (
        <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
          {RESOURCE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCategory(c.id);
                setOpenItem(null);
              }}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                c.id === activeCategory ? 'bg-sage-dark text-white' : 'bg-card text-ink-soft'
              }`}
            >
              <span>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 px-5">
        {isSearching && visibleItems.length === 0 && (
          <Card>
            <p className="text-center text-[13px] italic text-ink-faint">
              Aucun conseil ne correspond à "{query}"
            </p>
          </Card>
        )}
        {visibleItems.map((item) => {
          const open = openItem === item.id;
          const categoryTag = 'categoryLabel' in item ? (item as SearchResult) : null;
          return (
            <Card key={item.id} className="py-4">
              <button
                onClick={() => setOpenItem(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <div>
                  {categoryTag && (
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-sage-dark">
                      {categoryTag.categoryIcon} {categoryTag.categoryLabel}
                    </p>
                  )}
                  <p className="font-serif text-[16px] text-ink">{item.title}</p>
                </div>
                <span className={`flex-shrink-0 text-ink-faint transition-transform ${open ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {open && <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{item.body}</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
