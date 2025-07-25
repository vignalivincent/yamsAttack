import { MAX_PLAYERS } from '@/constants/maxPlayers';
import { useGameStore } from './gameStore';
import { getLatestScoreFromStack, handleScoreNotification } from './utils';
import { toast } from '@/ui/hooks/use-toast';
import { t } from 'i18next';
import { TOAST_MESSAGES } from '@/constants/toastMessages';

export function setupSubscriptions() {
  const unsubscribePlayerLimit = useGameStore.subscribe(
    (state) => state.playerList,
    (playerList) => {
      const canAddPlayer = playerList.length < MAX_PLAYERS;
      useGameStore.setState({ canAddPlayer });
    }
  );

  const unsubscribeScoreStack = useGameStore.subscribe(
    (state) => state.scoreStack,
    (scoreStack) => {
      if (scoreStack.length === 0) return;
      const { playerList, gameHistoryList, updatePlayerScore, endGame, emitToSocket, isViewer, socket } = useGameStore.getState();
      if (isViewer) return;

      const newScore = getLatestScoreFromStack(scoreStack);
      updatePlayerScore(newScore);

      const player = playerList.find((p) => p.id === newScore.playerId);
      if (!player) {
        return;
      }

      handleScoreNotification(scoreStack, player);

      if (socket) {
        emitToSocket({ playerList, gameHistoryList });
      }

      const gameCompleted = playerList.every((player) => {
        const filledCategories = Object.keys(player.scores).length;
        return filledCategories >= 13;
      });

      if (gameCompleted) {
        endGame();
        toast({
          title: t(TOAST_MESSAGES.gameEnded.title),
          description: t(TOAST_MESSAGES.gameEnded.description),
          variant: TOAST_MESSAGES.gameEnded.variant,
        });
      }
    },
    { fireImmediately: false }
  );

  const cleanup = () => {
    unsubscribePlayerLimit();
    unsubscribeScoreStack();
  };
  return {
    cleanup,
  };
}
