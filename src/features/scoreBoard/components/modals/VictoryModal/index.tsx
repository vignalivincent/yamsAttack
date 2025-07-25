import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle } from '@/ui/components/dialog';
import { WinnerCard } from './WinnerCard';
import { VictoryPlayerCard } from './VictoryPlayerCard';
import { useActions, useLeaderBoard } from '@/store/selectors';
import { useScoreBoardModals } from '../../../hooks/useScoreBoardModals';

export const VictoryModal: FC = () => {
  const { victoryModalOpen: isOpen, closeVictoryModal: onClose } = useScoreBoardModals();
  const { t } = useTranslation();
  const { restartGame } = useActions();
  const leaderboard = useLeaderBoard();
  const winner = leaderboard[0];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent fullWidth className="space-y-6">
        <DialogTitle className="sr-only">
          {t('victory.title')} {winner?.name ? `- ${winner.name}` : ''}
        </DialogTitle>

        <WinnerCard name={winner.name} score={winner.score} />

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-900">{t('victory.scores')}</h3>
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <VictoryPlayerCard key={player.id} name={player.name} score={player.score} index={index} />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition-colors text-lg">
            {t('victory.actions.close')}
          </button>
          <button
            onClick={restartGame}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-md hover:shadow-lg border-2 border-purple-400">
            {t('victory.actions.newGame')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
