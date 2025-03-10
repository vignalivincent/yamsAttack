import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { PlayersSlice, createPlayersSlice } from './slices/playersSlice';
import { CurrentGameSlice, createCurrentGameSlice } from './slices/currentGameSlice';
import { useShallow } from 'zustand/react/shallow';
import { createHistorySlice, HistorySlice } from './slices/historySlice';

const STORAGE_KEY = 'dice-paradise-game-state';

type BoundState = PlayersSlice & CurrentGameSlice & HistorySlice;

const useBoundStore = create<BoundState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createPlayersSlice(set, get, api),
        ...createCurrentGameSlice(set, get, api),
        ...createHistorySlice(set, get, api),
      }),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          players: state.players,
          isStarted: state.isStarted,
          gameHistory: state.gameHistory,
        }),
      }
    ),
    { name: 'Game Store' }
  )
);

export const usePlayers = () =>
  useBoundStore(
    useShallow((state) => ({
      players: state.players,
      getLeaderboard: state.getLeaderboard,
      canAddPlayer: state.canAddPlayer(),
      doAddPlayer: state.addPlayer,
      doRemovePlayer: state.removePlayer,
    }))
  );

export const useGame = () =>
  useBoundStore(
    useShallow((state) => ({
      gameHistory: state.gameHistory,
      hasStarted: state.isStarted,
      hasEnded: state.isGameEnded,
      isGameComplete: state.isGameComplete,
      doEndGame: state.endGame,
      doStartGame: state.startGame,
      doResetGame: state.resetGame,
    }))
  );

export const useScore = () =>
  useBoundStore(
    useShallow((state) => ({
      getLeaderBoard: state.getLeaderboard,
      getUpperBonus: state.getUpperBonus,
      getMaxScore: state.getMaxScore,
      getScoreStyle: state.getScoreStyle,
      doUpdateScore: state.updatePlayerScore,
    }))
  );

export const useHistory = () =>
  useBoundStore(
    useShallow((state) => ({
      gameHistory: state.gameHistory,
      getSortedPlayerStats: state.getSortedPlayerStats,
    }))
  );
