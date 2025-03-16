import { FC, useState } from 'react';
import { ChanceInput } from './ChanceInput';
import { ScoreGrid } from './ScoreGrid';
import { ModalHeader } from './ModalHeader';
import { Dialog, DialogContent, DialogTitle } from '@/ui/components/dialog';
import { Score } from '@/types/game';
import { useActions, usePlayerList } from '@/store/selectors';
import { getPotentialScoreListByCategory } from '../../../../../constants/potentialScore';
import { useScoreBoardModals } from '../../../hooks/useScoreBoardModals';
import { SCORE_CATEGORIES } from '@/constants/categories';
import { useScoreBoardState } from '@/features/scoreBoard/hooks/useScoreBoardState';

interface ScoreModalProps {
  onYahtzee: () => void;
}

export const ScoreModal: FC<ScoreModalProps> = ({ onYahtzee }) => {
  const { selectedCell } = useScoreBoardState();
  const playerList = usePlayerList();
  const { scoreModalOpen: isOpen, closeScoreModal: onClose } = useScoreBoardModals();
  const { addScore, revertScore } = useActions();
  const [chanceValue, setChanceValue] = useState<string>('');

  const category = SCORE_CATEGORIES.find((c) => c.id === selectedCell!.category)!;
  const player = playerList.find((p) => p.id === selectedCell!.playerId)!;
  const { name } = player;

  const potentialScoreList = getPotentialScoreListByCategory(category.id);

  const handleScore = (value: Score['value']): void => {
    if (category.id === 'yahtzee' && typeof value === 'number') {
      onYahtzee();
    }
    if (!value) {
      revertScore({
        playerId: player.id,
        category: category.id,
      });
    } else {
      addScore({
        playerId: player.id,
        category: category.id,
        value,
      });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent fullWidth className="space-y-6">
        <DialogTitle className="sr-only">
          Score pour {category.name} - {name}
        </DialogTitle>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-full shadow-lg border-2 border-white/30 font-bold text-lg text-center">
            {name}
          </div>
          <ModalHeader title={category.name} description={category.description} onClose={onClose} />
        </div>

        {category.id === 'chance' ? (
          <ChanceInput
            value={chanceValue}
            onChange={setChanceValue}
            onSubmit={() => handleScore(parseInt(chanceValue))}
            onReset={() => handleScore(undefined)}
          />
        ) : (
          <ScoreGrid
            scores={potentialScoreList}
            onSelect={(score) => handleScore(score)}
            onBarrer={() => handleScore('crossed')}
            onReset={() => handleScore(undefined)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
