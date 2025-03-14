import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { InfoMessage } from '@/ui/components/infoMessage';
import { AddPlayerForm } from './AddPlayerForm';
import { PlayerCard } from './PlayerCard';
import { useActions, useCanAddPlayer, usePlayerList } from '@/store/selectors';

export const PlayersList: FC = () => {
  const { t } = useTranslation();
  const players = usePlayerList();
  const canAddPlayer = useCanAddPlayer();
  const { addPlayer, removePlayer } = useActions();

  const handleAddPlayer = (name: string): boolean => {
    const playerExists = players.some((player) => player.name.toLowerCase() === name.toLowerCase());
    if (playerExists) {
      return false;
    }
    addPlayer(name);
    return true;
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex flex-col gap-4">
        <AddPlayerForm onAdd={handleAddPlayer} canAddPlayer={canAddPlayer} />

        <div className="flex-1 grid content-start gap-3 min-h-0 overflow-y-auto pr-1 lg:pr-2">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} onRemove={removePlayer} />
          ))}

          {players.length === 0 && (
            <div className="flex items-center justify-center h-[40vh] lg:h-[50vh]">
              <InfoMessage>{t('players.status.empty')}</InfoMessage>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
