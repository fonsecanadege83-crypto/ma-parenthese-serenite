let frenchVoice: SpeechSynthesisVoice | null = null;

function loadVoices() {
  if (!isSpeechSupported()) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    frenchVoice = voices.find((v) => v.lang.toLowerCase().startsWith('fr')) ?? voices[0] ?? null;
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

if (isSpeechSupported()) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function speak(text: string): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  if (frenchVoice) utter.voice = frenchVoice;
  utter.lang = 'fr-FR';
  utter.rate = 0.92;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

export function pauseSpeaking(): void {
  if (isSpeechSupported() && window.speechSynthesis.speaking) window.speechSynthesis.pause();
}

export function resumeSpeaking(): void {
  if (isSpeechSupported() && window.speechSynthesis.paused) window.speechSynthesis.resume();
}
