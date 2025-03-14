import { ScoreCategory } from '@/types/game';

type ScoreCategoryWithoutBonus = Exclude<ScoreCategory, 'bonus'>;

const possibleScores: Record<ScoreCategoryWithoutBonus, number[]> = {
  ones: [1, 2, 3, 4, 5],
  twos: [2, 4, 6, 8, 10],
  threes: [3, 6, 9, 12, 15],
  fours: [4, 8, 12, 16, 20],
  fives: [5, 10, 15, 20, 25],
  sixes: [6, 12, 18, 24, 30],
  threeOfAKind: [30],
  fourOfAKind: [40],
  fullHouse: [25],
  smallStraight: [30],
  largeStraight: [40],
  yahtzee: [50],
  chance: [5, 10, 15, 20, 25, 30],
};

export const getPotentialScoreListByCategory = (category: ScoreCategory): number[] => {
  if (category === 'bonus') return [];
  return possibleScores[category] || [];
};
