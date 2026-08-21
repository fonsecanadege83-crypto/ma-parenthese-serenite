export interface GroundingStep {
  count: number;
  sense: string;
  icon: string;
  prompt: string;
}

export const GROUNDING_STEPS: GroundingStep[] = [
  { count: 5, sense: 'vois', icon: '👁️', prompt: 'Nomme 5 choses que tu peux voir autour de toi' },
  { count: 4, sense: 'entends', icon: '👂', prompt: 'Nomme 4 choses que tu peux entendre' },
  { count: 3, sense: 'touches', icon: '✋', prompt: 'Nomme 3 choses que tu peux toucher' },
  { count: 2, sense: 'sens', icon: '👃', prompt: 'Nomme 2 choses que tu peux sentir' },
  { count: 1, sense: 'goûtes', icon: '👅', prompt: 'Nomme 1 chose que tu peux goûter' },
];

export const SOS_PHRASES: string[] = [
  'Ça va passer. Ce que tu ressens est temporaire.',
  'Tu es en sécurité, ici, maintenant.',
  "Une chose à la fois — tu n'as pas besoin de tout gérer d'un coup.",
  'Ton corps sait comment se calmer. Laisse-le faire.',
  "Tu as déjà traversé des moments difficiles avant celui-ci.",
  'Respire. Ce sentiment ne te définit pas.',
];
