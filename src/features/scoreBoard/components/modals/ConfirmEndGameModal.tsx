import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@/ui/components/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useScoreBoardModals } from '../../hooks/useScoreBoardModals';
import { useScoreBoardActions } from '../../hooks/useScoreBoardActions';

export const ConfirmEndGameModal: FC = () => {
  const { confirmEndGameOpen: isOpen, closeConfirmEndGameModal: onClose } = useScoreBoardModals();
  const { handleEndGameClick } = useScoreBoardActions();
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent fullWidth className="space-y-6">
        <DialogTitle className="sr-only">{t('game.endGame.title')}</DialogTitle>
        <div className="text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600">{t('game.endGame.title')}</h2>
          <p className="text-lg text-gray-600">{t('game.endGame.description')}</p>
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition-colors text-lg">
            {t('common.cancel')}
          </button>
          <button onClick={handleEndGameClick} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl transition-colors text-lg">
            {t('common.confirm')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
