import { FC } from 'react';
import { cn } from '@/utils/cn';
import { CategoryCell } from './CategoryCell';
import { SCORE_CATEGORIES } from '../../../../constants/categories';
import { getCellClassName } from '../../utils';
import { TotalRowVariant } from '@/types/game';
import { useScoreBoardState } from '../../hooks/useScoreBoardState';
import { usePlayerList } from '@/store/selectors';

interface TotalRowProps {
  values: number[];
  isBonus?: boolean;
}

export const TotalRow: FC<TotalRowProps> = ({ values, isBonus }) => {
  const variant: TotalRowVariant = isBonus ? 'bonus' : 'total';
  const playerList = usePlayerList();
  const { isBonusExpanded, handleToggleBonusExpand, isExpanded } = useScoreBoardState();

  if (isBonus) {
    const bonusCategory = SCORE_CATEGORIES.find((cat) => cat.id === 'bonus')!;

    return (
      <div className="grid gap-x-2" style={{ gridTemplateColumns: '44px minmax(0, 1fr)' }}>
        <CategoryCell category={bonusCategory} isExpanded={isExpanded} isFocused={isBonusExpanded} onFocus={handleToggleBonusExpand} />
        <div className="grid gap-x-1" style={{ gridTemplateColumns: `repeat(${playerList.length}, 1fr)` }}>
          {values.map((value, index) => (
            <div key={index} className={cn('h-12 flex items-center justify-center font-bold rounded-lg', getCellClassName(value, variant, isBonus))}>
              {value}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-x-2" style={{ gridTemplateColumns: '44px minmax(0, 1fr)' }}>
      <div className="h-12"></div>

      <div className="grid gap-x-1" style={{ gridTemplateColumns: `repeat(${playerList.length}, 1fr)` }}>
        {values.map((value, index) => (
          <div key={index} className={cn('h-12 flex items-center justify-center font-bold text-base rounded-lg', getCellClassName(value, variant))}>
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};
