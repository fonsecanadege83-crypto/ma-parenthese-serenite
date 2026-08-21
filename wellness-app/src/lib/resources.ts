export interface Resource {
  id: string;
  title: string;
  body: string;
}

export interface ResourceCategory {
  id: string;
  label: string;
  icon: string;
  items: Resource[];
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'sommeil',
    label: 'Sommeil',
    icon: '🌙',
    items: [
      {
        id: 'sommeil-1',
        title: 'La règle des 3-2-1',
        body:
          "Arrête les écrans 3h avant de dormir, la nourriture lourde 2h avant, et le travail 1h avant. Ton corps a besoin de ce temps pour ralentir naturellement.",
      },
      {
        id: 'sommeil-2',
        title: 'Une chambre fraîche et sombre',
        body:
          "Une température autour de 18°C et l'obscurité totale favorisent la production de mélatonine. Un simple masque de nuit peut suffire à améliorer la qualité du sommeil.",
      },
      {
        id: 'sommeil-3',
        title: 'Le rituel du coucher',
        body:
          "Répéter les mêmes gestes chaque soir (lecture, respiration, tisane) envoie un signal clair à ton cerveau : c'est l'heure de se préparer au repos.",
      },
    ],
  },
  {
    id: 'stress',
    label: 'Stress & anxiété',
    icon: '🌊',
    items: [
      {
        id: 'stress-1',
        title: 'La technique du 5-4-3-2-1',
        body:
          "Nomme 5 choses que tu vois, 4 que tu entends, 3 que tu touches, 2 que tu sens, 1 que tu goûtes. Cet ancrage sensoriel calme l'esprit en quelques minutes.",
      },
      {
        id: 'stress-2',
        title: 'Écrire pour relâcher',
        body:
          "Mettre ses pensées sur papier, sans les filtrer, aide à sortir de la rumination. Tu n'as pas besoin de bien écrire — juste de vider ce qui pèse.",
      },
      {
        id: 'stress-3',
        title: 'Le pouvoir de l\'expiration longue',
        body:
          "Une expiration plus longue que l'inspiration active le système nerveux parasympathique. Essaie d'inspirer 4 secondes, d'expirer 6 à 8 secondes.",
      },
    ],
  },
  {
    id: 'relations',
    label: 'Relations',
    icon: '🤝',
    items: [
      {
        id: 'relations-1',
        title: 'Écouter sans réparer',
        body:
          "Face à une personne qui traverse une difficulté, résiste à l'envie de proposer une solution immédiate. Parfois, être simplement présent suffit.",
      },
      {
        id: 'relations-2',
        title: 'Le message en "je"',
        body:
          "Remplace \"tu ne m'écoutes jamais\" par \"je me sens mis·e de côté quand...\". Cela ouvre le dialogue au lieu de déclencher la défense.",
      },
      {
        id: 'relations-3',
        title: 'Prendre des nouvelles sans raison',
        body:
          "Un message simple à quelqu'un que tu apprécies, sans occasion particulière, renforce le lien et fait souvent plus de bien qu'on ne l'imagine — pour les deux.",
      },
    ],
  },
  {
    id: 'energie',
    label: 'Énergie & motivation',
    icon: '⚡',
    items: [
      {
        id: 'energie-1',
        title: 'La règle des 2 minutes',
        body:
          "Si une tâche prend moins de 2 minutes, fais-la tout de suite plutôt que de la reporter. Cela évite l'accumulation de petites charges mentales.",
      },
      {
        id: 'energie-2',
        title: 'Bouger avant de décider',
        body:
          "Quand la motivation manque, bouge d'abord (marche, étirement) — l'énergie et la clarté suivent souvent l'action, plus rarement l'inverse.",
      },
      {
        id: 'energie-3',
        title: 'Une seule priorité par matin',
        body:
          "Choisis une seule chose qui rendrait ta journée réussie si elle était faite. Le reste devient secondaire, et la charge mentale diminue.",
      },
    ],
  },
];
