import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { GameHistory, Player, Score } from '@/types/game';
import { calculateTotal, getLeaderboard } from './utils';

const STORAGE_KEY = 'dice-paradise-game-state';

interface GameStore {
  isGameStarted: boolean;
  isGameEnded: boolean;
  isGameCompleted: boolean;
  playerList: Player[];
  canAddPlayer: boolean;
  scoreStack: Score[];
  gameHistoryList: GameHistory[];
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  endGame: () => void;
  leaveGame: () => void;
  addScore: (score: Score) => void;
  revertScore: (score: Omit<Score, 'value'>) => void;
  updatePlayerScore: (score: Score) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        playerList: [],
        isGameStarted: false,
        isGameEnded: false,
        isGameCompleted: false,
        canAddPlayer: true,
        gameHistoryList: [],
        scoreStack: [],

        addPlayer: (name) =>
          set((state) => {
            const nameExists = state.playerList.some((player) => player.name.toLowerCase() === name.toLowerCase());

            if (nameExists || !get().canAddPlayer) return state;

            return {
              playerList: [
                ...state.playerList,
                {
                  id: crypto.randomUUID(),
                  name,
                  scores: {},
                },
              ],
            };
          }),

        removePlayer: (id) =>
          set((state) => ({
            playerList: state.playerList.filter((p) => p.id !== id),
          })),

        addScore: ({ playerId, category, value }) => {
          set((state) => ({
            scoreStack: [
              ...state.scoreStack,
              {
                playerId,
                category,
                value,
              },
            ],
          }));
        },

        revertScore: ({ playerId, category }) => {
          set((state) => ({
            scoreStack: state.scoreStack.filter((score) => !(score.playerId === playerId && score.category === category)),
            playerList: state.playerList.map((player) => {
              if (player.id === playerId) {
                const newScores = { ...player.scores };
                delete newScores[category];
                return {
                  ...player,
                  scores: newScores,
                };
              }
              return player;
            }),
          }));
        },

        startGame: () => {
          set({ isGameStarted: true });
        },

        endGame: () => {
          set({ isGameEnded: true });
        },

        leaveGame: () => {
          const { playerList } = get();
          const allZeroScores = playerList.every((player) => calculateTotal(player) === 0);

          const leaderBoard = getLeaderboard(playerList);
          const winnerId = leaderBoard.length > 0 ? leaderBoard[0].id : '';

          set((state) => ({
            isGameStarted: false,
            isGameEnded: false,
            isGameCompleted: false,
            playerList: state.playerList.map((player) => ({
              ...player,
              scores: {},
            })),
            scoreStack: [],
            gameHistoryList: allZeroScores
              ? state.gameHistoryList
              : [
                  ...state.gameHistoryList,
                  {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    players: leaderBoard,
                    winnerId,
                  },
                ],
          }));
        },

        updatePlayerScore: ({ playerId, category, value }) => {
          set((state) => ({
            playerList: state.playerList.map((player) =>
              player.id === playerId
                ? {
                    ...player,
                    scores: {
                      ...player.scores,
                      [category]: value,
                    },
                  }
                : player
            ),
          }));
        },
      })),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          playerList: state.playerList,
          isGameStarted: state.isGameStarted,
          gameHistoryList: state.gameHistoryList,
          scoreStack: state.scoreStack,
        }),
      }
    ),
    { name: 'Game Store' }
  )
);
