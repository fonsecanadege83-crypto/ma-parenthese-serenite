const PREFIX = 'serenite:';

export function loadValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveValue<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

/** Snapshot of every serenite: key, keyed without the prefix. */
export function exportAll(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const fullKey = localStorage.key(i);
    if (!fullKey || !fullKey.startsWith(PREFIX)) continue;
    try {
      out[fullKey.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(fullKey) ?? 'null');
    } catch {
      // skip unreadable entry
    }
  }
  return out;
}

/** Restores a snapshot produced by exportAll(), overwriting existing keys. */
export function importAll(data: Record<string, unknown>): void {
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  });
}
