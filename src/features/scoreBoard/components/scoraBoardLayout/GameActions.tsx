import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useActions, useGameHistoryList, useIsGameEnded, useIsViewer } from '@/store/selectors';
import { useScoreBoardModals } from '../../hooks/useScoreBoardModals';
import { useScoreBoardActions } from '../../hooks/useScoreBoardActions';
import { Button } from '@/ui/components/button';

export const GameActions: FC = () => {
  const { openRankingModal } = useScoreBoardModals();
  const { handleEndGameClick } = useScoreBoardActions();
  const { initLiveShare, disconnectLiveShare } = useActions();
  const hasEnded = useIsGameEnded();
  const { t } = useTranslation();
  const isViewer = useIsViewer();
  const gameHistoryList = useGameHistoryList();
  const handleInitLiveShare = () => {
    initLiveShare();
  };
  const handleDisconnectLiveShare = () => {
    disconnectLiveShare();
  };

  return (
    <div className="flex gap-2 mt-8">
      {!isViewer && (
        <>
          <Button
            onClick={handleEndGameClick}
            className={`flex-1 ${hasEnded ? 'bg-emerald-500/90 hover:bg-emerald-500' : 'bg-red-500/90 hover:bg-red-500'} 
          text-white font-semibold text-sm lg:text-base h-12 sm:h-14 rounded-lg 
          transition-all shadow-lg hover:shadow-xl flex items-center justify-center`}>
            {hasEnded ? `${t('game.actions.new')} 🎲` : `${t('game.actions.end')} 🏁`}
          </Button>
          <Button
            onClick={handleInitLiveShare}
            className="w-12 sm:w-14 bg-blue-600/90 hover:bg-blue-600 text-white font-semibold h-12 sm:h-14 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            🔗
          </Button>
          <Button
            onClick={handleDisconnectLiveShare}
            className="w-12 sm:w-14 bg-orange-600/90 hover:bg-orange-600 text-white font-semibold h-12 sm:h-14 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            🔌
          </Button>
        </>
      )}

      {gameHistoryList.length >= 1 && (
        <Button
          onClick={openRankingModal}
          className=" flex-1 w-12 sm:w-14 bg-purple-500/90 hover:bg-purple-500 text-white font-semibold h-12 sm:h-14 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
          🏆
        </Button>
      )}
    </div>
  );
};
