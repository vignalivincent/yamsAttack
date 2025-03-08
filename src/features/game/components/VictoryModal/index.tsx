import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { usePlayers, useGame } from '@/features/game/store/gameStore';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
}

export const VictoryModal: FC<VictoryModalProps> = ({ isOpen, onClose, onNewGame }) => {
  const { t } = useTranslation();
  const { getLeaderboard } = usePlayers();
  const { getWinner } = useGame();
  const winner = getWinner();

  const leaderboard = getLeaderboard();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent fullWidth className="space-y-6">
        <DialogTitle className="sr-only">
          {t('victory.title')} {winner?.name ? `- ${winner.name}` : ''}
        </DialogTitle>
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🏆</div>
          <h2 className="text-3xl font-bold text-purple-900">{t('victory.title')}</h2>

          {winner && (
            <>
              <p className="text-xl text-purple-600">
                <b> {winner.name}</b> {t('victory.winner')}
              </p>
              <div className="inline-block border-2 border-purple-900 rounded-lg px-4 py-2">
                <p className="text-2xl font-bold text-purple-900">
                  {winner.score} {t('victory.points')}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-900">{t('victory.scores')}</h3>
          <div className="space-y-2">
            {leaderboard.ranking.map((player, index) => {
              const { playerId, score, playerName } = player;
              return (
                <div key={playerId} className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}</span>
                    <span className="font-medium text-purple-900">{playerName}</span>
                  </div>
                  <span className="font-bold text-purple-900">{score}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition-colors text-lg">
            {t('victory.actions.close')}
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-md hover:shadow-lg border-2 border-purple-400">
            {t('victory.actions.newGame')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
