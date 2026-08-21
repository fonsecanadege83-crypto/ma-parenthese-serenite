export interface Stretch {
  name: string;
  icon: string;
  seconds: number;
  instruction: string;
}

export const STRETCHES: Stretch[] = [
  {
    name: 'Étirement du cou',
    icon: '🙆',
    seconds: 30,
    instruction: "Incline doucement la tête vers l'épaule droite, puis la gauche. Respire calmement.",
  },
  {
    name: 'Roulement d\'épaules',
    icon: '🤷',
    seconds: 30,
    instruction: "Fais rouler tes épaules vers l'arrière lentement, en grands cercles.",
  },
  {
    name: 'Torsion du buste',
    icon: '🧍',
    seconds: 30,
    instruction: 'Assis·e ou debout, tourne doucement le buste d\'un côté puis de l\'autre.',
  },
  {
    name: 'Étirement des bras',
    icon: '🙋',
    seconds: 30,
    instruction: 'Tends un bras au-dessus de la tête, penche légèrement sur le côté opposé.',
  },
  {
    name: 'Flexion avant',
    icon: '🧎',
    seconds: 45,
    instruction: 'Penche-toi doucement vers l\'avant, laisse tes bras et ta tête relâchés.',
  },
  {
    name: 'Respiration debout',
    icon: '🌳',
    seconds: 30,
    instruction: 'Debout, pieds ancrés au sol, prends trois respirations profondes et lentes.',
  },
];
