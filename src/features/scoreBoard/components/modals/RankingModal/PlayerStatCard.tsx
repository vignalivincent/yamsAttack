import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface PlayerStatCardProps {
  name: string;
  wins: number;
  gamesPlayed: number;
  averageScore: number;
  rank: number;
}

export const PlayerStatCard: FC<PlayerStatCardProps> = ({ name, wins, gamesPlayed, averageScore, rank }) => {
  const { t } = useTranslation();

  return (
    <div className="p-3 rounded-lg bg-purple-50 space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : ''}</span>
          <span className="font-semibold text-purple-900">{name}</span>
        </div>
        <span className="font-medium text-purple-700">
          {wins} {t('ranking.victories')}
        </span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="text-purple-600">
          {t('ranking.gamesPlayed')}: <span className="font-medium">{gamesPlayed}</span>
        </div>
        <div className="text-purple-600">
          {t('ranking.averageScore')}: <span className="font-medium">{averageScore}</span>
        </div>
      </div>
    </div>
  );
};
