export type UpperCategory = 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes';
export type LowerCategory = 'threeOfAKind' | 'fourOfAKind' | 'fullHouse' | 'smallStraight' | 'largeStraight' | 'yahtzee' | 'chance';
export type BonusCategory = 'bonus';
export type ScoreCategory = UpperCategory | LowerCategory | BonusCategory;

export enum SectionEnum {
  upper = 'upper',
  lower = 'lower',
}

export enum LiveShareHostStatus {
  HOST_DISCONNECTED = 'HostDisconnected',
  HOST_NEVER_CONNECTED = 'HostNeverConnected',
  HOST_CONNECTED = 'HostConnected',
}

export enum LiveSharePayloadType {
  VIEWER_JOINED = 'viewerJoined',
  GAMESTATE = 'gameState',
}

export interface SocketPayload {
  type: LiveShareHostStatus | LiveSharePayloadType;
  message: string;
  gameState?: {
    playerList: Player[];
    gameHistoryList: GameHistory[];
  };
  playerId?: string;
}

export type ScoreState = 'crossed' | number | undefined;
export type TotalRowVariant = 'default' | 'bonus' | 'total';

interface BaseScoreCategoryUI {
  name: string;
  description: string;
  section: SectionEnum;
  icon: string;
  color: string;
}
interface StandardScoreCategoryUI extends BaseScoreCategoryUI {
  id: UpperCategory | LowerCategory;
  maxScore: number;
}

interface BonusScoreCategoryUI extends BaseScoreCategoryUI {
  id: 'bonus';
}

export type ScoreCategoryUI = StandardScoreCategoryUI | BonusScoreCategoryUI;

interface BasePlayer {
  id: string;
  name: string;
}
interface PlayerLeaderBoard extends BasePlayer {
  score: number;
}

export interface Player extends BasePlayer {
  scores: Partial<Record<ScoreCategory, ScoreState>>;
}
export interface GameHistory {
  id: string;
  date: string;
  players: PlayerLeaderBoard[];
  winnerId: string;
}

export interface GameState {
  players: Player[];
  isGameStarted: boolean;
  gameHistory: GameHistory[];
}

export type Leaderboard = PlayerLeaderBoard[];

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  highestScore: number;
  averageScore: number;
  name: string;
}

export interface Score {
  value: ScoreState;
  playerId: string;
  category: ScoreCategory;
}
