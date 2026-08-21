import { useState } from 'react';
import { PageHeader } from '../components/Layout';
import { Card } from '../components/Card';
import { RESOURCE_CATEGORIES } from '../lib/resources';

export function Resources() {
  const [activeCategory, setActiveCategory] = useState(RESOURCE_CATEGORIES[0].id);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const category = RESOURCE_CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="animate-fade-up">
      <PageHeader title="Ressources" subtitle="De courts conseils à picorer selon ce dont tu as besoin" />

      <div className="flex gap-2 overflow-x-auto px-5 pb-1">
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

      <div className="mt-4 flex flex-col gap-3 px-5">
        {category.items.map((item) => {
          const open = openItem === item.id;
          return (
            <Card key={item.id} className="py-4">
              <button
                onClick={() => setOpenItem(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <p className="font-serif text-[16px] text-ink">{item.title}</p>
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
