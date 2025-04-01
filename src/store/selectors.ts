import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from './gameStore';
import { computeActivePlayerListStat, getLeaderboard } from './utils';

// State Selector
export const usePlayerList = () => useGameStore(useShallow((state) => state.playerList));
export const useGameHistoryList = () => useGameStore(useShallow((state) => state.gameHistoryList));
export const useIsGameStarted = () => useGameStore(useShallow((state) => state.isGameStarted));
export const useIsGameEnded = () => useGameStore(useShallow((state) => state.isGameEnded));
export const useIsGameCompleted = () => useGameStore(useShallow((state) => state.isGameCompleted));
export const useCanAddPlayer = () => useGameStore(useShallow((state) => state.canAddPlayer));
export const useHostId = () => useGameStore(useShallow((state) => state.hostId));
export const useIsViewer = () => useGameStore(useShallow((state) => state.isViewer));

// Derived state Selector
export const useLeaderBoard = () => {
  const playerList = usePlayerList();
  return getLeaderboard(playerList);
};

export const usePlayerListWithStat = () => {
  const playerList = usePlayerList();
  const gameHistoryList = useGameHistoryList();
  return computeActivePlayerListStat(playerList, gameHistoryList);
};

// Actions Selector
export const useActions = () => ({
  addPlayer: useGameStore(useShallow((state) => state.addPlayer)),
  removePlayer: useGameStore(useShallow((state) => state.removePlayer)),
  addScore: useGameStore(useShallow((state) => state.addScore)),
  revertScore: useGameStore(useShallow((state) => state.revertScore)),
  startGame: useGameStore(useShallow((state) => state.startGame)),
  endGame: useGameStore(useShallow((state) => state.endGame)),
  leaveGame: useGameStore(useShallow((state) => state.leaveGame)),
  initLiveShare: useGameStore(useShallow((state) => state.initLiveShare)),
  disconnectLiveShare: useGameStore(useShallow((state) => state.disconnectLiveShare)),
  joinLiveShare: useGameStore(useShallow((state) => state.joinLiveShare)),
  reconnectSocket: useGameStore(useShallow((state) => state.reconnectSocket)),
  setGameId: useGameStore(useShallow((state) => state.setGameId)),
});
