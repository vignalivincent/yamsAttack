import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface WinnerCardProps {
  name: string;
  score: number;
}

export const WinnerCard: FC<WinnerCardProps> = ({ name, score }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-4">
      <div className="text-6xl animate-bounce">🏆</div>
      <h2 className="text-3xl font-bold text-purple-900">{t('victory.title')}</h2>
      <p className="text-xl text-purple-600">
        <b>{name}</b> {t('victory.winner')}
      </p>
      <div className="inline-block border-2 border-purple-900 rounded-lg px-4 py-2">
        <p className="text-2xl font-bold text-purple-900">
          {score} {t('victory.points')}
        </p>
      </div>
    </div>
  );
};
