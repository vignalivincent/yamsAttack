import { useScoreBoardContext } from '../context/useScoreBoardContext';

export const useScoreBoardModals = () => {
  const {
    confirmEndGameOpen,
    setConfirmEndGameOpen,
    rankingModalOpen,
    setRankingModalOpen,
    victoryModalOpen,
    scoreModalOpen,
    setVictoryModalOpen,
    setScoreModalOpen,
  } = useScoreBoardContext();
  return {
    scoreModalOpen,
    openScoreModal: () => setScoreModalOpen(true),
    closeScoreModal: () => setScoreModalOpen(false),

    confirmEndGameOpen,
    openConfirmEndGameModal: () => setConfirmEndGameOpen(true),
    closeConfirmEndGameModal: () => setConfirmEndGameOpen(false),

    rankingModalOpen,
    openRankingModal: () => setRankingModalOpen(true),
    closeRankingModal: () => setRankingModalOpen(false),

    victoryModalOpen,
    openVictoryModal: () => setVictoryModalOpen(true),
    closeVictoryModal: () => setVictoryModalOpen(false),
  };
};
