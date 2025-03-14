import { FC } from 'react';

interface VictoryPlayerCardProps {
  name: string;
  score: number;
  index: number;
}

export const VictoryPlayerCard: FC<VictoryPlayerCardProps> = ({ name, score, index }) => {
  const getRankEmoji = (position: number): string => {
    switch (position) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
      <div className="flex items-center gap-2">
        <span className="text-lg">{getRankEmoji(index)}</span>
        <span className="font-medium text-purple-900">{name}</span>
      </div>
      <span className="font-bold text-purple-900">{score}</span>
    </div>
  );
};
