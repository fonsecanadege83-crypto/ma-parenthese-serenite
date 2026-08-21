export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatFrDate(dateKey: string): string {
  const d = new Date(dateKey + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatFrShort(dateKey: string): string {
  const d = new Date(dateKey + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00').getTime();
  const db = new Date(b + 'T00:00:00').getTime();
  return Math.round((da - db) / 86_400_000);
}

/** Consecutive-day streak ending today, given a set of activity date keys. */
export function computeStreak(dateKeys: string[]): number {
  const set = new Set(dateKeys);
  const today = todayKey();
  if (!set.has(today)) {
    // still counts if the streak ended yesterday, to avoid punishing before today's check-in
    const yesterday = shiftDate(today, -1);
    if (!set.has(yesterday)) return 0;
  }
  let streak = 0;
  let cursor = set.has(today) ? today : shiftDate(today, -1);
  while (set.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

export function shiftDate(dateKey: string, deltaDays: number): string {
  const d = new Date(dateKey + 'T00:00:00');
  d.setDate(d.getDate() + deltaDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function lastNDays(n: number): string[] {
  const today = todayKey();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(shiftDate(today, -i));
  return out;
}

export { daysBetween };

/** Hours slept between a bedtime and a wake time (HH:MM), assuming wake is the next morning if earlier than bedtime. */
export function sleepDurationHours(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let minutes = wh * 60 + wm - (bh * 60 + bm);
  if (minutes <= 0) minutes += 24 * 60;
  return Math.round((minutes / 60) * 10) / 10;
}
