import { Player, Score, SectionEnum, TotalRowVariant } from '@/types/game';
import { toast } from '@/ui/hooks/use-toast';
import { CSSProperties } from 'react';
import { SCORE_CATEGORIES } from '../../constants/categories';

export const CELL_HEIGHT = 48;
export const CELL_GAP = {
  upper: 1,
  lower: 3,
};
export const CATEGORY_COLUMN_WIDTH = 44;

export const isSectionType = (section: SectionEnum[], type: SectionEnum): boolean => {
  return section.every((s) => s === type);
};

export const getCategoryTopOffset = (index: number, isLowerSection: boolean): string => {
  const currentGap = isLowerSection ? CELL_GAP.lower : CELL_GAP.upper;
  return `${index * (CELL_HEIGHT + currentGap * 4)}px`;
};

export const getGridTemplateColumns = (
  playersCount: number
): {
  main: string;
  players: string;
} => ({
  main: `${CATEGORY_COLUMN_WIDTH}px minmax(0, 1fr)`,
  players: `repeat(${playersCount}, 1fr)`,
});

export const getCellHeightStyle = (): CSSProperties => ({
  height: `${CELL_HEIGHT}px`,
});

export const getFocusedCategoryStyle = (index: number, isLowerSection: boolean): CSSProperties => ({
  position: 'absolute',
  top: getCategoryTopOffset(index, isLowerSection),
  left: 0,
  right: 0,
});

export const getSectionSpacingClass = (isLowerSection: boolean): string => {
  return isLowerSection ? `space-y-${CELL_GAP.lower}` : `space-y-${CELL_GAP.upper}`;
};

export const getCellClassName = (value: number, variant: TotalRowVariant = 'default', isBonus: boolean = false): string => {
  if (variant === 'bonus' || isBonus) {
    return value > 0 ? 'bg-emerald-400/20 text-emerald-50' : 'bg-white/10 text-white/50';
  } else if (variant === 'total') {
    return 'bg-purple-500/80 text-white bg-white/30 ';
  }
  return 'bg-purple-500/80 text-white';
};

/**
 * [DEVELOPMENT PURPOSES ONLY]
 * Fills the score board with random values.
 * This function is intended to be used only during development to simulate
 * score entries for each player, leaving at least one cell empty per player.
 *
 * @param playerList - List of players to fill scores for.
 * @param addScore - Function to add a score entry.
 */
export const handleRandomFill = (playerList: Player[], addScore: (score: Score) => void) => {
  let totalAdded = 0;
  playerList.forEach((player, playerIndex) => {
    const scoreActions = SCORE_CATEGORIES.filter((c) => c.id !== 'bonus').map((category, categoryIndex) => {
      const value = playerIndex === 0 && categoryIndex === 0 ? undefined : Math.floor(Math.random() * 30);
      return {
        playerId: player.id,
        category: category.id,
        value,
      };
    });
    scoreActions.forEach((action) => {
      addScore({
        playerId: action.playerId,
        category: action.category,
        value: action.value,
      });
      totalAdded++;
    });
  });

  toast({
    title: '[Debugger] - Random fill',
    variant: 'warning',
    description: `Added ${totalAdded} random scores, leaving at least one cell empty per player`,
  });
};
