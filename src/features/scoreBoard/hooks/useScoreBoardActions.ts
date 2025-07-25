import { useCallback } from 'react';
import { ScoreCategory } from '@/types/game';
import { useActions, useIsGameEnded } from '@/store/selectors';
import { useScoreBoardContext } from '../context/useScoreBoardContext';

export const useScoreBoardActions = () => {
  const { restartGame } = useActions();
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
      restartGame();
      return;
    }
    setConfirmEndGameOpen(true);
  }, [hasEnded, restartGame, setConfirmEndGameOpen]);

  const handleEndGameConfirm = useCallback(() => {
    restartGame();
    setConfirmEndGameOpen(false);
  }, [restartGame, setConfirmEndGameOpen]);

  return {
    handleCellClick,
    handleEndGameClick,
    handleEndGameConfirm,
  };
};
