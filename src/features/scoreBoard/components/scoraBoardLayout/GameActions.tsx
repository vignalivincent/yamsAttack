import { FC, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useActions, useGameHistoryList, useIsGameEnded, useIsLiveShareOn, useIsViewer } from '@/store/selectors';
import { useScoreBoardModals } from '../../hooks/useScoreBoardModals';
import { useScoreBoardActions } from '../../hooks/useScoreBoardActions';
import { Button } from '@/ui/components/button';
import { toast } from '@/ui/hooks/use-toast';
import { TOAST_MESSAGES } from '@/constants/toastMessages';
import { AdminMenu } from './AdminMenu';

export const GameActions: FC = () => {
  const { openRankingModal, openSharedGameUrlModal } = useScoreBoardModals();
  const { handleEndGameClick } = useScoreBoardActions();
  const { initLiveShare, disconnectLiveShare } = useActions();
  const hasEnded = useIsGameEnded();
  const isViewer = useIsViewer();
  const gameHistoryList = useGameHistoryList();
  const isLiveShareOn = useIsLiveShareOn();
  const { t } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleInitLiveShare = () => {
    if (isLiveShareOn) {
      toast({
        variant: TOAST_MESSAGES.liveShareAlreadyUp.variant,
        title: t(TOAST_MESSAGES.liveShareAlreadyUp.title),
        description: t(TOAST_MESSAGES.liveShareAlreadyUp.description),
      });
      openSharedGameUrlModal();
      setMenuOpen(false);
      return;
    }
    initLiveShare();
    toast({
      variant: TOAST_MESSAGES.liveShareStarted.variant,
      title: t(TOAST_MESSAGES.liveShareStarted.title),
      description: t(TOAST_MESSAGES.liveShareStarted.description),
    });
    openSharedGameUrlModal();
    setMenuOpen(false);
  };

  const handleDisconnectLiveShare = () => {
    if (!isLiveShareOn) {
      toast({
        variant: TOAST_MESSAGES.liveShareAlreadyDown.variant,
        title: t(TOAST_MESSAGES.liveShareAlreadyDown.title),
        description: t(TOAST_MESSAGES.liveShareAlreadyDown.description),
      });
      setMenuOpen(false);
      return;
    }
    disconnectLiveShare();
    toast({
      variant: TOAST_MESSAGES.liveShareEnded.variant,
      title: t(TOAST_MESSAGES.liveShareEnded.title),
      description: t(TOAST_MESSAGES.liveShareEnded.description),
    });
    setMenuOpen(false);
  };

  if (isViewer) {
    return (
      <div className="flex flex-col gap-2 mt-8">
        {gameHistoryList.length >= 1 && (
          <Button
            onClick={openRankingModal}
            className="flex-1 sm:w-14 bg-purple-500/90 hover:bg-purple-500 text-white font-semibold h-12 sm:h-14 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center">
            🏆
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-8 relative">
      <div className="flex gap-2">
        <Button
          ref={menuButtonRef}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex-1 w-full sm:w-auto bg-purple-700 hover:bg-gray-800 text-white font-semibold h-12 sm:h-14 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center text-lg tracking-wide"
          aria-label={t('game.actions.menu', 'Actions menu')}>
          {t('game.actions.menu', 'Menu')}
        </Button>

        <AdminMenu open={menuOpen} onClose={() => setMenuOpen(false)} anchorRef={menuButtonRef}>
          <Button
            onClick={() => {
              openRankingModal();
              setMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-none text-center bg-purple-100 hover:bg-purple-200 text-purple-700">
            🏆 {t('game.actions.ranking', 'Show Ranking')}
          </Button>
          <Button
            onClick={handleInitLiveShare}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-none relative text-center bg-purple-100 hover:bg-blue-100
              ${
                isLiveShareOn
                  ? 'font-bold border-2 border-blue-500 text-white bg-blue-500 hover:bg-blue-500 shadow-lg shadow-blue-500/50'
                  : 'border-2 border-transparent text-blue-700'
              }
            `}>
            <span className="relative flex items-center justify-center w-full z-10 text-center">
              <>📡 {t('game.actions.liveShareActive', 'Inviter des spectateurs')}</>
            </span>
          </Button>
          {isLiveShareOn && (
            <Button
              onClick={handleDisconnectLiveShare}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-none text-center bg-purple-100 hover:bg-orange-100 text-orange-700">
              🔌 {t('game.actions.stopLiveShare', 'Stop Live Share')}
            </Button>
          )}
          <Button
            onClick={() => {
              handleEndGameClick();
              setMenuOpen(false);
            }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-none text-center bg-purple-100 hover:bg-red-100 ${
              hasEnded ? 'text-emerald-700' : 'text-red-700'
            }`}>
            {hasEnded ? `🎲 ${t('game.actions.new', 'New Game')}` : `🏁 ${t('game.actions.end', 'End Game')}`}
          </Button>
        </AdminMenu>
      </div>
    </div>
  );
};
