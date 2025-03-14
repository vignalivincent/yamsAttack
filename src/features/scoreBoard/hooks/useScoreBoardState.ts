import { useCallback, useEffect, useRef } from 'react';
import { ScoreCategoryUI } from '@/types/game';
import { useIsGameEnded } from '@/store/selectors';
import { useScoreBoardContext } from '../context/useScoreBoardContext';

export const useScoreBoardState = () => {
  const { selectedCell, focusedCategory, setFocusedCategory, isExpanded, setIsExpanded, isBonusExpanded, setIsBonusExpanded, setVictoryModalOpen } =
    useScoreBoardContext();

  const victoryModalShownRef = useRef(false);
  const hasEnded = useIsGameEnded();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-cell') && (focusedCategory || isBonusExpanded)) {
        setFocusedCategory(null);
        setIsBonusExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [focusedCategory, isBonusExpanded, setFocusedCategory, setIsBonusExpanded]);

  useEffect(() => {
    if (hasEnded && !victoryModalShownRef.current) {
      victoryModalShownRef.current = true;
      setVictoryModalOpen(true);
    }
  }, [hasEnded, setVictoryModalOpen]);

  const handleCategoryFocus = useCallback(
    (category: ScoreCategoryUI) => {
      if (isExpanded) return;
      setFocusedCategory(focusedCategory === category ? null : category);
      setIsBonusExpanded(false);
    },
    [isExpanded, setFocusedCategory, setIsBonusExpanded, focusedCategory]
  );

  const handleToggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
    setFocusedCategory(null);
    setIsBonusExpanded(false);
  }, [setIsExpanded, setFocusedCategory, setIsBonusExpanded, isExpanded]);

  const handleToggleBonusExpand = useCallback(() => {
    if (isExpanded) return;
    setIsBonusExpanded(!isBonusExpanded);
    setFocusedCategory(null);
  }, [isExpanded, setIsBonusExpanded, setFocusedCategory, isBonusExpanded]);

  return {
    selectedCell,
    focusedCategory,
    isExpanded,
    isBonusExpanded,
    handleCategoryFocus,
    handleToggleExpand,
    handleToggleBonusExpand,
  };
};
