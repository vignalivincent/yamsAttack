import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlayersList } from '@/features/lobby/components/PlayersList';
import { ScoreBoard } from '@/features/scoreBoard/components';
import '@/i18n';
import { Toaster } from './ui/components/toaster';
import { GameControls } from './features/gameControls/components/GameControls';
import { useActions, useHostId, useIsGameStarted } from './store/selectors';
import { setupSubscriptions } from './store/subscriptions';

const App: FC = () => {
  const { t } = useTranslation();
  const hasStarted = useIsGameStarted();

  const urlParams = new URLSearchParams(window.location.search);
  const isViewMode = urlParams.get('viewer');
  const gameId = urlParams.get('gameId');

  const hostId = useHostId();
  const { joinLiveShare, setGameId, reconnectSocket } = useActions();

  if (isViewMode) {
    setGameId(isViewMode);
    if (gameId) {
      setGameId(gameId);
    }
    joinLiveShare();
  } else {
    if (hostId) {
      reconnectSocket();
    }
  }

  const { cleanup } = setupSubscriptions();

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <>
      {/* Desktop Warning */}
      <div className="hidden md:flex fixed inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-lg text-center space-y-4">
          <div className="text-4xl">📱</div>
          <h1 className="text-2xl font-bold text-purple-900">Version Mobile Uniquement</h1>
          <p className="text-purple-700">
            Cette application est optimisée pour une utilisation sur mobile. Veuillez y accéder depuis votre smartphone pour une meilleure expérience.
          </p>
        </div>
      </div>

      {/* Mobile App */}
      <div className="md:hidden min-h-screen w-screen flex flex-col bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
        <main className="flex-1 flex flex-col w-full p-4 sm:p-6">
          <div className="mx-auto w-full max-w-5xl flex flex-col flex-1">
            <div className="flex flex-col items-center justify-center mb-6">
              <h1 className="text-4xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] tracking-tight text-center flex items-center justify-center gap-4">
                <span>🎲</span>
                <span>{t('app.title')}</span>
                <span>🎲</span>
              </h1>
              <p className="text-white/90 text-sm font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] mt-3 italic text-center">{t('app.subtitle')}</p>
            </div>

            {!hasStarted ? (
              <div className="flex flex-col flex-1 gap-6">
                <div className="backdrop-blur-md bg-white/40 rounded-xl p-4 shadow-xl ring-1 ring-white/50 flex flex-col">
                  <PlayersList />
                </div>

                <div className="backdrop-blur-md bg-white/40 rounded-xl p-4 shadow-xl ring-1 ring-white/50 flex flex-col mt-auto">
                  <GameControls />
                </div>
              </div>
            ) : (
              <div className="flex-1 backdrop-blur-md bg-white/40 rounded-xl p-4 shadow-xl ring-1 ring-white/50">
                <ScoreBoard />
              </div>
            )}
          </div>
        </main>
        <Toaster />
      </div>
    </>
  );
};

export default App;
