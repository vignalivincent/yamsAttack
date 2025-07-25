import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { GameHistory, LiveSharePayloadType, Player, Score, SocketPayload } from '@/types/game';
import { calculateTotal, getLeaderboard } from './utils';
import { createWebSocketConnection } from './socketUtils';

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
  restartGame: () => void;
  addScore: (score: Score) => void;
  revertScore: (score: Omit<Score, 'value'>) => void;
  updatePlayerScore: (score: Score) => void;

  setHostId: (hostId: string) => void;
  setGameId: (hostId: string) => void;
  setSharedGameUrl: (hostId: string) => void;
  sharedGameUrl: string | null;
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
        sharedGameUrl: null,
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

        restartGame: () => {
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

        setSharedGameUrl: (sharedGameUrl) => {
          set({ sharedGameUrl });
        },

        initLiveShare: () => {
          try {
            const { playerList, gameHistoryList, scoreStack, setHostId, setGameId, setSharedGameUrl } = get();
            const socketServerBaseUrl = import.meta.env.VITE_SOCKET_SERVER_BASE_URL;
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
                if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
                return response.json();
              })
              .then((data) => {
                if (data.gameId) {
                  setGameId(data.gameId);
                  setSharedGameUrl(data.shareUrl);
                  const url = `${hostGameUrl}?hostId=${hostPlayerId}&gameId=${data.gameId}`;
                  const socket = createWebSocketConnection({
                    url,
                    onMessage: (event) => {
                      try {
                        const payload: SocketPayload = JSON.parse(event.data);
                        if (payload.type !== LiveSharePayloadType.GAMESTATE) return;
                        const { playerList, gameHistoryList } = payload.gameState!;
                        set({ isGameStarted: true, playerList, gameHistoryList });
                      } catch (e) {
                        console.error('[HOST] - Error parsing message:', e);
                      }
                    },
                    onClose: (event) => {
                      if (event.wasClean) {
                        set({ socket: null });
                      } else {
                        set({ socket: null, gameId: null, hostId: null });
                      }
                    },
                    onError: (event) => console.error('[HOST] - Socket error:', event),
                  });
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
          const url = `${viewBaseUrl}?gameId=${gameId}`;
          const socket = createWebSocketConnection({
            url,
            onOpen: () => {
              set({ isViewer: true });
            },
            onMessage: (event) => {
              const payload: SocketPayload = JSON.parse(event.data);
              if (!payload.gameState) return;
              const { playerList, gameHistoryList } = payload.gameState;
              set({ isGameStarted: true, playerList, gameHistoryList });
            },
            onClose: (event) => {
              if (event.wasClean) {
                set({ socket: null });
              } else {
                set({ socket: null, gameId: null, hostId: null });
              }
            },
            onError: (event) => console.error('[VIEWER] - Socket error:', event),
          });
          set({ socket });
        },

        reconnectSocket: () => {
          const { hostId, gameId, socket } = get();
          if (hostId && gameId && !socket) {
            const socketServerBaseUrl = import.meta.env.VITE_SOCKET_SERVER_BASE_URL || 'http://localhost:8080';
            const hostGameUrl = `${socketServerBaseUrl}/hostGame`;
            const url = `${hostGameUrl}?hostId=${hostId}&gameId=${gameId}`;
            const socket = createWebSocketConnection({
              url,
              onClose: (event) => {
                if (event.wasClean) {
                  set({ socket: null });
                } else {
                  set({ socket: null, gameId: null, hostId: null });
                }
              },
              onError: (event) => console.error('[HOST] - Socket error:', event),
            });
            set({ socket });
          }
        },

        disconnectLiveShare: () => {
          const { socket } = get();
          if (socket) socket.close();
          set({ socket: null, gameId: null, hostId: null });
        },

        emitToSocket(payLoad) {
          const { socket } = get();
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ gameState: { ...payLoad } }));
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
