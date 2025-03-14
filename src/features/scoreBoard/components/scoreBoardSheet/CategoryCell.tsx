import { FC, CSSProperties } from 'react';
import { cn } from '@/utils/cn';
import { ScoreCategoryUI, SectionEnum } from '@/types/game';
import { getMaxScore } from '@/store/utils';
import { t } from 'i18next';

interface CategoryCellProps {
  category: ScoreCategoryUI;
  isExpanded?: boolean;
  isFocused?: boolean;
  style?: CSSProperties;
  onFocus?: (category: ScoreCategoryUI) => void;
}

export const CategoryCell: FC<CategoryCellProps> = ({ category, isExpanded = false, isFocused = false, style, onFocus }) => {
  const showContent = isExpanded || isFocused;

  return (
    <>
      <div className="relative transition-all duration-300 ease-in-out h-12 category-cell" style={style}>
        <div
          role="button"
          onClick={() => !isExpanded && onFocus?.(category)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg transition-all cursor-pointer hover:brightness-110 h-12',
            showContent
              ? 'absolute left-0 w-[calc(100vw-4rem)] px-3 shadow-lg bg-gradient-to-r from-purple-300 to-indigo-400'
              : cn('w-full justify-center bg-gradient-to-r', category.color)
          )}>
          {!showContent && category.id !== 'bonus' && category.section === SectionEnum.lower && (
            <div className="absolute -top-1.5 border border-purple-600 bg-purple-600 text-[10px] text-white font-semibold text-center left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-[1px] px-1 rounded-full shadow-md whitespace-nowrap">
              {t(`ShortCategoryName.${category.id}`)}
            </div>
          )}
          <div className="flex items-center justify-center bg-white/10 rounded-lg shrink-0 w-8 h-8">{category.icon}</div>
          {showContent && (
            <div className="flex justify-between items-center p-2 min-w-0 flex-1">
              <div>
                <div className="font-bold text-white truncate text-sm">{category.name}</div>
                <div className="text-xs text-white/90 truncate">{category.description}</div>
              </div>
              {category.id !== 'chance' && category.section === SectionEnum.lower && (
                <div className="flex items-center gap-1 text-xs text-white/90 truncate">
                  <span className="bg-white/20 rounded-full px-2 py-1 font-black">{`+ ${getMaxScore(category.id)} Pts`}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
