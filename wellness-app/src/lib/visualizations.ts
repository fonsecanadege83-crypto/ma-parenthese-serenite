export interface VisualizationStep {
  text: string;
  seconds: number;
}

export interface Visualization {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: VisualizationStep[];
}

export const VISUALIZATIONS: Visualization[] = [
  {
    id: 'plage',
    title: 'Plage tranquille',
    icon: '🏖️',
    description: 'Une évasion mentale au bord de l\'eau pour relâcher les tensions.',
    steps: [
      { text: 'Installe-toi confortablement, ferme les yeux si tu le souhaites, et laisse ta respiration ralentir.', seconds: 12 },
      { text: 'Imagine-toi marchant pieds nus sur une plage de sable fin, chaud sous tes pieds.', seconds: 14 },
      { text: 'Le bruit des vagues qui vont et viennent, régulier, apaisant, rythme ta respiration.', seconds: 14 },
      { text: 'Une brise légère caresse ta peau, chargée du parfum salé de l\'océan.', seconds: 12 },
      { text: 'Tu t\'assois face à l\'horizon, et laisses ton regard se perdre dans le bleu infini.', seconds: 14 },
      { text: 'Reste ici encore un instant, dans ce calme. Puis, doucement, reviens à la pièce autour de toi.', seconds: 14 },
    ],
  },
  {
    id: 'foret',
    title: 'Forêt apaisante',
    icon: '🌲',
    description: 'Une promenade imaginaire au cœur d\'une forêt silencieuse.',
    steps: [
      { text: 'Ferme les yeux et prends trois respirations profondes, lentement.', seconds: 12 },
      { text: 'Tu marches sur un sentier tapissé de mousse, entouré de grands arbres verts.', seconds: 14 },
      { text: 'La lumière du soleil filtre à travers les feuilles, dessinant des taches dorées au sol.', seconds: 14 },
      { text: 'Tu entends le chant discret des oiseaux et le bruissement des feuilles dans le vent.', seconds: 14 },
      { text: 'Tu t\'arrêtes près d\'un arbre ancien, poses ta main sur son écorce, et te sens enraciné·e.', seconds: 14 },
      { text: 'Savoure ce calme quelques instants encore, avant de revenir doucement ici.', seconds: 12 },
    ],
  },
  {
    id: 'scan',
    title: 'Scan corporel',
    icon: '🧘',
    description: 'Un balayage mental du corps pour relâcher chaque tension.',
    steps: [
      { text: 'Installe-toi confortablement, assis·e ou allongé·e, et ferme les yeux.', seconds: 10 },
      { text: 'Porte ton attention sur tes pieds. Relâche toute tension que tu y trouves.', seconds: 12 },
      { text: 'Remonte vers tes jambes, puis ton bassin. Laisse-les s\'alourdir et se détendre.', seconds: 12 },
      { text: 'Porte ton attention sur ton ventre et ta poitrine, au rythme de ta respiration.', seconds: 12 },
      { text: 'Relâche tes épaules, tes bras, jusqu\'au bout de tes doigts.', seconds: 12 },
      { text: 'Détends ton visage, ta mâchoire, ton front. Laisse chaque muscle s\'apaiser.', seconds: 12 },
      { text: 'Prends un instant pour ressentir ton corps, entièrement détendu.', seconds: 12 },
    ],
  },
];
