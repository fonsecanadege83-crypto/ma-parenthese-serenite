export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

/** Uses the native share sheet when available, otherwise copies to the clipboard. */
export async function shareText(title: string, text: string): Promise<ShareOutcome> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
      // fall through to clipboard as a best-effort fallback
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
