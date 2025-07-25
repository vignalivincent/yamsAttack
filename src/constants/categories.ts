import { ScoreCategoryUI, SectionEnum } from '@/types/game';

export const SCORE_CATEGORIES: ScoreCategoryUI[] = [
  { id: 'ones', name: 'As', description: 'Total des 1', section: SectionEnum.upper, icon: '1️⃣', color: 'from-blue-400/10 to-blue-500/10', maxScore: 5 },
  { id: 'twos', name: 'Deux', description: 'Total des 2', section: SectionEnum.upper, icon: '2️⃣', color: 'from-blue-400/10 to-blue-500/10', maxScore: 10 },
  { id: 'threes', name: 'Trois', description: 'Total des 3', section: SectionEnum.upper, icon: '3️⃣', color: 'from-blue-400/10 to-blue-500/10', maxScore: 15 },
  { id: 'fours', name: 'Quatre', description: 'Total des 4', section: SectionEnum.upper, icon: '4️⃣', color: 'from-blue-400/10 to-blue-500/10', maxScore: 20 },
  { id: 'fives', name: 'Cinq', description: 'Total des 5', section: SectionEnum.upper, icon: '5️⃣', color: 'from-blue-400/10 to-blue-500/10', maxScore: 25 },
  { id: 'sixes', name: 'Six', description: 'Total des 6', section: SectionEnum.upper, icon: '6️⃣', color: 'from-blue-400/10 to-blue-500/10', maxScore: 30 },

  {
    id: 'threeOfAKind',
    name: 'Brelan',
    description: '3 dés identiques',
    section: SectionEnum.lower,
    icon: '🎲',
    color: 'from-purple-400/10 to-purple-500/10',
    maxScore: 30,
  },
  {
    id: 'fourOfAKind',
    name: 'Carré',
    description: '4 dés identiques',
    section: SectionEnum.lower,
    icon: '🎲',
    color: 'from-purple-400/10 to-purple-500/10',
    maxScore: 40,
  },
  {
    id: 'fullHouse',
    name: 'Full',
    description: '3 + 2 dés identiques',
    section: SectionEnum.lower,
    icon: '🃏',
    color: 'from-purple-400/10 to-purple-500/10',
    maxScore: 25,
  },
  {
    id: 'smallStraight',
    name: 'Petite suite',
    description: '4 dés qui se suivent',
    section: SectionEnum.lower,
    icon: '➡️',
    color: 'from-purple-400/10 to-purple-500/10',
    maxScore: 30,
  },
  {
    id: 'largeStraight',
    name: 'Grande suite',
    description: '5 dés qui se suivent',
    section: SectionEnum.lower,
    icon: '⏭️',
    color: 'from-purple-400/10 to-purple-500/10',
    maxScore: 40,
  },
  {
    id: 'yahtzee',
    name: 'Yams',
    description: '5 dés identiques',
    section: SectionEnum.lower,
    icon: '🌟',
    color: 'from-yellow-400/10 to-yellow-500/10',
    maxScore: 50,
  },
  {
    id: 'chance',
    name: 'Chance',
    description: 'Total de tous les dés',
    section: SectionEnum.lower,
    icon: '🍀',
    color: 'from-purple-400/10 to-purple-500/10',
    maxScore: 30,
  },

  {
    id: 'bonus',
    name: 'Bonus (+35pts)',
    description: 'Au dela de 62 points ci dessus.',
    icon: '🤑',
    color: 'from-emerald-400/10 to-emerald-500/10',
    section: SectionEnum.upper,
  },
];

export type ScoreCategoryName = (typeof SCORE_CATEGORIES)[number]['id'];

export const upperCategories: ScoreCategoryName[] = SCORE_CATEGORIES.filter(
  (category) => category.section === SectionEnum.upper && category.id !== 'bonus'
).map((category) => category.id) as ScoreCategoryName[];
