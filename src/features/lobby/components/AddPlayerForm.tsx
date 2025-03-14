import { FC, useState, KeyboardEvent } from 'react';
import { Button } from '@/ui/components/button';
import { Input } from '@/ui/components/input';
import { useToast } from '@/ui/hooks/use-toast';
import { generateBarbaName } from '@/features/lobby/services/nameGenerator';
import { t } from 'i18next';
import { TOAST_MESSAGES } from '@/constants/toastMessages';
import { MAX_NAME_LENGTH } from '@/constants/maxPlayerNameLength';

interface AddPlayerFormProps {
  onAdd: (name: string) => boolean;
  canAddPlayer: boolean;
}

export const AddPlayerForm: FC<AddPlayerFormProps> = ({ onAdd, canAddPlayer }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const preventAddPlayer = !canAddPlayer;

  const handleAdd = () => {
    if (name.trim()) {
      const success = onAdd(name.trim());
      if (preventAddPlayer) {
        toast({
          variant: TOAST_MESSAGES.maxPlayers.variant,
          title: t(TOAST_MESSAGES.maxPlayers.title),
          description: t(TOAST_MESSAGES.maxPlayers.description),
        });
      } else if (!success) {
        toast({
          variant: TOAST_MESSAGES.playerExists.variant,
          title: t(TOAST_MESSAGES.playerExists.title),
          description: t(TOAST_MESSAGES.playerExists.description),
        });
      } else {
        toast({
          variant: TOAST_MESSAGES.playerAdded.variant,
          title: t(TOAST_MESSAGES.playerAdded.title),
          description: t(TOAST_MESSAGES.playerAdded.description),
        });
        setName('');
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_NAME_LENGTH) {
      setName(value);
    }
  };

  const generateRandomName = () => {
    setName(generateBarbaName());
  };

  const placeholder = t('players.input.placeholder');
  const addLabel = t('players.actions.add');

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="flex-1 flex gap-2">
        <Input
          placeholder={`${placeholder} (max ${MAX_NAME_LENGTH} caractères)`}
          value={name}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          maxLength={MAX_NAME_LENGTH}
          className="flex-1 bg-white/80 border-purple-200 placeholder:text-purple-900/50 text-purple-950 font-medium text-base lg:text-lg h-12 sm:h-14 rounded-lg focus:ring-2 focus:ring-purple-500/50"
        />
        <Button
          onClick={generateRandomName}
          className="shrink-0 bg-purple-500/90 hover:bg-purple-500 text-white w-12 sm:w-14 h-12 sm:h-14 rounded-lg flex items-center justify-center">
          🎲
        </Button>
      </div>
      <Button
        onClick={handleAdd}
        disabled={!name.trim()}
        className="w-full sm:w-40 bg-purple-600/90 hover:bg-purple-600 text-white font-semibold text-base lg:text-lg h-12 sm:h-14 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50">
        {addLabel}
      </Button>
    </div>
  );
};
