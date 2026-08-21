export const QUOTES: string[] = [
  "Respire. Tu n'as pas besoin de tout porter aujourd'hui.",
  "Un petit pas vers toi-même vaut mieux qu'aucun.",
  "Le calme n'est pas l'absence de tempête, c'est la paix au milieu.",
  "Prends soin de ton esprit comme tu prendrais soin d'un ami.",
  "Chaque instant de pause est un cadeau que tu te fais.",
  "Tu fais de ton mieux, et c'est déjà beaucoup.",
  "La douceur envers soi-même est une force, pas une faiblesse.",
  "Ce que tu ressens est valide. Accueille-le, puis relâche.",
  "Aujourd'hui, une seule chose à la fois suffit.",
  "Ton bien-être n'est pas un luxe, c'est une nécessité.",
];

export function quoteOfDay(dateKey: string): string {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  return QUOTES[hash % QUOTES.length];
}
