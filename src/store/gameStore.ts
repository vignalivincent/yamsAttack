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
  setViewMode: (viewMode: boolean, gameId: string | null) => void;
  addScore: (score: Score) => void;
  revertScore: (score: Omit<Score, 'value'>) => void;
  updatePlayerScore: (score: Score) => void;

  initLiveShare: () => void;
  emitToSocket: (payLoad: Pick<GameStore, 'playerList' | 'gameHistoryList'>) => void;
  receivesFromSocket: (payLoad: { gameState: Pick<GameStore, 'playerList' | 'gameHistoryList'> }) => void;
  socket: WebSocket | null;
  viewMode: boolean;
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
        viewMode: false,

        socket: null,
        socketGameId: null,

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

        setViewMode: (viewMode) => {
          set({ viewMode });
        },

        updatePlayerScore: ({ playerId, category, value }) => {
          const { emitToSocket, gameHistoryList } = get();
          set((state) => {
            const newPlayerList = state.playerList.map((player) =>
              player.id === playerId
                ? {
                    ...player,
                    scores: {
                      ...player.scores,
                      [category]: value,
                    },
                  }
                : player
            );
            // Find a better pattern to update the socker
            emitToSocket({ playerList: newPlayerList, gameHistoryList });
            return { ...state, newPlayerList };
          });
        },
        initLiveShare: () => {
          // TODO : The connection is lost when the page is refreshed
          try {
            const { playerList, gameHistoryList, scoreStack } = get();

            const socketServerBaseUrl = import.meta.env.VITE_SOCKET_SERVER_BASE_URL || 'http://localhost:8080';
            const hostPlayerId = crypto.randomUUID();
            const initGameurl = `${socketServerBaseUrl}/initSharedGame`;
            const hostGameUrl = `${socketServerBaseUrl}/hostGame`;

            fetch(initGameurl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              mode: 'cors',
              body: JSON.stringify({
                hostPlayerId,
                gameState: {
                  playerList,
                  gameHistoryList,
                  scoreStack,
                },
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Server responded with status: ${response.status}`);
                }
                return response.json();
              })
              .then((data) => {
                console.log('Live share initiated successfully:', data);
                if (data.gameId) {
                  const socket = new WebSocket(`${hostGameUrl}?hostId=${hostPlayerId}&gameId=${data.gameId}`);
                  socket.onopen = () => {
                    console.log('Socket connection established');
                  };
                  socket.onmessage = (event) => {
                    console.log('Socket message received:', event.data);
                  };

                  set({ socket });
                }
              })
              .catch((error) => {
                console.error('Error initiating live share:', error);
              });
          } catch (err) {
            console.error('Exception in initLiveShare:', err);
          }
        },
        emitToSocket(payLoad) {
          const { socket } = get();
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                gameState: { ...payLoad },
              })
            );
          }
        },
        receivesFromSocket(payLoad) {
          const { gameState } = payLoad;
          set(gameState);
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
