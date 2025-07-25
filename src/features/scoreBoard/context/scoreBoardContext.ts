import { ScoreCategory, ScoreCategoryUI } from '@/types/game';
import { createContext } from 'react';

export interface ScoreBoardContextState {
  selectedCell: { playerId: string; category: ScoreCategory } | null;
  setSelectedCell: (cell: { playerId: string; category: ScoreCategory } | null) => void;

  focusedCategory: ScoreCategoryUI | null;
  setFocusedCategory: (category: ScoreCategoryUI | null) => void;

  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;

  isBonusExpanded: boolean;
  setIsBonusExpanded: (expanded: boolean) => void;

  scoreModalOpen: boolean;
  setScoreModalOpen: (open: boolean) => void;

  victoryModalOpen: boolean;
  setVictoryModalOpen: (open: boolean) => void;

  rankingModalOpen: boolean;
  setRankingModalOpen: (open: boolean) => void;

  confirmEndGameOpen: boolean;
  setConfirmEndGameOpen: (open: boolean) => void;

  sharedGameUrlModalOpen: boolean;
  setSharedGameUrlModalOpen: (open: boolean) => void;
}

export const ScoreBoardContext = createContext<ScoreBoardContextState | undefined>(undefined);
