export interface EmotionCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  emotions: string[];
}

export const EMOTION_WHEEL: EmotionCategory[] = [
  {
    id: 'joie',
    label: 'Joie',
    icon: '😊',
    color: '#D6A94F',
    emotions: ['Heureux·se', 'Fier·e', 'Reconnaissant·e', 'Enthousiaste', 'Serein·e', 'Amusé·e'],
  },
  {
    id: 'tristesse',
    label: 'Tristesse',
    icon: '😢',
    color: '#6E8FB0',
    emotions: ['Déçu·e', 'Seul·e', 'Découragé·e', 'Nostalgique', 'Vide', 'Mélancolique'],
  },
  {
    id: 'colere',
    label: 'Colère',
    icon: '😠',
    color: '#C4664A',
    emotions: ['Frustré·e', 'Irrité·e', 'Jaloux·se', 'Contrarié·e', 'Indigné·e', 'Agacé·e'],
  },
  {
    id: 'peur',
    label: 'Peur',
    icon: '😨',
    color: '#8A73B0',
    emotions: ['Anxieux·se', 'Inquiet·e', 'Nerveux·se', 'Vulnérable', 'Insécure', 'Tendu·e'],
  },
  {
    id: 'surprise',
    label: 'Surprise',
    icon: '😮',
    color: '#4F9E9E',
    emotions: ['Étonné·e', 'Confus·e', 'Curieux·se', 'Choqué·e', 'Émerveillé·e', 'Déstabilisé·e'],
  },
  {
    id: 'degout',
    label: 'Dégoût',
    icon: '🤢',
    color: '#7C8E5A',
    emotions: ['Gêné·e', 'Honteux·se', 'Coupable', 'Dédaigneux·se', 'Répugné·e', 'Mal à l\'aise'],
  },
];
