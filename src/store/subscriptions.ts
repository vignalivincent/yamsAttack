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
      if (scoreStack.length <= previousScoreStack.length) return;

      const newScore = getLatestScoreFromStack(scoreStack);
      const { playerList: currentPlayerList, revertScore, updatePlayerScore, endGame } = useGameStore.getState();

      if (newScore.value === undefined) {
        revertScore({ playerId: newScore.playerId, category: newScore.category });
        return;
      }

      updatePlayerScore(newScore);

      const { playerList } = useGameStore.getState();
      const player = playerList.find((p) => p.id === newScore.playerId);

      if (!player) {
        return;
      }

      handleScoreNotification(player, newScore, currentPlayerList);

      const gameCompleted = playerList.every((player) => {
        const filledCategories = Object.keys(player.scores).length;
        return filledCategories >= 13;
      });

      console.log('gameCompleted', gameCompleted);
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
