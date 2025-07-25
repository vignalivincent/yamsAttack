import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@/ui/components/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useScoreBoardModals } from '../../hooks/useScoreBoardModals';
import { useSharedGameUrl } from '@/store/selectors';
import { toast } from '@/ui/hooks/use-toast';
import { TOAST_MESSAGES } from '@/constants/toastMessages';

export const SharedGameUrlModal: FC = () => {
  const { sharedGameUrlModalOpen: isOpen, closeSharedGameUrlModal: onClose } = useScoreBoardModals();
  const sharedUrl = useSharedGameUrl();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!sharedUrl) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    toast({
      variant: TOAST_MESSAGES.copied.variant,
      title: t(TOAST_MESSAGES.copied.title),
      description: t(TOAST_MESSAGES.copied.description),
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent fullWidth className="space-y-6">
        <DialogTitle className="sr-only">{t('sharedUrl.title')}</DialogTitle>
        <div className="text-center space-y-4">
          <div className="text-6xl">📋</div>
          <h2 className="text-2xl font-bold text-purple-700">{t('sharedUrl.title')}</h2>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500">{t('sharedUrl.hint')}</p>
            <input
              type="text"
              value={sharedUrl}
              readOnly
              className="w-full text-center text-xs bg-gray-100 rounded-lg px-3 py-2 border border-gray-300 font-mono select-all"
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={handleCopy}
              className={`text-center flex items-center gap-2 font-bold py-2 px-4 rounded-lg transition-colors text-base
                ${copied ? 'bg-green-500 text-white ' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
              aria-live="polite">
              <span>{copied ? t('common.copied') : t('common.copy')}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
