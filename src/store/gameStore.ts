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

  setHostId: (hostId: string) => void;
  setGameId: (hostId: string) => void;
  hostId: string | null;
  gameId: string | null;
  socket: WebSocket | null;
  isViewer: boolean;
  initLiveShare: () => void;
  disconnectLiveShare: () => void;
  joinLiveShare: () => void;
  reconnectSocket: () => void;
  emitToSocket: (payLoad: Pick<GameStore, 'playerList' | 'gameHistoryList'>) => void;
  receivesFromSocket: (payLoad: { gameState: Pick<GameStore, 'playerList' | 'gameHistoryList'> }) => void;
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

        socket: null,
        socketGameId: null,
        hostId: null,
        gameId: null,
        isViewer: false,

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
          const { emitToSocket, gameHistoryList } = get();
          set((state) => {
            const newPlayerList = state.playerList.map((player) => {
              if (player.id === playerId) {
                return {
                  ...player,
                  scores: {
                    ...player.scores,
                    [category]: value,
                  },
                };
              }
              return player;
            });

            // Find a better pattern to update the socket
            emitToSocket({ playerList: newPlayerList, gameHistoryList });
            return { ...state, playerList: newPlayerList };
          });
        },

        setHostId: (hostId) => {
          set({ hostId });
        },

        setGameId: (gameId) => {
          set({ gameId });
        },

        initLiveShare: () => {
          try {
            const { playerList, gameHistoryList, scoreStack, setHostId, setGameId } = get();

            const socketServerBaseUrl = import.meta.env.VITE_SOCKET_SERVER_BASE_URL || 'http://localhost:8080';
            const hostPlayerId = crypto.randomUUID();
            setHostId(hostPlayerId);
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
                  console.log(data.gameId);
                  const socket = new WebSocket(`${hostGameUrl}?hostId=${hostPlayerId}&gameId=${data.gameId}`);
                  socket.onopen = () => {
                    console.log('[HOST] - Socket connection established');
                  };
                  socket.onmessage = (event) => {
                    console.log('[HOST] -Socket message received:', event.data);
                  };
                  socket.onclose = (event) => {
                    if (event.wasClean) {
                      console.log('[HOST] -Socket connection closed cleanly');
                      return set({ socket: null });
                    }
                    console.log('[HOST] -Socket connection closed not cleanly');
                    set({ socket: null, gameId: null, hostId: null });
                  };
                  setGameId(data.gameId);
                  set({ socket });
                }
              })
              .catch((error) => {
                console.error('[HOST] -Error initiating live share:', error);
              });
          } catch (err) {
            console.error('[HOST] -Exception in initLiveShare:', err);
          }
        },
        joinLiveShare: () => {
          const { gameId } = get();
          if (!gameId) {
            console.error('Game ID is required to join a live share');
            return;
          }
          const socketServerBaseUrl = import.meta.env.VITE_SOCKET_SERVER_BASE_URL || 'http://localhost:8080';
          const viewBaseUrl = `${socketServerBaseUrl}/viewGame`;
          const socket = new WebSocket(`${viewBaseUrl}?gameId=${gameId}`);
          socket.onopen = () => {
            console.log('[VIEWER] - Socket connection established');
          };
          set({ isViewer: true });
          socket.onmessage = (event) => {
            console.log('[VIEWER] - Socket message received:');
            const { playerList, gameHistoryList } = JSON.parse(event.data).gameState;
            console.log('MSG', playerList);
            console.log('LOCAL', get().playerList);
            set({ isGameStarted: true, playerList, gameHistoryList });
          };
          set({ socket });
        },
        reconnectSocket: () => {
          const { hostId, gameId, socket } = get();
          if (hostId && gameId && !socket) {
            const socketServerBaseUrl = import.meta.env.VITE_SOCKET_SERVER_BASE_URL || 'http://localhost:8080';
            const hostGameUrl = `${socketServerBaseUrl}/hostGame`;
            const socket = new WebSocket(`${hostGameUrl}?hostId=${hostId}&gameId=${gameId}`);
            socket.onopen = () => {
              console.log('[HOST] - Socket connection RE-established');
            };
            socket.onmessage = (event) => {
              console.log('[HOST] - Socket message received:', event.data);
            };
            socket.onclose = (event) => {
              if (event.wasClean) {
                console.log('[HOST] - Socket connection closed cleanly');
                return set({ socket: null });
              }
              console.log('[HOST] - Socket connection closed not cleanly');
              set({ socket: null, gameId: null, hostId: null });
            };
            set({ socket });
          }
        },
        disconnectLiveShare: () => {
          const { socket } = get();
          if (socket) {
            socket.close();
          }
          set({ socket: null, gameId: null, hostId: null });
        },
        emitToSocket(payLoad) {
          console.log(payLoad);
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
          hostId: state.hostId,
          gameId: state.gameId,
        }),
      }
    ),
    { name: 'Game Store' }
  )
);
