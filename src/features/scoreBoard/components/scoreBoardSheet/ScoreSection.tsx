import { FC } from 'react';
import { ScoreCategoryUI, SectionEnum } from '@/types/game';
import { CategoryCell } from './CategoryCell';
import { cn } from '@/utils/cn';
import { getCellHeightStyle, getFocusedCategoryStyle, getGridTemplateColumns, getSectionSpacingClass } from '../../utils';
import { ScoreCell } from './ScoreCell';
import { useScoreBoardActions } from '../../hooks/useScoreBoardActions';
import { useScoreBoardState } from '../../hooks/useScoreBoardState';
import { useIsGameEnded, usePlayerList } from '@/store/selectors';

interface ScoreSectionProps {
  categories: ScoreCategoryUI[];
}

export const ScoreSection: FC<ScoreSectionProps> = ({ categories }) => {
  const playerList = usePlayerList();
  const isGameEnded = useIsGameEnded();
  const { handleCellClick } = useScoreBoardActions();
  const { handleCategoryFocus, focusedCategory, isExpanded } = useScoreBoardState();

  const isLowerSection = categories.every((c) => c.section === SectionEnum.lower);
  const sectionSpacingClass = getSectionSpacingClass(isLowerSection);
  const gridTemplateColumns = getGridTemplateColumns(playerList.length);
  const cellHeightStyle = getCellHeightStyle();

  return (
    <div className="relative">
      <div
        className="grid gap-x-2"
        style={{
          gridTemplateColumns: gridTemplateColumns.main,
        }}>
        <div className={cn('relative', sectionSpacingClass)}>
          {categories.map((category, index) => (
            <div key={category.id} style={cellHeightStyle}>
              <CategoryCell
                category={category}
                isExpanded={isExpanded}
                isFocused={!isExpanded && focusedCategory?.id === category.id}
                onFocus={handleCategoryFocus}
                style={!isExpanded && focusedCategory?.id === category.id ? getFocusedCategoryStyle(index, isLowerSection) : undefined}
              />
            </div>
          ))}
        </div>

        <div
          className="grid gap-x-1 w-full"
          style={{
            gridTemplateColumns: gridTemplateColumns.players,
          }}>
          {playerList.map((player) => (
            <div key={player.id} className={cn('min-w-0', sectionSpacingClass)}>
              {categories.map((category) => (
                <ScoreCell key={category.id} player={player} category={category} onSelect={handleCellClick} isGameEnded={isGameEnded} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
