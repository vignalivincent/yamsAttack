import { BONUS } from '@/constants/bonus';
import { SCORE_CATEGORIES, upperCategories } from '@/constants/categories';
import { TOAST_MESSAGES } from '@/constants/toastMessages';
import { BonusCategory, GameHistory, Leaderboard, Player, PlayerStats, Score, ScoreCategory, ScoreState, SectionEnum } from '@/types/game';
import { toast } from '@/ui/hooks/use-toast';
import i18next from 'i18next';

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

const hasUnlockedUpperBonus = (scoreStack: Score[], player: Player): boolean => {
  const newScore = scoreStack[scoreStack.length - 1];
  const { category, value, playerId } = newScore;

  if (upperCategories.includes(category) && typeof value === 'number' && playerId === player.id) {
    const previousTotal = calculateSectionTotal(player, SectionEnum.upper);
    const newTotal = previousTotal + value;
    if (previousTotal < BONUS.upper.threshold && newTotal >= BONUS.upper.threshold) {
      return true;
    }
  }
  return false;
};

export const handleScoreNotification = (scoreStack: Score[], player: Player) => {
  const score = scoreStack[scoreStack.length - 1];
  const { category, value } = score;

  const { t } = i18next;
  if (hasUnlockedUpperBonus(scoreStack, player)) {
    toast({
      title: t(TOAST_MESSAGES.unlockBonus.title),
      description: t(TOAST_MESSAGES.unlockBonus.description, { name: player.name }),
      variant: TOAST_MESSAGES.unlockBonus.variant,
    });
    return;
  }

  if (value === 'crossed') {
    toast({
      title: t(TOAST_MESSAGES.zeroScore.title),
      description: t(TOAST_MESSAGES.zeroScore.description, { name: player.name }),
      variant: TOAST_MESSAGES.zeroScore.variant,
    });
    return;
  }

  if (value === getMaxScore(category)) {
    toast({
      title: t(TOAST_MESSAGES.maxScore.title),
      description: t(TOAST_MESSAGES.maxScore.description, { name: player.name, category: t(`scoreCategories.${category}`) }),
      variant: TOAST_MESSAGES.maxScore.variant,
    });
    return;
  }
};

export const getLatestScoreFromStack = (current: Score[]): Score => {
  return current[current.length - 1];
};
