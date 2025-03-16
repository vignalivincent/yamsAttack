import { BONUS } from '@/constants/bonus';
import { SCORE_CATEGORIES } from '@/constants/categories';
import { BonusCategory, GameHistory, Leaderboard, Player, PlayerStats, Score, ScoreCategory, ScoreState, SectionEnum } from '@/types/game';
import { toast } from '@/ui/hooks/use-toast';

export const getMaxScore = (category: ScoreCategory): number => {
  const standardCategory = category as Exclude<ScoreCategory, BonusCategory>;
  const categoryData = SCORE_CATEGORIES.find((c) => c.id === standardCategory);
  if (categoryData && 'maxScore' in categoryData) {
    return categoryData.maxScore;
  }
  return 0;
};

export const calculateSectionTotal = (player: Player, section: SectionEnum): number => {
  const sectionCategoryIds = SCORE_CATEGORIES.filter((category) => category.section === section).map((category) => category.id);

  return sectionCategoryIds.reduce((total, categoryId) => {
    const score = player.scores[categoryId];
    return total + (typeof score === 'number' ? score : 0);
  }, 0);
};

export const getScoreStyle = (score: ScoreState | undefined, maxScore: number): string => {
  if (score === undefined) return 'bg-transparent';
  if (score === 'crossed') return 'text-red-500 font-bold text-xl bg-transparent';
  if (score === 0) return 'bg-red-50 border border-red-200';
  if (score === maxScore) return 'bg-emerald-50 border border-emerald-200';

  const percentage = score / maxScore;
  if (percentage <= 0.33) return 'bg-red-50';
  if (percentage <= 0.66) return 'bg-yellow-50';
  return 'bg-green-50';
};

export const getUpperBonus = (player: Player): number => {
  const upperTotal = calculateSectionTotal(player, SectionEnum.upper);
  return upperTotal >= BONUS.upper.threshold ? BONUS.upper.value : 0;
};

export const calculateTotal = (player: Player): number => {
  const upperTotal = calculateSectionTotal(player, SectionEnum.upper);
  const lowerTotal = calculateSectionTotal(player, SectionEnum.lower);
  const bonus = getUpperBonus(player);
  return upperTotal + lowerTotal + bonus;
};

export const getLeaderboard = (players: Player[]): Leaderboard => {
  return players
    .map((player) => ({
      id: player.id,
      name: player.name,
      score: calculateTotal(player),
      upperSectionTotal: calculateSectionTotal(player, SectionEnum.upper),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.upperSectionTotal - a.upperSectionTotal;
    });
};

export const computeActivePlayerListStat = (players: Player[], gameHistory: GameHistory[]): PlayerStats[] => {
  return players
    .map((player) => {
      const playerGames = gameHistory.filter((game) => game.players.some((p) => p.id === player.id));

      if (playerGames.length === 0) {
        return {
          gamesPlayed: 0,
          wins: 0,
          highestScore: 0,
          averageScore: 0,
          name: player.name,
        };
      }

      const scores = playerGames.map((game) => game.players.find((p) => p.id === player.id)?.score || 0);
      const totalScore = scores.reduce((sum, score) => sum + score, 0);

      return {
        gamesPlayed: playerGames.length,
        wins: gameHistory.filter((game) => game.winnerId === player.id).length,
        highestScore: Math.max(...scores),
        name: player.name,
        averageScore: Math.round(totalScore / scores.length),
      };
    })
    .filter((stats) => stats.name)
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.averageScore - a.averageScore;
    });
};

const hasUnlockedUpperBonus = (player: Player, playerList: Player[]): boolean => {
  const previousPlayer = playerList.find((p) => p.id === player.id);
  if (!previousPlayer) return false;

  // Calculate upper section scores
  const upperCategories = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];

  const previousSum = upperCategories.reduce((sum, category) => {
    const score = previousPlayer.scores[category as ScoreCategory];
    return sum + (typeof score === 'number' ? score : 0);
  }, 0);

  const currentSum = upperCategories.reduce((sum, category) => {
    const score = player.scores[category as ScoreCategory];
    return sum + (typeof score === 'number' ? score : 0);
  }, 0);

  return previousSum < 63 && currentSum >= 63;
};

export const handleScoreNotification = (player: Player, score: Score, playerList: Player[]) => {
  const { category, value } = score;

  if (value === 'crossed') {
    toast({
      title: 'Ouch! Zero points',
      description: `${player.name} scored a big fat ZERO in ${category}. Better luck next time!`,
      variant: 'destructive',
    });
    return;
  }

  if (value === getMaxScore(category)) {
    toast({
      title: 'Perfect Score!',
      description: `${player.name} got a maximum score in ${category}. Impressive!`,
      variant: 'success',
    });
    return;
  }

  if (hasUnlockedUpperBonus(player, playerList)) {
    toast({
      title: 'Bonus Unlocked!',
      description: `${player.name} just unlocked the 35-point upper section bonus!`,
      variant: 'success',
    });
    return;
  }

  toast({
    title: 'Score Registered',
    description: `${player.name} scored ${value} points in ${category}`,
    variant: 'default',
  });
};

export const getLatestScoreFromStack = (current: Score[]): Score => {
  return current[current.length - 1];
};
