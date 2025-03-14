import { useCallback } from 'react';
import { ScoreCategory } from '@/types/game';
import { useActions, useIsGameEnded } from '@/store/selectors';
import { useScoreBoardContext } from '../context/useScoreBoardContext';

export const useScoreBoardActions = () => {
  const { leaveGame } = useActions();
  const hasEnded = useIsGameEnded();
  const { setSelectedCell, setScoreModalOpen, setConfirmEndGameOpen } = useScoreBoardContext();

  const handleCellClick = useCallback(
    (playerId: string, category: ScoreCategory) => {
      setSelectedCell({ playerId, category });
      setScoreModalOpen(true);
    },
    [setSelectedCell, setScoreModalOpen]
  );

  const handleEndGameClick = useCallback(() => {
    if (hasEnded) {
      leaveGame();
      return;
    }
    setConfirmEndGameOpen(true);
  }, [hasEnded, leaveGame, setConfirmEndGameOpen]);

  const handleEndGameConfirm = useCallback(() => {
    leaveGame();
    setConfirmEndGameOpen(false);
  }, [leaveGame, setConfirmEndGameOpen]);

  return {
    handleCellClick,
    handleEndGameClick,
    handleEndGameConfirm,
  };
};
