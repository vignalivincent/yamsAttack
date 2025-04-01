import { MAX_PLAYERS } from '@/constants/maxPlayers';
import { useGameStore } from './gameStore';
import { getLatestScoreFromStack, handleScoreNotification } from './utils';
import { toast } from '@/ui/hooks/use-toast';

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
    (scoreStack, previousScoreStack) => {
      const { playerList, gameHistoryList, updatePlayerScore, endGame, emitToSocket, isViewer } = useGameStore.getState();
      if (isViewer) {
        console.error('Viewer cannot update score stack');
        return;
      }

      if (scoreStack.length <= previousScoreStack.length) {
        emitToSocket({ playerList, gameHistoryList });
        return;
      }

      const newScore = getLatestScoreFromStack(scoreStack);

      updatePlayerScore(newScore);

      const player = playerList.find((p) => p.id === newScore.playerId);

      if (!player) {
        return;
      }

      handleScoreNotification(player, newScore, playerList);

      const gameCompleted = playerList.every((player) => {
        const filledCategories = Object.keys(player.scores).length;
        return filledCategories >= 13;
      });

      if (gameCompleted) {
        endGame();
        toast({
          title: 'Game Complete!',
          description: 'All categories have been scored. The game will now end.',
          variant: 'default',
        });
      }
    }
  );

  const cleanup = () => {
    unsubscribePlayerLimit();
    unsubscribeScoreStack();
  };
  return {
    cleanup,
  };
}
