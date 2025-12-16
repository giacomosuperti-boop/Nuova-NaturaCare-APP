import { IngredientCategory, PrepType, TimeAvailable } from './types';

export const SYMPTOM_CATEGORIES = [
  { name: 'Digestivo', items: ['Nausea', 'Acidità', 'Gonfiore', 'Digestione lenta', 'Costipazione'] },
  { name: 'Respiratorio', items: ['Tosse', 'Raffreddore', 'Mal di gola', 'Congestione nasale'] },
  { name: 'Rilassamento', items: ['Stress', 'Ansia', 'Insonnia', 'Tensione muscolare'] },
  { name: 'Energia', items: ['Stanchezza', 'Affaticamento mentale', 'Mancanza di concentrazione'] },
  { name: 'Pelle', items: ['Irritazioni', 'Piccole ferite', 'Scottature', 'Pelle secca'] },
  { name: 'Dolore', items: ['Mal di testa', 'Dolori mestruali', 'Dolori articolari'] },
  { name: 'Immunitario', items: ['Prevenzione', 'Rafforzamento difese'] },
];

export const PREP_OPTIONS = [
  { value: PrepType.ANY, label: 'Qualsiasi', icon: '🌿' },
  { value: PrepType.TISANA, label: 'Tisana/Infuso', icon: '🍵' },
  { value: PrepType.DECOTTO, label: 'Decotto', icon: '🫖' },
  { value: PrepType.IMPACCO, label: 'Impacco', icon: '🧴' },
  { value: PrepType.SCIROPPO, label: 'Sciroppo', icon: '🥄' },
];

export const TIME_OPTIONS = [
  { value: TimeAvailable.QUICK, label: 'Veloce', sub: '< 10 min', icon: '⚡' },
  { value: TimeAvailable.NORMAL, label: 'Normale', sub: '10-20 min', icon: '⏱️' },
  { value: TimeAvailable.LONG, label: 'Ho tempo', sub: '> 20 min', icon: '🕐' },
];

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    id: 'herbs',
    title: 'Erbe Fresche/Secche',
    icon: '🌿',
    items: ['Menta', 'Camomilla', 'Rosmarino', 'Salvia', 'Timo', 'Origano', 'Basilico', 'Lavanda', 'Calendula', 'Valeriana', 'Melissa', 'Dente di leone']
  },
  {
    id: 'spices',
    title: 'Spezie e Cucina',
    icon: '🧄',
    items: ['Aglio', 'Cipolla', 'Zenzero', 'Curcuma', 'Limone', 'Miele', 'Cannella', 'Pepe di cayenna', 'Aceto di mele', 'Olio d\'oliva']
  },
  {
    id: 'basics',
    title: 'Basics Dispensa',
    icon: '🏺',
    items: ['Bicarbonato', 'Sale marino', 'Avena', 'Semi di lino', 'Acqua di rose', 'Glicerina vegetale', 'Cera d\'api', 'Alcol 40%']
  },
  {
    id: 'special',
    title: 'Speciali',
    icon: '✨',
    items: ['Aloe vera', 'Propoli', 'Sambuco', 'Echinacea', 'Arnica']
  }
];