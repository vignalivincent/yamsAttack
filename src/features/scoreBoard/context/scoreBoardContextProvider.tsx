import { FC, ReactNode, useState } from 'react';
import { ScoreCategory, ScoreCategoryUI } from '@/types/game';
import { ScoreBoardContext } from './scoreBoardContext';

interface ScoreBoardProviderProps {
  children: ReactNode;
}

export const ScoreBoardProvider: FC<ScoreBoardProviderProps> = ({ children }) => {
  const [selectedCell, setSelectedCell] = useState<{ playerId: string; category: ScoreCategory } | null>(null);
  const [focusedCategory, setFocusedCategory] = useState<ScoreCategoryUI | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBonusExpanded, setIsBonusExpanded] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [victoryModalOpen, setVictoryModalOpen] = useState(false);
  const [rankingModalOpen, setRankingModalOpen] = useState(false);
  const [confirmEndGameOpen, setConfirmEndGameOpen] = useState(false);

  const value = {
    selectedCell,
    setSelectedCell,
    focusedCategory,
    setFocusedCategory,
    isExpanded,
    setIsExpanded,
    isBonusExpanded,
    setIsBonusExpanded,
    scoreModalOpen,
    setScoreModalOpen,
    victoryModalOpen,
    setVictoryModalOpen,
    rankingModalOpen,
    setRankingModalOpen,
    confirmEndGameOpen,
    setConfirmEndGameOpen,
  };

  return <ScoreBoardContext.Provider value={value}>{children}</ScoreBoardContext.Provider>;
};
