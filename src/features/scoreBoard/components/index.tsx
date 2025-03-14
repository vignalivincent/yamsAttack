import { FC } from 'react';
import { SectionEnum } from '@/types/game';
import { ScoreModal } from './modals/ScoreModal';
import { VictoryModal } from './modals/VictoryModal';
import { RankingModal } from './modals/RankingModal';
import { ConfirmEndGameModal } from './modals/ConfirmEndGameModal';
import { PlayersHeader } from './scoraBoardLayout/PlayersHeader';
import { ScoreSection } from './scoreBoardSheet/ScoreSection';
import { TotalRow } from './scoreBoardSheet/TotalRow';
import { GameActions } from './scoraBoardLayout/GameActions';
import { SCORE_CATEGORIES } from '../../../constants/categories';
import { YahtzeeAnimation } from '../animations/YahtzeeAnimation';
import { useYahtzeeAnimation } from '../hooks/useYahtzeeAnimation';
import { calculateSectionTotal, getUpperBonus } from '@/store/utils';
import { useScoreBoardState } from '../hooks/useScoreBoardState';
import { usePlayerList } from '@/store/selectors';
import { ScoreBoardProvider } from '../context/scoreBoardContextProvider';

const ScoreBoardContent: FC = () => {
  const players = usePlayerList();

  const { playAnimation, isAnimationActive, handleAnimationComplete, animationDuration } = useYahtzeeAnimation();

  const { selectedCell, isExpanded, handleToggleExpand } = useScoreBoardState();

  const upperCategories = SCORE_CATEGORIES.filter((cat) => cat.section === SectionEnum.upper && cat.id !== 'bonus');
  const lowerCategories = SCORE_CATEGORIES.filter((cat) => cat.section === SectionEnum.lower);

  const upperTotals = players.map((player) => calculateSectionTotal(player, SectionEnum.upper));
  const lowerTotals = players.map((player) => calculateSectionTotal(player, SectionEnum.lower));
  const bonusValue = players.map((player) => getUpperBonus(player));

  return (
    <>
      <PlayersHeader isExpanded={isExpanded} onToggleExpand={handleToggleExpand} />

      <div className="mt-2">
        <ScoreSection categories={upperCategories} />

        <div className="category-cell space-y-2">
          <TotalRow values={upperTotals} />
          <TotalRow values={bonusValue} isBonus />
        </div>
      </div>

      <div className="space-y-2 mt-8">
        <ScoreSection categories={lowerCategories} />
        <TotalRow values={lowerTotals} />
      </div>

      <GameActions />

      {selectedCell && <ScoreModal onYahtzee={playAnimation} />}

      <VictoryModal />
      <RankingModal />
      <ConfirmEndGameModal />
      <YahtzeeAnimation isActive={isAnimationActive} onComplete={handleAnimationComplete} duration={animationDuration} />
    </>
  );
};

export const ScoreBoard: FC = () => {
  return (
    <ScoreBoardProvider>
      <ScoreBoardContent />
    </ScoreBoardProvider>
  );
};
