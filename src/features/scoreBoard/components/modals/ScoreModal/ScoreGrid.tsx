import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ScoreGridProps {
  scores: number[];
  onSelect: (score: number) => void;
  onBarrer: () => void;
  onReset: () => void;
}

export const ScoreGrid: FC<ScoreGridProps> = ({ scores, onSelect, onBarrer, onReset }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={`grid ${scores.length === 1 ? '' : 'grid-cols-3'} gap-3`}>
        {scores.length === 1 ? (
          <div className="mx-auto">
            <button
              onClick={() => onSelect(scores[0])}
              className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold py-6 px-12 rounded-xl transition-colors text-3xl shadow-sm hover:shadow-md">
              {scores[0]}
            </button>
          </div>
        ) : (
          scores.map((score) => (
            <button
              key={score}
              onClick={() => onSelect(score)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold py-4 px-6 rounded-xl transition-colors text-xl shadow-sm hover:shadow-md">
              {score}
            </button>
          ))
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onReset}
          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold py-4 rounded-xl transition-colors text-xl shadow-sm hover:shadow-md">
          {t('scoreModal.common.reset')}
        </button>
        <button
          onClick={onBarrer}
          className=" flex justify-center items-center w-full bg-red-100 hover:bg-red-200 text-red-900 font-bold py-4 rounded-xl transition-colors text-xl shadow-sm hover:shadow-md">
          {t('scoreModal.common.cross-out')}
        </button>
      </div>
    </>
  );
};
